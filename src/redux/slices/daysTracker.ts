import {createAsyncThunk, createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {DayPart} from './dayPartTracker';

import TrendCache from '../../realm/Dev/TrendCache';

export type Day = Array<DayPart>;
export type Days = Array<Day>;

export type DaysTrackerState = {
  days: Record<string, Array<any>>;
};
const initialLifeTrackerState: DaysTrackerState = {
  days: {},
};

// THUNKS

const rateDay = createAsyncThunk(
  'daysTracker/rateDay',
  async (args: {trendName: string; entities: Array<string>; mood: string; rating: number; weights?: Array<number>}, {dispatch, getState}): Promise<any> => {
    const {trendName, entities, mood, rating, weights = null} = args;

    try {
      // Get TrendTracker
      const trendTracker = TrendCache.get(trendName);

      // Rate in TrendTracker -> Writes rating to Realm
      trendTracker.rate(entities, mood, rating, weights);

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
      const dayPart: DayPart = {
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
