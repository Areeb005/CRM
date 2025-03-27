import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  token: string | null;
  logo: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  logo: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setLogo: (state, action: PayloadAction<string | null>) => {
      state.logo = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
    },
  },
});

export const { setUser, setToken, logout , setLogo} = authSlice.actions;
export default authSlice.reducer;
