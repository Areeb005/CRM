import React from 'react';
import { RouteProps } from 'react-router-dom';
// import { demoPagesMenu } from '../menu';
import DefaultFooter from '../pages/_layout/_footers/DefaultFooter';

const footers: RouteProps[] = [
	// { path: pageLayoutTypesPagesMenu.blank.path, element: null },
	{ path: "/", element: null },
	// { path: demoPagesMenu.signUp.path, element: null },
	// { path: demoPagesMenu.page404.path, element: null },
	{ path: '*' },
];

export default footers;
