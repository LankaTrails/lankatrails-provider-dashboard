import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api, { setAccessToken } from '@/api/axiosInstance';
import type { User } from '@/types/authTypes';

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

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { jwtToken } = res.data.data;
      setAccessToken(jwtToken);
      const profileRes = await api.get('/auth/logged-user');
      console.log('Profile fetched after login:', profileRes.data.data);
      return profileRes.data.data as User;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/refresh-token');
      const { jwtToken } = res.data.data;
      setAccessToken(jwtToken);
      return jwtToken;
    } catch (err: any) {
      return rejectWithValue('Session expired. Please login again.');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/auth/logged-user');
      console.log('Fetched profile:', res.data.data);
      return res.data.data as User;
    } catch {
      return rejectWithValue('Failed to fetch profile');
    }
  }
);

export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Only attempt refresh if we don't already have a valid token
      const newToken = await dispatch(refreshToken()).unwrap();
      if (!newToken) throw new Error('No token received');

      const profile = await dispatch(fetchProfile()).unwrap();
      return profile;
    } catch (error) {
      await dispatch(logoutUser());
      return rejectWithValue('Session restoration failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await api.post('/auth/logout');
  } catch { }
  setAccessToken(null);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionExpired: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = 'Session expired';
    },
    setAuthState: (state, action: PayloadAction<{ isAuthenticated: boolean; user: User | null }>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(restoreSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = 'Session restoration failed';
      });
  }
});

export const { sessionExpired, setAuthState } = authSlice.actions;
export default authSlice.reducer;
