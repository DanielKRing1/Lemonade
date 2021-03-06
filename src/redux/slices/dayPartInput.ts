import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

export type DayPartInput = {
  mood: string;
  rating: string;
  entities: Array<string>;
};
const initialDayPartInputState: DayPartInput = {
  mood: '',
  rating: '',
  entities: [],
};
export const dayPartInputSlice = createSlice({
  name: 'dayPartInput',
  initialState: initialDayPartInputState,
  reducers: {
    setMood(state, action: PayloadAction<string>) {
      const mood = action.payload;
      state.mood = mood;
    },
    setMoodIntensity(state, action: PayloadAction<string>) {
      const rating = action.payload;
      state.rating = rating;
    },
    addEntities(state, action: PayloadAction<string>) {
      const entity = action.payload;
      state.entities.push(entity);
    },
    setActivities(state, action: PayloadAction<Array<string>>) {
      const entities = action.payload;
      state.entities = entities;
    },
  },
});

export const {setMood, setMoodIntensity, addActivity, setActivities} = dayPartInputSlice.actions;

export default dayPartInputSlice.reducer;
