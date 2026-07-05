import type { Category, CategoryStats } from '@/types/category';
import { createSlice } from '@reduxjs/toolkit';
import { createCategory, fetchAllCategories, fetchCategoryStats } from '../thunks/categoryThunks';
export { createCategory, fetchAllCategories, fetchCategoryStats } from '../thunks/categoryThunks';

type CategorySliceState = {
    categoryCollection: Category[];
    isLoadingCategories: boolean;
    selectedCategoryStats: CategoryStats | null;
    isLoadingStats: boolean;
}

const initialState: CategorySliceState = {
    categoryCollection: [],
    isLoadingCategories: true,
    selectedCategoryStats: null,
    isLoadingStats: false,
}

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        addCategory: (state, action: { payload: Category }) => {
            state.categoryCollection.push(action.payload)
        },
        setIsLoadingCategories: (state, action) => {
            state.isLoadingCategories = action.payload
        },
        clearCategoryStats: (state) => {
            state.selectedCategoryStats = null;
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
            .addCase(fetchCategoryStats.pending, (state) => {
                state.isLoadingStats = true;
            })
            .addCase(fetchCategoryStats.fulfilled, (state, action) => {
                state.selectedCategoryStats = action.payload;
                state.isLoadingStats = false;
            })
            .addCase(fetchCategoryStats.rejected, (state) => {
                state.isLoadingStats = false;
            })
    }
});

export const { addCategory, clearCategoryStats } = categorySlice.actions;

export default categorySlice.reducer;

export const selectCategoryById = (id: string) => (state: { category: CategorySliceState }) =>
    state.category.categoryCollection.find(category => String(category.id) === String(id));