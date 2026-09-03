import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/authSlice";
import userUiReducer from "@/features/user/store/userUiSlice";
import { baseApi } from "@/shared/api/baseApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userUi: userUiReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
