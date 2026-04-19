import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import authSlice from './slices/authSlice';
import categorySlice from './slices/categorySlice';
import quizPlaySlice from './slices/quizPlaySlice';
import quizSlice from './slices/quizSlice';


// Enable Immer's MapSet plugin to support Map and Set in Redux state
enableMapSet();

export const store = configureStore({
  reducer: {
    auth: authSlice,
    category: categorySlice,
    quiz: quizSlice,
    quizPlay: quizPlaySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    })
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;