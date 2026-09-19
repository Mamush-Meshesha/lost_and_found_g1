import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import { IItem } from "../../types";

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
  "items/fetchItems",
  async (
    params: {
      q?: string;
      categoryId?: string;
      location?: string;
      sort?: string;
      ai?: boolean;
    } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.searchItems(params || {});
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch items"
      );
    }
  }
);

export const fetchItemById = createAsyncThunk(
  "items/fetchItemById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await api.getItemById(id);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch item"
      );
    }
  }
);

export const createItem = createAsyncThunk(
  "items/createItem",
  async (form: FormData, { rejectWithValue }) => {
    try {
      return await api.createItem(form);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create item"
      );
    }
  }
);

export const deleteItem = createAsyncThunk(
  "items/deleteItem",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.deleteItem(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete item"
      );
    }
  }
);

const itemSlice = createSlice({
  name: "items",
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
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.selectedItem = action.payload;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { clearSelectedItem, clearItemError } = itemSlice.actions;
export default itemSlice.reducer;
