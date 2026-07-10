import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'All',
    search: '',
  },
};

const casesSlice = createSlice({
  name: 'cases',
  initialState,
  reducers: {
    fetchCasesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCasesSuccess: (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
    },
    fetchCasesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedCase: (state, action) => {
      state.selectedItem = action.payload;
    },
    addCaseSuccess: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateCaseSuccess: (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.selectedItem?.id === action.payload.id) {
        state.selectedItem = action.payload;
      }
    },
    deleteCaseSuccess: (state, action) => {
      state.items = state.items.filter(c => c.id !== action.payload);
      if (state.selectedItem?.id === action.payload) {
        state.selectedItem = null;
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const {
  fetchCasesStart,
  fetchCasesSuccess,
  fetchCasesFailure,
  setSelectedCase,
  addCaseSuccess,
  updateCaseSuccess,
  deleteCaseSuccess,
  setFilters,
} = casesSlice.actions;

export default casesSlice.reducer;
