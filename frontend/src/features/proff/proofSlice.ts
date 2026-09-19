import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import { IProof } from "../../types";

interface ProofState {
  proofs: IProof[];
  loading: boolean;
  error: string | null;
}

const initialState: ProofState = {
  proofs: [],
  loading: false,
  error: null,
};

export const submitProof = createAsyncThunk(
  "proofs/submit",
  async (
    { itemId, answer }: { itemId: string; answer: string },
    { rejectWithValue }
  ) => {
    try {
      return await api.submitProof(itemId, answer);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to submit proof"
      );
    }
  }
);

export const fetchProofs = createAsyncThunk(
  "proofs/fetch",
  async (itemId: string, { rejectWithValue }) => {
    try {
      return await api.getItemProofs(itemId);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch proofs"
      );
    }
  }
);

export const reviewProof = createAsyncThunk(
  "proofs/review",
  async (
    {
      itemId,
      proofId,
      status,
    }: { itemId: string; proofId: string; status: "accepted" | "rejected" },
    { rejectWithValue }
  ) => {
    try {
      return await api.reviewProof(itemId, proofId, status);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to review proof"
      );
    }
  }
);

const proofSlice = createSlice({
  name: "proofs",
  initialState,
  reducers: {
    clearProofError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProofs.fulfilled, (state, action) => {
        state.proofs = action.payload;
      })
      .addCase(submitProof.fulfilled, (state, action) => {
        state.proofs.unshift(action.payload);
      })
      .addCase(reviewProof.fulfilled, (state, action) => {
        const idx = state.proofs.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.proofs[idx] = action.payload;
      });
  },
});

export const { clearProofError } = proofSlice.actions;
export default proofSlice.reducer;
