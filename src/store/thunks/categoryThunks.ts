import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/Api';

export const fetchAllCategories = createAsyncThunk(
    'category/allCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/category');
            return response.data;

        } catch (error: unknown) {
            console.error("Error fetching categories", error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const responseData = (error && typeof error === 'object' && 'response' in error)
                ? (error as { response?: { data?: unknown } }).response?.data
                : undefined;
            return rejectWithValue(responseData || errorMessage);
        }
    }
);

export const createCategory = createAsyncThunk(
    'category/createCategory',
    async ({ name, description, color, quizIds }: { name: string, description: string, color: string, quizIds?: number[] }, { rejectWithValue }) => {
        try {
            const response = await api.post('/category', { name, description, color, quizIds });
            return response.data;

        } catch (error: unknown) {
            console.error("Error creating category", error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const responseData = (error && typeof error === 'object' && 'response' in error)
                ? (error as { response?: { data?: unknown } }).response?.data
                : undefined;
            return rejectWithValue(responseData || errorMessage);
        }
    }
);
