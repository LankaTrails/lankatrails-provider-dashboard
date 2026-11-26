import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { refreshAccessToken, setAccessToken } from "@/api/axiosInstance";
import { errorMessage, toApiError } from "@/lib/apiError";
import type { User } from "@/types/authTypes";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
};

const NOT_PROVIDER = "This account is not a service provider account.";

async function fetchProviderProfile(): Promise<User> {
  const res = await api.get("/auth/logged-user");
  const user = res.data.data as User;
  if (user.role !== "ROLE_PROVIDER") {
    // Tourists and admins must not keep a session in the provider app
    await api.post("/auth/logout").catch(() => undefined);
    setAccessToken(null);
    throw { code: "NOT_PROVIDER", message: NOT_PROVIDER, userMessage: NOT_PROVIDER };
  }
  return user;
}

export const login = createAsyncThunk<User, { email: string; password: string }, { rejectValue: string }>(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      setAccessToken(res.data.data.jwtToken);
      return await fetchProviderProfile();
    } catch (err) {
      setAccessToken(null);
      const apiError = (err as { code?: string }).code === "NOT_PROVIDER" ? err : toApiError(err, "Login failed");
      return rejectWithValue(errorMessage(apiError, "Login failed"));
    }
  },
);

/** Uses the refresh cookie to resume a session after a page reload. */
export const restoreSession = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      await refreshAccessToken();
      return await fetchProviderProfile();
    } catch {
      setAccessToken(null);
      return rejectWithValue("No active session");
    }
  },
);

/** Re-reads the profile after it changed (e.g. the profile modal saved). */
export const refreshProfile = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/refreshProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProviderProfile();
    } catch (err) {
      return rejectWithValue(errorMessage(toApiError(err, "Failed to reload the profile"), "Failed to reload the profile"));
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await api.post("/auth/logout").catch(() => undefined);
  setAccessToken(null);
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionExpired: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = "Your session has expired. Please sign in again.";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = action.payload ?? "Login failed";
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(refreshProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      });
  },
});

export const { sessionExpired } = authSlice.actions;
export default authSlice.reducer;
