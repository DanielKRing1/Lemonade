import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {updateUI} from '../updateUI';

// 1. INITIAL STATE

type RatingInputState = {
  rating?: string;
  mood?: string;
  entities?: string[];
};

const initialRatingInputState: RatingInputState = {
  rating: '',
  mood: '',
  entities: [],
};

// 2. SLICE

const ratingInputSlice = createSlice({
  name: 'ratingInput',
  initialState: initialRatingInputState,
  reducers: {
    rate(state, action: PayloadAction<RatingInputState>) {
      // 1. Extract provided args
      const {rating, mood, entities} = action.payload;

      // 2. Update state for any provided, valid args
      if (rating) state.rating = rating;
      if (mood) state.mood = mood;
      if (entities) state.entities = entities;
    },
  },
  extraReducers: {},
});

// 3. THUNKS

export const startRate = createAsyncThunk(
  'daysTracker/rateDay',
  async (args: RatingInputState, {dispatch, getState}): Promise<any> => {
    try {
      dispatch(ratingInputSlice.actions.rate(args));
      dispatch(updateUI());

      return args;
    } catch (err) {
      console.log(`Thunk ratingInput.rate error: ${err}`);

      return [];
    }
  },
);

// EXPORT ACTIONS

// export const {rate} = ratingInputSlice.actions;

// EXPORT REDUCER

export default ratingInputSlice.reducer;
