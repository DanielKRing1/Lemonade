import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// 1. INITIAL STATE

const initialPopularNodesState = {
  pageRank: {},
};

// 2. SLICE

export const pageRankSlice = createSlice({
  name: 'updateUI',
  initialState: initialPopularNodesState,
  reducers: {
    calculatePageRank(state, action: PayloadAction) {
      state.pageRank = {};
    },
  },
  extraReducers: {},
});

// EXPORT ACTIONS

export const {calculatePageRank} = pageRankSlice.actions;

// EXPORT REDUCER

export default pageRankSlice.reducer;
