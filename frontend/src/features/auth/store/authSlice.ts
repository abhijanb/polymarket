import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { clearAuth, loadUser, getInitialToken } from "@/features/auth/lib/storage";
import type { AuthUser } from "@/features/auth/model/types";
import { authApi } from "../api/authApi";

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  initialized: boolean;
  error: string | null;
};

const initialToken = getInitialToken();

const initialState: AuthState = {
  user: loadUser(),
  token: initialToken,
  // if no token, we are initialized immediately; otherwise wait for me query
  initialized: !initialToken,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) { state.error = null; },
    setError(state, action: PayloadAction<string | null>) { state.error = action.payload; },
    setInitialized(state, action: PayloadAction<boolean>) { state.initialized = action.payload; },
    // manual sync if needed (e.g., logout without RTK)
    setCredentials(state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.initialized = true;
      state.error = null;
    },
    clearCredentials(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.initialized = true;
    }
  },
  extraReducers: (builder) => {
    // me query
    builder.addMatcher(authApi.endpoints.me.matchFulfilled, (state, { payload }) => {
      const token = getInitialToken();
      if (!token) return;
      state.user = payload.user;
      state.token = token;
      state.initialized = true;
      state.error = null;
      try { localStorage.setItem("user", JSON.stringify(payload.user)); } catch {}
    });
    builder.addMatcher(authApi.endpoints.me.matchRejected, (state) => {
      state.user = null;
      state.token = null;
      state.initialized = true;
      clearAuth();
    });
    // login
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.token;
      state.initialized = true;
      state.error = null;
    });
    builder.addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
      const err: any = (action as any).payload;
      const msg = err?.data?.message || err?.message || "Login failed";
      state.error = msg;
    });
    // register
    builder.addMatcher(authApi.endpoints.register.matchFulfilled, (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.token;
      state.initialized = true;
      state.error = null;
    });
    builder.addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
      const err: any = (action as any).payload;
      const data = err?.data;
      const msg = data?.errors?.[0]?.message || data?.message || err?.data?.message || err?.message || "Registration failed";
      state.error = msg;
    });
    // logout
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.initialized = true;
      state.error = null;
    });
    builder.addMatcher(authApi.endpoints.logout.matchRejected, (state) => {
      state.user = null;
      state.token = null;
      state.initialized = true;
    });
  },
});

export const { clearError, setError, setInitialized, setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
