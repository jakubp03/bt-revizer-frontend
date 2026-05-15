import type { Category } from '@/types/category';
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/Api';
import { addCategoryToQuiz } from '../slices/quizSlice';



export const fetchAllCategories = createAsyncThunk(
    'category/allCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/category');
            return response.data.map((category: { id: number | string;[key: string]: unknown }) => ({ ...category, id: String(category.id) }));

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
    async ({ name, description, color, quizIds }: { name: string, description: string, color: string, quizIds?: string[] }, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post('/category', { name, description, color, quizIds });
            const category: Category = { id: String(response.data), name: name, description: description, color: color };

            quizIds?.map((quizId: string) => { dispatch(addCategoryToQuiz({ category, quizId })) });

            return category;
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
