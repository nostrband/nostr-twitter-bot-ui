import { configureStore } from '@reduxjs/toolkit';
import { historiesSlice } from './historiesSlice';

export const store = configureStore({
  reducer: {
    histories: historiesSlice.reducer,
  },
});
