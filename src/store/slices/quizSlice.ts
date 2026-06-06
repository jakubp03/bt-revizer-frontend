import type { AttemptBasicResponse, Quiz, QuizDetailed, QuizStats } from '@/types/quiz';
import { createSlice } from '@reduxjs/toolkit';
import { createQuiz, fetchAllQuizes, fetchQuizAttempts, fetchQuizById, fetchQuizStats } from '../thunks/quizThunks';

type QuizSliceState = {
    quizCollection: Quiz[];
    isLoadingQuizes: boolean;
    selectedQuiz: QuizDetailed | null;
    isLoadingSelected: boolean;
    selectedQuizStats: QuizStats | null;
    isLoadingStats: boolean;
    selectedQuizAttempts: AttemptBasicResponse[] | null;
    isLoadingAttempts: boolean;
}

const initialState: QuizSliceState = {
    quizCollection: [],
    isLoadingQuizes: true,
    selectedQuiz: null,
    isLoadingSelected: false,
    selectedQuizStats: null,
    isLoadingStats: false,
    selectedQuizAttempts: null,
    isLoadingAttempts: false,
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
        clearQuizStats: (state) => {
            state.selectedQuizStats = null;
        },
        clearQuizAttempts: (state) => {
            state.selectedQuizAttempts = null;
        },
        addCategoryToQuiz: (state, action) => {
            const { category, quizId } = action.payload;
            const foundQuiz = state.quizCollection.find((quiz: Quiz) => (quiz.id === quizId));
            if (foundQuiz) {
                foundQuiz.categories.push(category);
            }
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
            .addCase(createQuiz.fulfilled, (state, action) => {
                state.quizCollection.push(action.payload as unknown as Quiz);
            })
            .addCase(fetchQuizStats.pending, (state) => {
                state.isLoadingStats = true;
            })
            .addCase(fetchQuizStats.fulfilled, (state, action) => {
                state.selectedQuizStats = action.payload;
                state.isLoadingStats = false;
            })
            .addCase(fetchQuizStats.rejected, (state) => {
                state.isLoadingStats = false;
            })
            .addCase(fetchQuizAttempts.pending, (state) => {
                state.isLoadingAttempts = true;
            })
            .addCase(fetchQuizAttempts.fulfilled, (state, action) => {
                state.selectedQuizAttempts = action.payload;
                state.isLoadingAttempts = false;
            })
            .addCase(fetchQuizAttempts.rejected, (state) => {
                state.isLoadingAttempts = false;
            })
    }
});

export const { addQuiz, clearSelectedQuiz, clearQuizStats, clearQuizAttempts, addCategoryToQuiz } = quizSlice.actions;
export default quizSlice.reducer;