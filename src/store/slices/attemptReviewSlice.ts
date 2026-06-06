import type { AttemptReviewResponse } from '@/types/quiz';
import { createSlice } from '@reduxjs/toolkit';
import { fetchAttemptReview } from '../thunks/quizThunks';

type AttemptReviewState = {
    reviewData: AttemptReviewResponse | null;
    isLoading: boolean;
    currentIndex: number; // -1 = overview, 0+ = question index
};

const initialState: AttemptReviewState = {
    reviewData: null,
    isLoading: false,
    currentIndex: -1,
};

const attemptReviewSlice = createSlice({
    name: 'attemptReview',
    initialState,
    reducers: {
        setReviewIndex: (state, action: { payload: number }) => {
            state.currentIndex = action.payload;
        },
        clearReview: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAttemptReview.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAttemptReview.fulfilled, (state, action) => {
                state.reviewData = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchAttemptReview.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { setReviewIndex, clearReview } = attemptReviewSlice.actions;
export default attemptReviewSlice.reducer;
