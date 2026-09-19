import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface CategoryState {
  categories: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk<
  string[],
  void,
  { rejectValue: string }
>(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getCategories();

      if (!response.success) {
        return rejectWithValue('Failed to fetch categories');
      }

      return response.categories;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to fetch categories'
      );
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })

      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || 'Failed to fetch categories';
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;

export default categorySlice.reducer;