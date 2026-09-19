import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import { IUser } from "../../types";

interface AuthState {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: api.getStoredUser(),
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      return await api.login(email, password);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed"
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    {
      userName,
      email,
      password,
    }: { userName: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      await api.register(userName, email, password);
      return await api.login(email, password);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Registration failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      api.logout();
      state.user = null;
      state.token = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
