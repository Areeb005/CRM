import { Middleware, configureStore } from '@reduxjs/toolkit';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import { persistStore, persistReducer } from 'reduxjs-toolkit-persist';
import { combineReducers } from '@reduxjs/toolkit';
import { authApi } from './features/auth/login';

import authReducer from './features/auth/authSlice'
import { userApi } from './features/users';

const persistConfig = {
	key: 'root',
	storage,
	blacklist: ['campaignApi', 'authApi'],
	whitelist: ["auth"],
};

const rootReducer = combineReducers({
	[authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
	auth: authReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware: any) =>
		getDefaultMiddleware({ serializableCheck: false }).concat(
			authApi.middleware as Middleware<{}>,
		).concat(userApi.middleware as Middleware<{}>),
});

const persistor = persistStore(store);

export { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
