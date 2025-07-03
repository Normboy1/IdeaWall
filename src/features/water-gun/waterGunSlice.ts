import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface WaterGunState {
  isShootingMode: boolean;
}

const initialState: WaterGunState = {
  isShootingMode: false,
};

const waterGunSlice = createSlice({
  name: 'waterGun',
  initialState,
  reducers: {
    toggleShootingMode: (state) => {
      state.isShootingMode = !state.isShootingMode;
    },
    setShootingMode: (state, action: PayloadAction<boolean>) => {
      state.isShootingMode = action.payload;
    },
  },
});

export const { toggleShootingMode, setShootingMode } = waterGunSlice.actions;
export default waterGunSlice.reducer;

// Selectors
export const selectIsShootingMode = (state: { waterGun: WaterGunState }) => 
  state.waterGun.isShootingMode;
