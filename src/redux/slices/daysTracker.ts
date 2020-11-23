import { createSlice } from '@reduxjs/toolkit';

import { DayPart } from './dayPartTracker';

export type Day = Array<DayPart>;
export type Days = Array<Day>;

export type DaysTrackerState = {
    local: Days;
    server: Days;
};
const initialLifeTrackerState: DaysTrackerState = {
    local: [],
    server: [],
};
export const daysTrackerSlice = createSlice({
    name: 'daysTracker',
    initialState: initialLifeTrackerState,
    reducers: {
        rateDay(state, action: { payload: { mood: string; moodIntensity: string; activities: Array<string>; } }) {
            const { mood, moodIntensity, activities } = action.payload;
            const dayPart: DayPart = {
                mood,
                moodIntensity,
                activities
            };

            const lastDayIndex = state.local.length - 1;
            state.local[lastDayIndex].push(dayPart);
        }
    }
});

export const { rateDay } = daysTrackerSlice.actions;

export default daysTrackerSlice.reducer;