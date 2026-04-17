import type { Category } from '@/types/category';
import { createSlice } from '@reduxjs/toolkit';
import { createCategory, fetchAllCategories } from '../thunks/categoryThunks';
export { createCategory, fetchAllCategories } from '../thunks/categoryThunks';


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
        addCategory: (state, action: { payload: Category }) => {
            state.categoryCollection.push(action.payload)
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

export const selectCategoryById = (id: string) => (state: { category: CategorySliceState }) =>
    state.category.categoryCollection.find(category => category.id === id);