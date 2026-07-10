import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hearings: [],
  isLoading: false,
  error: null,
};

const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    fetchHearingsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchHearingsSuccess: (state, action) => {
      state.isLoading = false;
      state.hearings = action.payload;
    },
    fetchHearingsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addHearingSuccess: (state, action) => {
      state.hearings.push(action.payload);
    },
    updateHearingSuccess: (state, action) => {
      const index = state.hearings.findIndex(h => h.id === action.payload.id);
      if (index !== -1) {
        state.hearings[index] = action.payload;
      }
    },
  },
});

export const {
  fetchHearingsStart,
  fetchHearingsSuccess,
  fetchHearingsFailure,
  addHearingSuccess,
  updateHearingSuccess,
} = diarySlice.actions;

export default diarySlice.reducer;
