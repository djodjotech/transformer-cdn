import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TransformerState } from '../types/transformer';

const initialState: TransformerState = {
  transformers: [],
  selectedTransformers: [],
  searchTerm: '',
  regionFilter: '',
};

const transformerSlice = createSlice({
  name: 'transformer',
  initialState,
  reducers: {
    setTransformers: (state, action: PayloadAction<TransformerState['transformers']>) => {
      state.transformers = action.payload;
      if (state.selectedTransformers.length === 0 && state.transformers.length === 0) {
        state.selectedTransformers = action.payload.map(t => t.assetId);
      }
    },
    toggleTransformer: (state, action: PayloadAction<number>) => {
      const index = state.selectedTransformers.indexOf(action.payload);
      if (index === -1) {
        state.selectedTransformers.push(action.payload);
      } else {
        state.selectedTransformers.splice(index, 1);
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setRegionFilter: (state, action: PayloadAction<string>) => {
      state.regionFilter = action.payload;
    },
    loadState: (state, action: PayloadAction<TransformerState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setTransformers, toggleTransformer, setSearchTerm, setRegionFilter, loadState } =
  transformerSlice.actions;

export default transformerSlice.reducer;
