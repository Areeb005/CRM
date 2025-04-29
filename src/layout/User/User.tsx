import React, { useState, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useWindowSize } from 'react-use';
import useDarkMode from '../../hooks/useDarkMode';
import Collapse from '../../components/bootstrap/Collapse';
import { NavigationLine } from '../Navigation/Navigation';
import Icon from '../../components/icon/Icon';
import useNavigationItemHandle from '../../hooks/useNavigationItemHandle';
import AuthContext from '../../contexts/authContext';
import Popovers from '../../components/bootstrap/Popovers';
import ThemeContext from '../../contexts/themeContext';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '../../features/auth/login';
// import { SiteApi } from '../../features/sites';
// import { userApi } from '../../features/user';
import { persistor, RootState } from '../../store';
import { logout } from '../../features/auth/authSlice';
import { userApi } from '../../features/users';

const User = () => {
	const { width } = useWindowSize();
	const { setAsideStatus } = useContext(ThemeContext);
	// const { userData, setUser } = useContext(AuthContext);
	// const datas: any = localStorage.getItem('userData');
	const datas = useSelector((state: RootState) => state?.auth?.user)
	const userData = datas;

	const navigate = useNavigate();
	const handleItem = useNavigationItemHandle();
	const { darkModeStatus, setDarkModeStatus } = useDarkMode();

	const [collapseStatus, setCollapseStatus] = useState<boolean>(false);
	const dispatch = useDispatch()

	return (
		<>
			<div
				className={classNames('user', { open: collapseStatus })}
				role='presentation'
				onClick={() => setCollapseStatus(!collapseStatus)}>
				<div className='user-avatar'>
					<img
						srcSet={userData?.profile_picture || "https://facit-modern.omtanke.studio/static/media/wanna1.51c02a1922c3e8783871.webp"}
						src={userData?.profile_picture || "https://facit-modern.omtanke.studio/static/media/wanna1.51c02a1922c3e8783871.webp"}
						alt='Avatar'
						width={128}
						height={128}
					/>
				</div>
				<div className='user-info'>
					<div className='user-name'>
						{`${userData?.UserName || 'User'} `}
						{/* {`Purus Copy`} */}
					</div>
				</div>
			</div>

			<Collapse isOpen={collapseStatus} className='user-menu'>
				<nav aria-label='aside-bottom-user-menu'>
					<div className='navigation'>
						<div
							role='presentation'
							className='navigation-item cursor-pointer'
							onClick={() =>
								navigate(
									`/setting`,
									// @ts-ignore
									handleItem(),
								)
							}>
							<span className='navigation-link navigation-link-pill'>
								<span className='navigation-link-info'>
									<Icon icon='AccountBox' className='navigation-icon' />
									<span className='navigation-text'>Setting</span>
								</span>
							</span>
						</div>
						<div
							role='presentation'
							className='navigation-item cursor-pointer'
							onClick={() => {
								setDarkModeStatus(!darkModeStatus);
								handleItem();
							}}>
							{/* <span className='navigation-link navigation-link-pill'>
								<span className='navigation-link-info'>
									<Icon
										icon={darkModeStatus ? 'DarkMode' : 'LightMode'}
										color={darkModeStatus ? 'info' : 'warning'}
										className='navigation-icon'
									/>
									<span className='navigation-text'>
										{darkModeStatus
											? (t('menu:DarkMode') as ReactNode)
											: (t('menu:LightMode') as ReactNode)}
									</span>
								</span>
							</span> */}
						</div>
					</div>
				</nav>
				<NavigationLine />
				<nav aria-label='aside-bottom-user-menu-2'>
					<div className='navigation'>
						<div
							// role='presentation'
							// className='navigation-item cursor-pointer'
							onClick={() => {
								// if (setUser) {
								// 	setUser('');
								// }
								// if (width < Number(process.env.REACT_APP_MOBILE_BREAKPOINT_SIZE)) {
								// 	setAsideStatus(false);
								// }
								dispatch(authApi.util.resetApiState());
    // dispatch(SiteApi.util.resetApiState());
    dispatch(userApi.util.resetApiState());
    persistor.purge();
    localStorage.clear();
    dispatch(logout());
								localStorage?.clear();
								navigate(`/`);
							}}>
							<span className='navigation-link navigation-link-pill'>
								<span className='navigation-link-info'>
									<Icon icon='Logout' className='navigation-icon' />
									<span className='navigation-text'>Logout</span>
								</span>
							</span>
						</div>
					</div>
				</nav>
			</Collapse>
		</>
	);
};

export default User;
