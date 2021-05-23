import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// 1. INITIAL STATE

const initialUpdateUIState = {
  updateUI: {},
};

// 2. SLICE

export const updateUISlice = createSlice({
  name: 'updateUI',
  initialState: initialUpdateUIState,
  reducers: {
    updateUI(state, action: PayloadAction) {
      state.updateUI = {};
    },
  },
  extraReducers: {},
});

// EXPORT ACTIONS

export const {updateUI} = updateUISlice.actions;

// EXPORT REDUCER

export default updateUISlice.reducer;
