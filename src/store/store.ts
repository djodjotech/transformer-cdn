import { configureStore } from '@reduxjs/toolkit';
import transformerReducer from './transformerSlice';

export const store = configureStore({
  reducer: {
    transformer: transformerReducer,
  },
});
