import type { Quiz, QuizDetailed, QuizStats } from '@/types/quiz';
import { createSlice } from '@reduxjs/toolkit';
import { createQuiz, fetchAllQuizes, fetchQuizById, fetchQuizStats } from '../thunks/quizThunks';

type QuizSliceState = {
    quizCollection: Quiz[];
    isLoadingQuizes: boolean;
    selectedQuiz: QuizDetailed | null;
    isLoadingSelected: boolean;
    selectedQuizStats: QuizStats | null;
    isLoadingStats: boolean;
}

const initialState: QuizSliceState = {
    quizCollection: [],
    isLoadingQuizes: true,
    selectedQuiz: null,
    isLoadingSelected: false,
    selectedQuizStats: null,
    isLoadingStats: false,
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
    }
});

export const { addQuiz, clearSelectedQuiz, clearQuizStats, addCategoryToQuiz } = quizSlice.actions;
export default quizSlice.reducer;