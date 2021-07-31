import { createSlice } from "@reduxjs/toolkit";
import { checkPIN } from "./ATMSlice";
import { RootState } from "../store";

export interface UserState {
  balance: number;
}

const initialState: UserState = {
  balance: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(checkPIN.fulfilled, (state, action) => {
      state.balance = action.payload;
    });
  },
});

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
