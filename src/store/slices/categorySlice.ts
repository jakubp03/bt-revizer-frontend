import type { Category } from '@/types/category';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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
    async ({ name, description, color }: { name: string, description: string, color: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/category', { name, description, color });
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


type CategorySliceState = {
    categoryCollection: Category[];
    isLoadingCategories: boolean;
}

const initialState: CategorySliceState = {
    categoryCollection: [],
    isLoadingCategories: true
}

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        addCategory: (state, action) => {
            state.categoryCollection.push({
                id: action.payload.id,
                name: action.payload.name,
                description: action.payload.description,
                color: action.payload.color,
            })
        },
        setIsLoadingCategories: (state, action) => {
            state.isLoadingCategories = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCategories.pending, (state) => {
                state.isLoadingCategories = true;
            })
            .addCase(fetchAllCategories.fulfilled, (state, action) => {
                state.isLoadingCategories = false;
                state.categoryCollection = action.payload;
            })
            .addCase(fetchAllCategories.rejected, (state) => {
                state.isLoadingCategories = false;
                state.categoryCollection = [];
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categoryCollection.push(action.payload);
            })
    }
});

export default categorySlice.reducer;