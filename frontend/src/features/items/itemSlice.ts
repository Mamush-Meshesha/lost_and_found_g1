import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { IItem } from '../../types';

interface ItemState {
  items: IItem[];
  selectedItem: IItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: ItemState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
};

export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (
    params: {
      q?: string;
      category?: string;
      type?: string;
      location?: string;
      sort?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.getItems(params);

      if (!response.success) {
        return rejectWithValue('Failed to fetch items');
      }

      return response.items;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to fetch items'
      );
    }
  }
);

export const fetchItemById = createAsyncThunk(
  'items/fetchItemById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.getItemById(id);

      if (!response.success) {
        return rejectWithValue('Item not found');
      }

      return response.item;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to fetch item'
      );
    }
  }
);

export const createItem = createAsyncThunk(
  'items/createItem',
  async (
    {
      itemData,
    }: {
      itemData: Partial<IItem>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.createItem(itemData);

      if (!response.success) {
        return rejectWithValue(response.message);
      }

      return response.item;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to create item'
      );
    }
  }
);

export const updateItem = createAsyncThunk(
  'items/updateItem',
  async (
    {
      id,
      itemData,
    }: {
      id: string;
      itemData: Partial<IItem>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.updateItem(id, itemData);

      if (!response.success) {
        return rejectWithValue(response.message);
      }

      return response.item;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to update item'
      );
    }
  }
);

export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.deleteItem(id);

      if (!response.success) {
        return rejectWithValue(response.message);
      }

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to delete item'
      );
    }
  }
);

const itemSlice = createSlice({
  name: 'items',
  initialState,

  reducers: {
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },

    clearItemError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch all items
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch single item
      .addCase(fetchItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload;
      })

      .addCase(fetchItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create item
      .addCase(createItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })

      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update item
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.items.findIndex(
          (item) => item._id === action.payload._id
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }

        if (
          state.selectedItem?._id === action.payload._id
        ) {
          state.selectedItem = action.payload;
        }
      })

      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete item
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;

        state.items = state.items.filter(
          (item) => item._id !== action.payload
        );

        if (state.selectedItem?._id === action.payload) {
          state.selectedItem = null;
        }
      })

      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearSelectedItem,
  clearItemError,
} = itemSlice.actions;

export default itemSlice.reducer;