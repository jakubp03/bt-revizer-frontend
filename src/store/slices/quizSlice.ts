import type { Quiz, QuizDetailed } from '@/types/quiz';
import { createSlice } from '@reduxjs/toolkit';
import { fetchAllQuizes, fetchQuizById } from '../thunks/quizThunks';

type QuizSliceState = {
    quizCollection: Quiz[];
    isLoadingQuizes: boolean;
    selectedQuiz: QuizDetailed | null;
    isLoadingSelected: boolean;
}

const initialState: QuizSliceState = {
    quizCollection: [],
    isLoadingQuizes: true,
    selectedQuiz: null,
    isLoadingSelected: false,
}

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        addQuiz: (state, action: { payload: Quiz }) => {
            state.quizCollection.push(action.payload)
        },
        setIsLoadingQuizes: (state, action) => {
            state.isLoadingQuizes = action.payload;
        },
        clearSelectedQuiz: (state) => {
            state.selectedQuiz = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllQuizes.pending, (state) => {
                state.isLoadingQuizes = true;
            })
            .addCase(fetchAllQuizes.fulfilled, (state, action) => {
                state.quizCollection = action.payload;
                state.isLoadingQuizes = false;
            })
            .addCase(fetchAllQuizes.rejected, (state, action) => {
                state.isLoadingQuizes = false;
                console.log(action.error.message || "error fetching quizes");
            })
            .addCase(fetchQuizById.pending, (state) => {
                state.isLoadingSelected = true;
            })
            .addCase(fetchQuizById.fulfilled, (state, action) => {
                state.selectedQuiz = action.payload;
                state.isLoadingSelected = false;
            })
            .addCase(fetchQuizById.rejected, (state, action) => {
                state.isLoadingSelected = false;
                console.log(action.error.message || "error fetching quiz");
            })
    }
});

export const { addQuiz, clearSelectedQuiz } = quizSlice.actions;
export default quizSlice.reducer;