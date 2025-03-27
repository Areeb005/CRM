const getAuthTokenFromLocalStorage = () => {
	const token = localStorage.getItem('token');
	return token || '';
};
export default getAuthTokenFromLocalStorage;