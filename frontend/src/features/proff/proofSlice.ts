import { createSlice } from '@reduxjs/toolkit';

interface ProofState {
  loading: boolean;
  error: string | null;
}

const initialState: ProofState = {
  loading: false,
  error: null,
};

const proofSlice = createSlice({
  name: 'proofs',
  initialState,
  reducers: {
    clearProofError: (state) => {
      state.error = null;
    },
  },
});

export const { clearProofError } = proofSlice.actions;

export default proofSlice.reducer;
