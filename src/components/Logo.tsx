import React, { FC } from 'react';
import PropTypes from 'prop-types';
import Logos from '../assets/logoimg.jpeg'
import { useGetOrganizationQuery } from '../features/users';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useFavicon } from 'react-use';

interface ILogoProps {
	width?: number;
	height?: number;
}
const Logo: FC<ILogoProps> = ({ width, height }) => {

	const {data} = useGetOrganizationQuery({})
	const logoimg = useSelector((state: RootState) => state?.auth?.logo)
	console.log(data, "data")
	return (
		<img
		style={{objectFit:"cover"}}
		src={Logos ||logoimg || data?.OrganizationLogo}
		width={height !== 854 && !!height ? height * (2155 / 554) : width}
		height={width !== 2155 && !!width ? width * (854 / 2155) : height}
	/>
	);
};
Logo.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
};
Logo.defaultProps = {
	width: 2155,
	height: 854,
};

export default Logo;
