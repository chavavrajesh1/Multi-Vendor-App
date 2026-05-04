import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    userInfo: any | null;
    token: string | null;
}

const storedUser = localStorage.getItem("userInfo");

const initialState: AuthState = {
    userInfo: storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null,
    token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: any; token: string }>) => {
            state.userInfo = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token);
        },
        logout: (state) => {
            state.userInfo = null;
            state.token = null;
            localStorage.removeItem("userInfo");
            localStorage.removeItem("token");
        },
        updateUserInfo: (state, action: PayloadAction<any>) => {
            state.userInfo = action.payload;
            localStorage.setItem("userInfo", JSON.stringify(action.payload));
        },
    },
});

export const { setCredentials, logout, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;