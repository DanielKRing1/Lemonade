import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DayPart = {
    mood: string;
    moodIntensity: string;
    activities: Array<string>;
};
const initialDayTrackerState: DayPart = {
    mood: '',
    moodIntensity: '',
    activities: [],
};
export const dayTrackerSlice = createSlice({
    name: 'dayPartTracker',
    initialState: initialDayTrackerState,
    reducers: {
        setMood(state, action: PayloadAction<string>) {
            const mood = action.payload;
            state.mood = mood;
        },
        setMoodIntensity(state, action: PayloadAction<string>) {
            const moodIntensity = action.payload;
            state.moodIntensity = moodIntensity;
        },
        addActivity(state, action: PayloadAction<string>) {
            const activity = action.payload;
            state.activities.push(activity);
        },
        setActivities(state, action: PayloadAction<Array<string>>) {
            const activities = action.payload;
            state.activities = activities;
        },
    }
});

export const { setMood, setMoodIntensity, addActivity, setActivities } = dayTrackerSlice.actions;

export default dayTrackerSlice.reducer;