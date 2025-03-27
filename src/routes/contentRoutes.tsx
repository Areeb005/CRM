import React, { lazy } from 'react';
// import { dashboardPagesMenu,  } from '../menu';
import Login from '../pages/presentation/auth/Login';
import AddUser from '../pages/presentation/users/addusers';
import UsersPage from '../pages/presentation/users/users';
import OrderPage from '../pages/presentation/orders';
import AddOrder from '../pages/presentation/orders/addOrder';
import SettingPage from '../pages/presentation/setting';
import OrderDetails from '../pages/presentation/orders/viewOrder';

const LANDING = {
	DASHBOARD: lazy(() => import('../pages/presentation/dashboard/DashboardPage')),
};
const AUTH = {
	PAGE_404: lazy(() => import('../pages/presentation/auth/Page404')),
};
const PAGE_LAYOUTS = {
	HEADER_SUBHEADER: lazy(() => import('../pages/presentation/page-layouts/HeaderAndSubheader')),
	HEADER: lazy(() => import('../pages/presentation/page-layouts/OnlyHeader')),
	SUBHEADER: lazy(() => import('../pages/presentation/page-layouts/OnlySubheader')),
	CONTENT: lazy(() => import('../pages/presentation/page-layouts/OnlyContent')),
	BLANK: lazy(() => import('../pages/presentation/page-layouts/Blank')),
	ASIDE: lazy(() => import('../pages/presentation/aside-types/DefaultAsidePage')),
	MINIMIZE_ASIDE: lazy(() => import('../pages/presentation/aside-types/MinimizeAsidePage')),
};



const authRoutes = [
	{
		path: '/',
		element: <Login />,
	},
];
const presentation = [
	/**
	 * Landing
	 */
	{
		path: "/dashboard",
		element: <LANDING.DASHBOARD />,
	},
	{
		path: "/users",
		element: <UsersPage/>,
	},
	{
		path: "/new-users",
		element: <AddUser/>,
	},
	{
		path: "/user/:id",
		element: <AddUser/>,
	},
	{
		path: "/order",
		element: <OrderPage/>,
	},
	{
		path: "/order/add-order",
		element: <AddOrder/>,
	},
	{
		path: "/order/:id",
		element: <OrderDetails/>,
	},
	{
		path: "/setting",
		element: <SettingPage/>,
	},
	// {
	// 	path: demoPagesMenu.page404.path,
	// 	element: <AUTH.PAGE_404 />,
	// },
	// {
	// 	path: "/",
	// 	element: <Login />,
	// },
	// {
	// 	path: demoPagesMenu.signUp.path,
	// 	element: <Login isSignUp />,
	// },

	/** ************************************************** */

	/**
	 * Page Layout Types
	 */
];

const Attorney = [
	{
		path: "/order",
		element: <OrderPage/>,
	},
	{
		path: "/order/add-order",
		element: <AddOrder/>,
	},
	{
		path: "/order/:id",
		element: <OrderDetails/>,
	},
	{
		path: "/setting",
		element: <SettingPage/>,
	},
]
const contents = [...presentation];

export  {contents, Attorney, authRoutes};
