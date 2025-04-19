import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getAuthTokenFromLocalStorage from '../utils';

export const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_BASE_URL,
		prepareHeaders: (headers) => {
			headers.set('Content-Type', 'application/json');
			headers.set('User-Agent', 'MyAppFrontend/1.0');
			headers.set('ngrok-skip-browser-warning', 'true');
			headers.set('Authorization', `Bearer ${getAuthTokenFromLocalStorage()}`);
			return headers;
		},
	}),
	endpoints: (builder) => ({
		getUsers: builder.query({
			query: () => ({
				url: `users`, // Adjust the URL if needed
				method: 'GET',
			}),
		}),
		getOrders: builder.query({
			query: ({page, limit}) => ({
				url: `orders?page=${page}&limit=${limit}`, // Adjust the URL if needed
				method: 'GET',
			}),
		}),
		getOverview: builder.query({
			query: () => ({
				url: `overview`, // Adjust the URL if needed
				method: 'GET',
			}),
		}),
		getCaseType: builder.query({
			query: () => ({
				url: `casetypes`, // Adjust the URL if needed
				method: 'GET',
			}),
		}),
		getOrganization: builder.query({
			query: () => ({
				url: `smtp`, // Adjust the URL if needed
				method: 'GET',
			}),
		}),
		getBillTo: builder.query({
			query: (query) => ({
				url: `customers?locat_name=${query}`, // Adjust the URL if needed
				method: 'GET',
			}),
		}),
		getParticipants: builder.query({
			query: (query) => ({
				url: `locations?locat_name=${query}`, // Adjust the URL if needed
				method: 'GET',
			}),
		}),
		getCourtName: builder.query({
			query: (query) => ({
				url: `courts?locat_name=${query}`, // Adjust the URL if needed
				method: 'GET',
			}),
		}),
		getMe: builder.query({
			query: () => ({
				url: `me`, // Adjust the URL if needed
				method: 'GET',
			}),
		}),
		updateMe: builder.mutation({
			query: (body) => {
				return {
					url: `me`, // Adjust the URL if needed
					method: 'PATCH',
					body,
				};
			},
		}),
		updateUser: builder.mutation({
			query: ({ body, id }) => {
				return {
					url: `user/${id}`,
					method: 'PATCH',
					body: body,
				};
			},
		}),
		createUser: builder?.mutation({
			query: ({ postData, id }) => {
				return {
					url: `user${id ? '/' + id : ''}`,
					method: id ? 'PATCH' : 'POST',
					body: JSON.stringify(postData),
				};
			},
		}),
		createOrder: builder?.mutation({
			query: (postData) => {
				return {
					url: `order`,
					method:'POST',
					body: JSON.stringify(postData),
				};
			},
		}),
		createBulkOrder: builder?.mutation({
			query: (postData) => {
				return {
					url: `bulk-orders`,
					method:'POST',
					body: JSON.stringify(postData),
				};
			},
		}),
		deleteOrder: builder?.mutation({
			query: ({postData, id}) => {
				return {
					url: `order/${id}`,
					method:'PATCH',
					body: JSON.stringify(postData),
				};
			},
		}),
		updateOrginazation: builder?.mutation({
			query: (postData) => {
				return {
					url: `smtp`,
					method:'PATCH',
					body: JSON.stringify(postData),
				};
			},
		}),
		createOrginazation: builder?.mutation({
			query: (postData) => {
				return {
					url: `smtp`,
					method:'POST',
					body: JSON.stringify(postData),
				};
			},
		}),
		cancelOrder: builder?.mutation({
			query: (id) => {
				return {
					url: `cancel/${id}`,
					method:'PATCH',
				};
			},
		}),
		deleteOrders: builder?.mutation({
			query: (id) => {
				return {
					url: `delete/${id}`,
					method:'DELETE',
				};
			},
		}),
		completeOrder: builder?.mutation({
			query: (id) => {
				return {
					url: `complete/${id}`,
					method:'PATCH',
				};
			},
		}),
        getSingle: builder.query({
			query: ({ type, id }) => ({
				url: `${type}/${id}`,
			}),
		}),
	}),
});
export const {
	useGetUsersQuery,
	useUpdateUserMutation,
	useGetMeQuery,
	useUpdateMeMutation,
    useCreateUserMutation,
    useGetSingleQuery,
    useGetOrdersQuery,
    useCreateOrderMutation,
    useGetOverviewQuery,
    useGetOrganizationQuery,
    useDeleteOrderMutation,
    useGetBillToQuery,
    useGetCourtNameQuery,
    useGetParticipantsQuery,
    useUpdateOrginazationMutation,
    useCancelOrderMutation,
    useDeleteOrdersMutation,
    useCompleteOrderMutation,
    useCreateBulkOrderMutation,
    useGetCaseTypeQuery,
	useCreateOrginazationMutation
} = userApi;
