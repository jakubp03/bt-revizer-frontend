import { createAsyncThunk } from '@reduxjs/toolkit';

import type { Quiz } from '@/types/quiz';
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