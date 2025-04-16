import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import getAuthTokenFromLocalStorage from '../../utils';

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_BASE_URL,
		prepareHeaders: (headers) => {
			headers.set('Content-Type', 'application/json');
			headers.set('User-Agent', 'MyAppFrontend/1.0');
			headers.set('ngrok-skip-browser-warning', 'true');
			// headers.set('Authorization', `Bearer ${getAuthTokenFromLocalStorage()}`);
			return headers;
		},
	}),
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (creds) => {
				return {
					url: 'login',
					method: 'POST',
					body: JSON.stringify(creds),
				};
			},
		}),
		register: builder.mutation({
			query: (creds) => {
				return {
					url: 'register',
					method: 'POST',
					body: JSON.stringify(creds),
				};
			},
		}),
	}),
});
export const { useLoginMutation, useRegisterMutation } = authApi;
