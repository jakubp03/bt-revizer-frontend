/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import api from '@/services/Api';
import React, { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setToken, setUser, validateToken } from '../../store/slices/authSlice';

let isRefreshing = false;
let failedQueue: { resolve: (v: unknown) => void; reject: (e: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token));
    failedQueue = [];
};

/**
 * AuthHandler component that manages authentication interceptors for API requests.
 * 
 * This component sets up two main interceptors:
 * 1. Request interceptor: Automatically adds Authorization headers with Bearer token to outgoing requests
 * 2. Response interceptor: Handles token expiration by attempting to refresh tokens and retry failed requests
 * 
 * The component also validates the current token on mount and handles automatic token refresh
 * when receiving 401 responses with "Invalid token EXPIRED" message from the server.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {React.ReactNode} The child components
 */
// eslint-disable-next-line react/prop-types
export default function AuthHandler({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { token } = useAppSelector(state => state.auth);


    //this interceptor is adding access token to headers until the token is expired
    //useLayoutEffect because we want to block rest of the rendering down the component
    //tree to make sure they dont trigger requests without correct auth headers
    // ADDS AUTHORIZATION HEADERS
    useLayoutEffect(() => {
        const interceptor = api.interceptors.request.use((config) => {
            if (!config._retry && !config.skipAuthInterceptor && token) {
                config.headers.Authorization = `Bearer ${token}`;
            } //else config.headers.Authorization remains the same

            return config;
        });
        return () => {
            api.interceptors.request.eject(interceptor);
        };
    }, [token]);

    //this interceptor is checking if response from the server is that access token is expired 
    //reference: flowchart_error_handling.png in doc
    // EXPIRED TOKEN INTERCEPTOR AND VALIDATION
    useLayoutEffect(() => {
        // Small delay to ensure interceptor is set up first (next event loop)
        setTimeout(() => {
            dispatch(validateToken());
        }, 0);

        const refreshInterceptor = api.interceptors.response.use((response) => response, async (error) => {
            const originalRequest = error.config;

            //TODO: specific server replies should be stored in file as local variables or something like that
            if (error.response.status === 401 && error.response.data === "Invalid token EXPIRED" && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
                if (isRefreshing) {
                    // Queue subsequent requests until refresh completes
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    }).catch(err => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const response = await api.post('/auth/refresh', {}, { withCredentials: true });
                    const newToken = response.data.access_token;
                    dispatch(setToken(newToken));
                    dispatch(setUser(newToken));
                    processQueue(null, newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    dispatch(setToken(null));
                    dispatch(setUser(null));
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }
            return Promise.reject(error);
        });
        return () => {
            api.interceptors.response.eject(refreshInterceptor);
        };
    }, []);

    return children;
}
