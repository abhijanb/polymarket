import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * User UI state — cross-page ephemeral state for the /user feature.
 * Scaffolded for the upcoming markets/order-placement work; not consumed yet.
 */
export interface UserUiState {
  lastPlacedOrderId: string | null;
  selectedProductId: string | null;
  orderFilter: "all" | "open" | "filled";
}

const initialState: UserUiState = {
  lastPlacedOrderId: null,
  selectedProductId: null,
  orderFilter: "all",
};

const userUiSlice = createSlice({
  name: "userUi",
  initialState,
  reducers: {
    setLastPlacedOrderId(state, action: PayloadAction<string | null>) {
      state.lastPlacedOrderId = action.payload;
    },
    setSelectedProductId(state, action: PayloadAction<string | null>) {
      state.selectedProductId = action.payload;
    },
    setOrderFilter(state, action: PayloadAction<UserUiState["orderFilter"]>) {
      state.orderFilter = action.payload;
    },
    resetUserUi() {
      return initialState;
    },
  },
});

export const {
  setLastPlacedOrderId,
  setSelectedProductId,
  setOrderFilter,
  resetUserUi,
} = userUiSlice.actions;

export default userUiSlice.reducer;
