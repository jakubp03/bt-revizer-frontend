import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/Api';

export const fetchAllQuizes = createAsyncThunk(
    'quiz/fetchAllQuizes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/quiz/allQuizes');
            return response.data;
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

export const fetchQuizById = createAsyncThunk(
    'quiz/fetchQuizById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/quiz/${id}`);
            return response.data;
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