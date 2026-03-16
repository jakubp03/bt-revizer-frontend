import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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

/**
 * Async thunk to handle user logout.
 * 
 * Sends logout request to server and clears authentication state.
 * Ensures cleanup even if server request fails.
 * 
 * @returns {Promise} Promise that always clears auth state regardless of server response
 */
export const handleLogout = createAsyncThunk(
  'auth/handleLogout',
  async(_, {dispatch} ) =>{
    
    try{
      await api.post('/auth/logout');
      dispatch(clearAuth());
    }catch(error){
      console.error("logout error: " + error);
      dispatch(clearAuth());
    }
}
);

const parseJWT = (token: string) => {
  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));

    return {
      email: payload.sub,
      name: payload.name,
      uid: payload.uid
    };
    
  } catch (error: unknown) {
    throw new Error("Error parsing JWT token: " + (error instanceof Error ? error.message : String(error)));
  }
};

type User = {
  email: string | null;
  name: string | null;
  uid: string | null;
  avatarLink?: string | null;
}

type AuthState = {
  token: string | null;
  user: User;
  isValidating: boolean;
}

const updateUserFromToken = (state: AuthState, token: string | null) => {
  if (token) {
    try {
      state.user = parseJWT(token);
    } catch (error) {
      console.error(error);
      state.user = { email: null, name: null, uid: null, avatarLink: null };
    }
  } else {
    state.user = { email: null, name: null, uid: null, avatarLink: null };
  }
};

const clearAuthState = (state: AuthState) => {
  state.token = null;
  state.user = { email: null, name: null, uid: null, avatarLink: null };
  state.isValidating = false;
  localStorage.clear();
};

/**
 * Authentication slice for managing user authentication state.
 * 
 * Manages:
 * - JWT access token storage and persistence
 * - User data extracted from JWT tokens
 * - Token validation and refresh logic
 * - Login/logout state management
 * - Authentication loading states
 * 
 * Features:
 * - Automatic token validation on app load
 * - localStorage persistence for tokens
 * - JWT parsing for user information extraction
 * - Logout with server notification
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('accessToken'),
    user: {
      email: null,
      name: null,
      uid: null,
      avatarLink: null
    },
    isValidating: true,
  },
  reducers: {
    setToken: (state, action) => {
      const newToken = action.payload;
      state.token = newToken;
      
      if (newToken) {
        localStorage.setItem('accessToken', newToken);
      } else {
        localStorage.removeItem('accessToken');
      }
    },
    clearAuth: (state) => {
      clearAuthState(state);
    },
    setValidating: (state, action) => {
      state.isValidating = action.payload;
    },
    setUser: (state, action) => {
      const token = action.payload;
      updateUserFromToken(state, token);
    },
    setAvatar: (state, action) => {
      state.user.avatarLink = action.payload;
      if (state.user.uid) {
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateToken.pending, (state) => {
        state.isValidating = true;
      })
      .addCase(validateToken.fulfilled, (state) => {
        state.isValidating = false;
        updateUserFromToken(state, state.token);
      })
      .addCase(validateToken.rejected, (state) => {
        clearAuthState(state);
      })
  }
});

export const { setToken, setUser, clearAuth, setValidating, setAvatar } = authSlice.actions;
export default authSlice.reducer;