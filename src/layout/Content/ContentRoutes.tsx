import React, { lazy, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {Attorney, authRoutes, contents} from '../../routes/contentRoutes';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNetworkState } from 'react-use';

const PAGE_404 = lazy(() => import('../../pages/presentation/auth/Page404'));
const ContentRoutes = () => {
	const userData = useSelector((state: RootState) => state.auth.user);
	const user = useSelector((state: RootState) => state.auth.token);
	const navigate = useNavigate();
	const state = useNetworkState();
	console.log(userData, "userData")
	useEffect(() => {
		if (!user) {
			// Redirect to login page if the user is not authenticated
			if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
				navigate('/');
			}
		} 
		else {
			// Prevent navigating back to login page if user is authenticated
			if (window.location.pathname === '/') {
				navigate('/dashboard'); // Redirect authenticated users to the homepage
			}
		}
	}, [user, navigate]);

	if (!state.online) {
		return <h1 className='mx-auto my-auto'>Please Connect your internet</h1>;
	}
	return (
		<Routes>
			{user !== null && userData?.Role === "Administrator" &&
				contents.map((page) => (
					// eslint-disable-next-line react/jsx-props-no-spreading
					<Route key={page.path} {...page} />
				))}
			{user !== null && userData?.Role === "attorney" &&
				Attorney.map((page) => (
					// eslint-disable-next-line react/jsx-props-no-spreading
					<Route key={page.path} {...page} />
				))}
					{authRoutes?.map((item) => <Route key={item?.path} {...item} />)}
			<Route path='*' element={<PAGE_404 />} />
		</Routes>
	);
};

export default ContentRoutes;
