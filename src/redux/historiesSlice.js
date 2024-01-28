import { createSlice } from '@reduxjs/toolkit';

export const historiesSlice = createSlice({
  name: 'histories',
  initialState: {
    histories: {
      data: [],
      username: '',
    },
  },
  reducers: {
    setHistories: (state, { payload }) => {
      state.histories.data = payload.histories;
      state.histories.username = payload.username;
    },
  },
});

export const { setHistories } = historiesSlice.actions;
