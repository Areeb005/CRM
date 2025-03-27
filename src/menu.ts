// export const summaryPageTopMenu = {
// 	intro: { id: 'intro', text: 'Intro', path: '#intro', icon: 'Vrpano', subMenu: null },
// 	bootstrap: {
// 		id: 'bootstrap',
// 		text: 'Bootstrap Components',
// 		path: '#bootstrap',
// 		icon: 'BootstrapFill',
// 		subMenu: null,
// 	},
// 	storybook: {
// 		id: 'storybook',
// 		text: 'Storybook',
// 		path: '#storybook',
// 		icon: 'CustomStorybook',
// 		subMenu: null,
// 	},
// 	formik: {
// 		id: 'formik',
// 		text: 'Formik',
// 		path: '#formik',
// 		icon: 'CheckBox',
// 		subMenu: null,
// 	},
// 	apex: {
// 		id: 'apex',
// 		text: 'Apex Charts',
// 		path: '#apex',
// 		icon: 'AreaChart',
// 		subMenu: null,
// 	},
// };

const allMenus: Record<string, any> = {
	admin:{
		dashboard: {
			id: 'dashboard',
			text: 'Dashboard',
			path: '/dashboard',
			icon: 'Dashboard',
			subMenu: null,
		},
		users: {
			id: 'users',
			text: 'Users',
			path: '/users',
			icon: 'People',
			subMenu: null,
		},
		order: {
			id: 'order',
			text: 'Order',
			path: '/order',
			icon: 'Cases',
			subMenu: null,
		},
	},
	attorney:{
		order: {
			id: 'order',
			text: 'Order',
			path: '/order',
			icon: 'Cases',
			subMenu: null,
		},
	}
}

// Function to get the menu based on the user type
export const getDashboardMenu = (userType: string | undefined) => {
  return userType && allMenus[userType] ? allMenus[userType] : {};
};

// export const dashboardPagesMenu = {
// 	dashboard: {
// 		id: 'dashboard',
// 		text: 'Dashboard',
// 		path: '/dashboard',
// 		icon: 'Dashboard',
// 		subMenu: null,
// 	},
// 	users: {
// 		id: 'users',
// 		text: 'Users',
// 		path: '/users',
// 		icon: 'People',
// 		subMenu: null,
// 	},
// 	order: {
// 		id: 'order',
// 		text: 'Order',
// 		path: '/order',
// 		icon: 'Cases',
// 		subMenu: null,
// 	},
// };

// export const demoPagesMenu = {
	
// 	login: {
// 		id: 'login',
// 		text: 'Login',
// 		path: '/',
// 		icon: 'Login',
// 	},
// 	signUp: {
// 		id: 'signUp',
// 		text: 'Sign Up',
// 		path: 'auth-pages/sign-up',
// 		icon: 'PersonAdd',
// 	},
// 	page404: {
// 		id: 'Page404',
// 		text: '404 Page',
// 		path: 'auth-pages/404',
// 		icon: 'ReportGmailerrorred',
// 	},
// };




