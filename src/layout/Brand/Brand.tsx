import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Icon from '../../components/icon/Icon';
import Logo from '../../components/Logo';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useError } from 'react-use';

interface IBrandProps {
	asideStatus: boolean;
	setAsideStatus(...args: unknown[]): unknown;
}
const Brand: FC<IBrandProps> = ({ asideStatus, setAsideStatus }) => {
		const user = useSelector((state: RootState) => state?.auth?.user)
		console.log(user?.role, "User")
	return (
		<div className='brand'>
			<div className='brand-logo'>
				<h1 className='brand-title '>
					<Link to={user?.role === "admin" ? "/dashboard" : "/order"} aria-label='Logo'>
						<Logo height={32} />
					</Link>
				</h1>
			</div>
			<button
				type='button'
				className='btn brand-aside-toggle'
				aria-label='Toggle Aside'
				onClick={() => setAsideStatus(!asideStatus)}>
				<Icon icon='FirstPage' className='brand-aside-toggle-close' />
				<Icon icon='LastPage' className='brand-aside-toggle-open' />
			</button>
		</div>
	);
};
Brand.propTypes = {
	asideStatus: PropTypes.bool.isRequired,
	setAsideStatus: PropTypes.func.isRequired,
};

export default Brand;
