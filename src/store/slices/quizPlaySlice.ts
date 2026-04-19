import type { QuestionInfo } from '@/types/quiz';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export type AnswerState = 'unanswered' | 'partial' | 'answered';

type QuizPlayState = {
    currentQuestionIndex: number;
    idBasedAnswers: Record<string, string[]>;
    textBasedAnswers: Record<string, string>;
    matchBasedAnswers: Record<string, { leftId: string; rightId: string }[]>;
    flashcardAnswers: Record<string, boolean>;
    manualReviewResults: Record<string, boolean>;
    isSubmitting: boolean;
    isManualReviewOpen: boolean;
    startTime: number | null;
};

const initialState: QuizPlayState = {
    currentQuestionIndex: 0,
    idBasedAnswers: {},
    textBasedAnswers: {},
    matchBasedAnswers: {},
    flashcardAnswers: {},
    manualReviewResults: {},
    isSubmitting: false,
    isManualReviewOpen: false,
    startTime: null,
};

const quizPlaySlice = createSlice({
    name: 'quizPlay',
    initialState,
    reducers: {
        startQuizPlay: (state) => {
            Object.assign(state, { ...initialState, startTime: Date.now() });
        },
        setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
            state.currentQuestionIndex = action.payload;
        },
        setIdBasedAnswer: (state, action: PayloadAction<{ questionId: string; optionIds: string[] }>) => {
            state.idBasedAnswers[action.payload.questionId] = action.payload.optionIds;
        },
        setTextBasedAnswer: (state, action: PayloadAction<{ questionId: string; answer: string }>) => {
            state.textBasedAnswers[action.payload.questionId] = action.payload.answer;
        },
        setMatchBasedAnswer: (state, action: PayloadAction<{ questionId: string; pairs: { leftId: string; rightId: string }[] }>) => {
            state.matchBasedAnswers[action.payload.questionId] = action.payload.pairs;
        },
        setFlashcardAnswer: (state, action: PayloadAction<{ questionId: string; correct: boolean }>) => {
            state.flashcardAnswers[action.payload.questionId] = action.payload.correct;
        },
        setManualReviewResult: (state, action: PayloadAction<{ questionId: string; correct: boolean }>) => {
            state.manualReviewResults[action.payload.questionId] = action.payload.correct;
        },
        setIsManualReviewOpen: (state, action: PayloadAction<boolean>) => {
            state.isManualReviewOpen = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        resetQuizPlay: () => initialState,
    },
});

// Selectors
export function selectAnswerState(question: QuestionInfo) {
    return (state: RootState): AnswerState => {
        const qId = question.id.toString();
        switch (question.type) {
            case 'SINGLE_CHOICE':
            case 'MULTIPLE_CHOICE':
            case 'TRUE_FALSE':
            case 'ORDERING': {
                const selected = state.quizPlay.idBasedAnswers[qId];
                return selected && selected.length > 0 ? 'answered' : 'unanswered';
            }
            case 'TEXT_INPUT': {
                const text = state.quizPlay.textBasedAnswers[qId];
                return text && text.trim().length > 0 ? 'answered' : 'unanswered';
            }
            case 'MATCHING': {
                const pairs = state.quizPlay.matchBasedAnswers[qId];
                if (!pairs || pairs.length === 0) return 'unanswered';
                if (pairs.length >= question.matchPairs.length) return 'answered';
                return 'partial';
            }
            case 'FLASHCARD': {
                return qId in state.quizPlay.flashcardAnswers ? 'answered' : 'unanswered';
            }
            default:
                return 'unanswered';
        }
    };
}

export function selectAnsweredCount(questions: QuestionInfo[]) {
    return (state: RootState): number => {
        return questions.filter((q) => {
            const s = selectAnswerState(q)(state);
            return s === 'answered' || s === 'partial';
        }).length;
    };
}

export const {
    startQuizPlay,
    setCurrentQuestionIndex,
    setIdBasedAnswer,
    setTextBasedAnswer,
    setMatchBasedAnswer,
    setFlashcardAnswer,
    setManualReviewResult,
    setIsManualReviewOpen,
    setIsSubmitting,
    resetQuizPlay,
} = quizPlaySlice.actions;

export default quizPlaySlice.reducer;
