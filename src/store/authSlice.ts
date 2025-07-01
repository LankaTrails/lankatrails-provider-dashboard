import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { setAccessToken } from '@/api/axiosInstance';

interface ProviderUser {
  id: number;
  email: string;
  role: string;
  emailVerified: boolean;
  businessName: string;
  businessDescription: string;
  logoUrl: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: ProviderUser | null;
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
      return profileRes.data.data as ProviderUser;
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
      return res.data.data as ProviderUser;
    } catch (err: any) {
      return rejectWithValue('Failed to fetch profile');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await api.post('/auth/logout');
  } catch {}
  setAccessToken(null);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => { state.isLoading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
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
      });
  }
});

export default authSlice.reducer;
