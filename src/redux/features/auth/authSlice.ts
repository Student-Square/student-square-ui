import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserRole, UserStatus, ApiMe } from "@/types/auth";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  user: ApiMe | null;
  status: AuthStatus;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<ApiMe>) {
      state.user = action.payload;
      state.status = "authenticated";
    },
    logout(state) {
      state.user = null;
      state.status = "unauthenticated";
    },
    setStatus(state, action: PayloadAction<AuthStatus>) {
      state.status = action.payload;
    },
  },
});

export const { setUser, logout, setStatus } = authSlice.actions;
export default authSlice.reducer;

// ─── Selectors ───────────────────────────────────────────────────────────────
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.status === "authenticated";
export const selectUserRole = (state: { auth: AuthState }): UserRole | null =>
  state.auth.user?.role ?? null;

// Re-export types so consumers can import from this module
export type { UserRole, UserStatus, ApiMe };
