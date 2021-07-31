import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import logger from "redux-logger";

import counterReducer from "../features/counter/counterSlice";
import ATMReducer from "./stores/ATMSlice";
import userReducer from "./stores/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    ATM: ATMReducer,
    counter: counterReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
