import { createAsyncThunk } from '@reduxjs/toolkit';

import type { AttemptBasicResponse, AttemptReviewResponse, QuestionReview, Quiz } from '@/types/quiz';
import api from '../../services/Api';


interface CreateQuizPayload {
    title: string;
    description?: string;
    icon?: string;
    timeLimit: number | null;
    gradingMethod: string;
    categoryIds: number[];
    questions: unknown[];
}

interface QuizBasicResponse {
    id: number;
    title: string;
    questionCount: number;
}

export const fetchAllQuizes = createAsyncThunk(
    'quiz/fetchAllQuizes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/quiz/allQuizes');
            return response.data.map((quiz: Quiz) => ({ ...quiz, id: String(quiz.id) }));
        } catch (error: unknown) {
            console.error('Error in fetchAllQuizes', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const responseData = (error && typeof error === 'object' && 'response' in error)
                ? (error as { response?: { data?: unknown } }).response?.data
                : undefined;
            return rejectWithValue(responseData || errorMessage);
        }
    }
);

export const createQuiz = createAsyncThunk<QuizBasicResponse, CreateQuizPayload>(
    'quiz/createQuiz',
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post('/quiz', data);
            return { ...response.data, id: String(response.data.id) };
        } catch (error: unknown) {
            console.error('Error in createQuiz', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const responseData = (error && typeof error === 'object' && 'response' in error)
                ? (error as { response?: { data?: unknown } }).response?.data
                : undefined;
            return rejectWithValue(responseData || errorMessage);
        }
    }
);
export const fetchQuizById = createAsyncThunk(
    'quiz/fetchQuizById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/quiz/${id}`);
            const data = response.data;
            return { ...data, id: String(data.id) };
        } catch (error: unknown) {
            console.error('Error in fetchQuizById', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const responseData = (error && typeof error === 'object' && 'response' in error)
                ? (error as { response?: { data?: unknown } }).response?.data
                : undefined;
            return rejectWithValue(responseData || errorMessage);
        }
    }
);

export const fetchQuizAttempts = createAsyncThunk(
    'quiz/fetchQuizAttempts',
    async (quizId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/attempt/byQuiz/${quizId}/all`);
            return response.data.map((attempt: AttemptBasicResponse) => ({ ...attempt, id: String(attempt.id) }));
        } catch (error: unknown) {
            console.error('Error in fetchQuizAttempts', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const responseData = (error && typeof error === 'object' && 'response' in error)
                ? (error as { response?: { data?: unknown } }).response?.data
                : undefined;
            return rejectWithValue(responseData || errorMessage);
        }
    }
);

export const fetchAttemptReview = createAsyncThunk(
    'attemptReview/fetchAttemptReview',
    async (attemptId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/attempt/${attemptId}/review`);
            const data = response.data;
            const review: AttemptReviewResponse = {
                ...data,
                attemptId: String(data.attemptId),
                quizId: String(data.quizId),
                questions: data.questions.map((q: QuestionReview) => ({
                    ...q,
                    questionId: String(q.questionId),
                    choiceOptions: q.choiceOptions?.map((opt) => ({
                        ...opt,
                        id: String(opt.id),
                    })) ?? null,
                    matchPairs: q.matchPairs?.map((pair) => ({
                        ...pair,
                        id: String(pair.id),
                        userRightId: String(pair.userRightId),
                    })) ?? null,
                    orderItems: q.orderItems?.map((item) => ({
                        ...item,
                        id: String(item.id),
                    })) ?? null,
                })),
            };
            return review;
        } catch (error: unknown) {
            console.error('Error in fetchAttemptReview', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const responseData = (error && typeof error === 'object' && 'response' in error)
                ? (error as { response?: { data?: unknown } }).response?.data
                : undefined;
            return rejectWithValue(responseData || errorMessage);
        }
    }
);

export const fetchQuizStats = createAsyncThunk(
    'quiz/fetchQuizStats',
    async (quizId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/attempt/statistics/byQuizId/${quizId}`);
            return response.data;
        } catch (error: unknown) {
            console.error('Error in fetchQuizStats', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const responseData = (error && typeof error === 'object' && 'response' in error)
                ? (error as { response?: { data?: unknown } }).response?.data
                : undefined;
            return rejectWithValue(responseData || errorMessage);
        }
    }
);