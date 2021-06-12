import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// 1. INITIAL STATE

const initialRecommendedNodesState = {
  recommendations: {},
};

// 2. SLICE

export const dailyRecommendationsSlice = createSlice({
  name: 'updateUI',
  initialState: initialRecommendedNodesState,
  reducers: {
    calculateRecommendations(state, action: PayloadAction) {
      state.recommendations = {};
    },
  },
  extraReducers: {},
});

// EXPORT ACTIONS

export const {calculateRecommendations} = dailyRecommendationsSlice.actions;

// EXPORT REDUCER

export default dailyRecommendationsSlice.reducer;
