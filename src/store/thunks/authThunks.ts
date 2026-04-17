import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/Api';

/**
 * Async thunk to validate the current authentication token.
 * 
 * Checks if a token exists in localStorage and validates it with the server.
 * Used during app initialization to verify existing authentication state.
 * 
 * @returns {Promise} Promise resolving to validation result or rejection with error
 */
export const validateToken = createAsyncThunk(
    'auth/validateToken',
    async (_, { rejectWithValue }) => {
        try {
            if (!localStorage.getItem('accessToken')) {
                throw new Error("no token found in localstorage");
            }

            const response = await api.get('/auth/validateToken');
            return response.data;

        } catch (error: unknown) {
            console.error("Error validating token", error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const responseData = (error && typeof error === 'object' && 'response' in error)
                ? (error as { response?: { data?: unknown } }).response?.data
                : undefined;
            return rejectWithValue(responseData || errorMessage);
        }
    }
);
