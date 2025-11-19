// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialAuthenticationState = {
  isAuthenticated: false,
  token: ''
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthenticationState,
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      // persist token to localStorage whenever loginSuccess happens
      localStorage.setItem('token', action.payload.token);
    },
    loginFail(state, action) {
      state.isAuthenticated = false;
      state.token = '';
      state.error = action.payload?.error || 'Login failed';
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = '';
      localStorage.removeItem('token'); // remove token on logout
    },
  },
});

export const { loginSuccess, loginFail, logout } = authSlice.actions;
export default authSlice.reducer;
