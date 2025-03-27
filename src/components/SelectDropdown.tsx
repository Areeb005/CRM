import React from 'react';
import classNames from 'classnames';
import Select, { components } from 'react-select';
import Button from './bootstrap/Button';
// import Button from '../bootstrap/Button';

const CustomOption = (props: any) => {
	return (
		<components.Option {...props}>
			<div className='d-flex gap-3 align-items-center'>
				<div>
					<img
						style={{
							width: '20px',
							height: '20px',
							borderRadius: '50%',
						}}
						src={props?.data?.data?.picture}
						alt=''
					/>
				</div>
				<div>
					<div style={{ fontSize: 12 }} className={classNames('fw-bold')}>
						{props?.data?.data?.username}
					</div>
					<div className='text-muted'>
						<small>{props?.data?.data?.fullname}</small>
					</div>
				</div>
			</div>
		</components.Option>
	);
};

const colourStyles = {
	menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),

	menu: (provided: any) => ({
		...provided,
		overflowY: 'auto',
	}),
	menuList: (provided: any) => ({
		...provided,
		maxHeight: 250, // Adjust this as needed
	}),
	placeholder: (provided: any) => ({
		...provided,
		color: '#323232',
		// color: '#43269a', // Change this to your desired color
		// '&:hover': {
		// 	color: '#fff',
		// },
	}),
	control: (styles: any, state: any) => ({
		...styles,
		// '&:hover': {
		// 	backgroundColor: '#43269a',
		// 	color: '#fff',
		// },
		boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(67, 38, 154, 0.25)' : 'inset 0 1px 2px rgba(0, 0, 0, 0.075)',
		borderColor: state.isFocused ? '#a193cd' : '#f8f9fa',
		'&:hover': {
			borderColor: state.isFocused ? '#a193cd' : '#f8f9fa',
		},
		backgroundColor: '#f8f9fa',
		borderRadius: 10,
		color: '#323232',
		//		borderColor: 'transparent', // Remove all borders
		// boxShadow: 'none', // Optional: Remove box shadow if present
	}),
	option: (styles: any, { data, isDisabled, isFocused, isSelected }: any): any => {
		return {
			...styles,
			margin: '5px 0',
			padding: '5px 10px',
			backgroundColor: '#fff',
			// backgroundColor: isSelected ? '#ece9f5' : '#fff',
			color: '#323232',
			cursor: 'pointer',
			// cursor: isDisabled ? 'not-allowed' : 'default',
			borderRadius: 5,
			fontWeight: 600,
			fontSize: '1rem',
			'&:hover': {
				backgroundColor: '#ece9f5',
			},
		};
	},
};

const SelectDropdown = ({
	handleInputChange,
	onChange,
	options,
	value,
	placeholder,
	selected,
	handleRemoveSelected,
	handleChangeSelected,
	perCentOptions,
}: any) => {
	return (
		<>
			<Select
				menuPortalTarget={document.body}
				classNamePrefix='custom-select'
				styles={colourStyles}
				isClearable
				onInputChange={handleInputChange}
				onChange={onChange}
				options={options}
				value={value}
				placeholder={placeholder}
				components={placeholder == 'Name or @handle' ? { Option: CustomOption } : {}}
			/>
			{selected?.length ? (
				<div className='my-2'>
					{selected?.map((selectedCountry: any, index: any) => (
						<div key={index} className='my-2 '>
							<Button
								icon='Cancel'
								className=''
								onClick={() => handleRemoveSelected(selectedCountry, index)}>
								{selectedCountry?.title || selectedCountry?.label}
							</Button>
							{selectedCountry.weight ? (
								<Select
									menuPortalTarget={document.body}
									classNamePrefix='custom-select'
									styles={colourStyles}
									value={{
										label: `>${selectedCountry.weight * 100}%`,
										value: selectedCountry.weight,
									}}
									onChange={(e) => handleChangeSelected(e, selectedCountry?.id)}
									options={perCentOptions}
								/>
							) : null}
						</div>
					))}
				</div>
			) : null}
		</>
	);
};

export default SelectDropdown;
