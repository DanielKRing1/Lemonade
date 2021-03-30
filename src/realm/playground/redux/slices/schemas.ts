import {createAsyncThunk, createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {RealmInterface} from '../../realm/Realm';

// INITIAL STATE

const initialSchemasState = {
  updateReference: {},
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

const loadRealms = createAsyncThunk(
  'schemas/loadRealms',
  async (args: any, {dispatch, getState}): Promise<any> => {
    try {
      return args;
    } catch (err) {
      return [];
    }
  },
);

const addTrend = createAsyncThunk(
  'schemas/addTrend',
  async (args: any, {dispatch, getState}): Promise<any> => {
    try {
      return args;
    } catch (err) {
      return [];
    }
  },
);

const rmTrend = createAsyncThunk(
  'schemas/rmTrend',
  async (args: any, {dispatch, getState}): Promise<any> => {
    try {
      return args;
    } catch (err) {
      return [];
    }
  },
);

export {rateDay};

// SLICE

export const schemasSlice = createSlice({
  name: 'daysTracker',
  initialState: initialSchemasState,
  reducers: {
    updateSchemas(state, action: PayloadAction<string>) {
      state.updateReference = {};
    },
  },
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

export default schemasSlice.reducer;
