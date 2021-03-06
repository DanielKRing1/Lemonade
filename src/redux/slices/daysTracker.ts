import {createAsyncThunk, createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';

import TrendCache from '../../realm/Dev/TrendCache';

// TODO Move these types to their own .d.ts files, 'input.d.ts' and 'dayTrackerReducerState.d.ts'
// TYPES

export type DayPartInput = {
  trendName: string;
  mood: string;
  ratings: number | Array<number>;
  weights: null | number | Array<number>;
  entities: Array<string>;
};
export type Day = Array<DayPartInput>;
type Date = string;

export type DaysTrackerState = {
  days: Record<Date, Day>;
  input: DayPartInput;
};

// INITIAL STATE

const initialLifeTrackerState: DaysTrackerState = {
  days: {},
  input: {
    trendName: '',
    mood: '',
    ratings: [],
    weights: null,
    entities: [],
  },
};

// THUNKS

const rateDay = createAsyncThunk(
  'daysTracker/rateDay',
  async (args: DayPartInput, {dispatch, getState}): Promise<any> => {
    const {trendName, entities, mood, ratings, weights = null} = args;

    try {
      // Get TrendTracker
      const trendTracker = TrendCache.get(trendName);

      // Rate in TrendTracker -> Writes rating to Realm
      // TODO NOW Check this
      trendTracker.rate(entities, mood, ratings, weights);

      return args;
    } catch (err) {
      console.log(`RealmCache._loadSchemaBlueprints error: ${err}`);

      return [];
    }
  },
);

export {rateDay};

// SLICE

export const daysTrackerSlice = createSlice({
  name: 'daysTracker',
  initialState: initialLifeTrackerState,
  reducers: {},
  extraReducers: {
    [rateDay.fulfilled]: (state, action: {payload: {mood: string; moodIntensity: string; activities: Array<string>}}) => {
      // Format DayPart
      const {mood, moodIntensity, activities} = action.payload;
      const dayPart: DayPartInput = {
        date: new Date().toDateString(),
        mood,
        moodIntensity,
        activities,
      };

      // Today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Store in Redux: DayPart under today's date
      if (!state.days.hasOwnProperty(today.toDateString())) state.days[today.toDateString()] = [];
      state.days[today.toDateString()].push(dayPart);
    },
  },
});

// export const {rateDay} = daysTrackerSlice.actions;

export default daysTrackerSlice.reducer;
