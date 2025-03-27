import React, { useState } from 'react';
import { useFormik } from 'formik';
import dayjs, { Dayjs } from 'dayjs';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPagesMenu } from '../../../menu';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';
// import validate from './helper/editPagesValidate';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
// import useDarkMode from '../../../hooks/useDarkMode';
import Spinner from '../../../components/bootstrap/Spinner';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import Avatar from '../../../components/Avatar';
import USERS from '../../../common/data/userDummyData';
// import CommonDesc from '../../../common/other/CommonDesc';
import Label from '../../../components/bootstrap/forms/Label';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import { useGetOrganizationQuery, useUpdateMeMutation, useUpdateOrginazationMutation, useUpdateUserMutation } from '../../../features/users';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import axios from 'axios';
import getAuthTokenFromLocalStorage from '../../../utils';
import { setLogo, setUser } from '../../../features/auth/authSlice';

const SettingPage = () => {
	// const { themeStatus } = useDarkMode();

	/**
	 * Common
	 */
	const [lastSave, setLastSave] = useState<Dayjs | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const userData = useSelector((state: RootState) => state.auth.user);
	const shouldSkip = !userData || userData.role === "attorney";
console.log(userData)
const { data: organization } = useGetOrganizationQuery(undefined, {
  skip: shouldSkip,
});

const dispatch = useDispatch()

const [updateUser , {isLoading: uploadLoading}] = useUpdateMeMutation()
const [updateOrgination] = useUpdateOrginazationMutation()
	console.log(organization, "organization")
	const handleSave = async () => {
		setIsLoading(true);
	
		// Filter out empty or unchanged values for user update
		const userFields = ["oldPassword", "password", "profile_picture"];
		const updatedUserValues = Object.keys(formik.values).reduce((acc, key) => {
			if (userFields.includes(key) && formik.values[key] !== "" && formik.values[key] !== formik.initialValues[key]) {
				acc[key] = formik.values[key];
			}
			return acc;
		}, {} as Record<string, any>);
	
		// Filter out empty or unchanged values for organization update
		const organizationFields = ["orginaztionName", "orginaztionContact", "orginaztionWebsite", "emailAddress", "favicon"];
		const updatedOrganizationValues = Object.keys(formik.values).reduce((acc, key) => {
			if (organizationFields.includes(key) && formik.values[key] !== "" && formik.values[key] !== formik.initialValues[key]) {
				acc[key] = formik.values[key];
			}
			return acc;
		}, {} as Record<string, any>);
	
		try {
			// Update user if there are changes in password fields
			if (Object.keys(updatedUserValues).length > 0) {
			  const response = 	await updateUser(updatedUserValues).unwrap();
			  console.log(response)
			   dispatch(setUser(response?.user));
			}
	
			// Update organization if there are changes in org-related fields
			if (Object.keys(updatedOrganizationValues).length > 0) {
				await updateOrgination({ body: updatedOrganizationValues, id: userData.id }).unwrap();
			}
	
			// Set last save time
			setLastSave(dayjs());
	
			// Show success notification
			showNotification(
				<span className="d-flex align-items-center">
					<Icon icon="Info" size="lg" className="me-1" />
					<span>Updated Successfully</span>
				</span>,
				"User and organization details have been successfully updated."
			);
		} catch (error) {
			console.error("Error updating details:", error);
	
			// Show error notification
			showNotification(
				<span className="d-flex align-items-center text-danger">
					<Icon icon="Error" size="lg" className="me-1" />
					<span>Update Failed</span>
				</span>,
				`There was an error updating the details. Please try again.
				${error?.data?.error}
				`,
				"danger"
			);
		}
	
		setIsLoading(false);
	};
	
	  
	  // Call handleSave on form submit
	 

	const formik = useFormik({
		initialValues: {
			orginaztionName: organization?.organization_name ||  '',
			orginaztionContact: organization?.organization_contact || '',
			orginaztionWebsite: organization?.organization_website ||  '',
			emailAddress: organization?.notification_email  || 'johndoe@site.com',
			phone: '',
			oldPassword: '',
			password: '',
			// confirmPassword: '',
			favicon: organization?.favicon || null,
			profile_picture: null
		},
		enableReinitialize: true,
		// validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 0);
		},
	});
	const [isUploading, setIsUploading] = useState(false); // Loading state
	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0]; // Get only the first selected file
	
			const formData = new FormData();
			formData.append("files", file); // Ensure API supports single file upload
	
			console.log("📂 File selected:", file);
			console.log("📤 FormData before upload:", formData);
			setIsUploading(true); // Start loading
	
			try {
				// Replace with your actual API endpoint
				const response = await axios.post(
					"https://casemanagement.medbillcollections.net/api/upload",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
							Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`, // Attach the token
						},
					}
				);
	
				console.log("✅ Upload response:", response.data);
	
				if (response.data?.files?.length > 0) {
					const uploadedFileUrl = `https://casemanagement.medbillcollections.net/api/${response.data.files[0].path}`;
					
					console.log("🖼️ Uploaded file URL:", uploadedFileUrl);
	
					// Update Formik with the new file URL (not an array)
					formik.setFieldValue("favicon", uploadedFileUrl);
					dispatch(setLogo(uploadedFileUrl))
	
					// Reset file input
					event.target.value = "";
				}
			} catch (error) {
				console.error("❌ File upload failed:", error);
			}
			finally {
				setIsUploading(false); // Stop loading
				event.target.value = ""; // Reset file input
			}
		}
	};
	
	

const handleFileChangeProfile = async (event: React.ChangeEvent<HTMLInputElement>) => {
	if (event.target.files && event.target.files.length > 0) {
		const file = event.target.files[0]; // Get only the first selected file

		const formData = new FormData();
		formData.append("files", file); // Ensure API supports single file upload

		console.log("📂 File selected:", file);
		console.log("📤 FormData before upload:", formData);

		setIsUploading(true); // Start loading

		try {
			// Replace with your actual API endpoint
			const response = await axios.post(
				"https://casemanagement.medbillcollections.net/api/upload",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`, // Attach the token
					},
				}
			);

			console.log("✅ Upload response:", response.data);

			if (response.data?.files?.length > 0) {
				const uploadedFileUrl = `https://casemanagement.medbillcollections.net/api/${response.data.files[0].path}`;
				
				console.log("🖼️ Uploaded file URL:", uploadedFileUrl);

				// Update Formik with the new file URL
				formik.setFieldValue("profile_picture", uploadedFileUrl);
			}
		} catch (error) {
			console.error("❌ File upload failed:", error);
		} finally {
			setIsUploading(false); // Stop loading
			event.target.value = ""; // Reset file input
		}
	}
};

	

	const [passwordChangeCTA, setPasswordChangeCTA] = useState<boolean>(false);

	return (
		<PageWrapper >
			<Page>
				<div className='row h-100 align-content-start'>
					<div className='col-md-12'>
						<Card>
							<CardBody>
								<div className='col-12'>
									<div className='row g-4 align-items-center'>
									{userData?.role !== "attorney" ?
									<>
										<div className='col-lg-auto'>
										{isUploading && (
		<div className="avatar-loading-overlay">
			<Spinner isGrow color="primary" />
		</div>
	)}
											<Avatar
												srcSet={ formik.values.favicon || USERS.JOHN.src }
												src={formik.values.favicon || USERS.JOHN.src }
												color={USERS.JOHN.color}
												rounded={3}
											/>
										</div>
										
										
										
										<div className='col-lg'>
											<div className='row g-4'>
												<div className='col-auto'>
													<Input
														type='file'
														autoComplete='photo'
														ariaLabel='Upload image file'
														onChange={handleFileChange}
													/>
												</div>
												
												<div className='col-12'>
													<p className='lead text-muted'>
														Upload Logo from here.
													</p>
												</div>
											</div>
										</div>
										</>
										:
										<>
										<div className='col-lg-auto'>
										<div className="col-lg-auto position-relative">
	{isUploading && (
		<div className="avatar-loading-overlay">
			<Spinner isGrow color="primary" />
		</div>
	)}
	<Avatar
		srcSet={formik.values.profile_picture || USERS.JOHN.src}
		src={formik.values.profile_picture || USERS.JOHN.src}
		color={USERS.JOHN.color}
		rounded={3}
	/>
</div>
										</div>
										
										
										
										<div className='col-lg'>
											<div className='row g-4'>
												<div className='col-auto'>
													<Input
														type='file'
														autoComplete='photo'
														ariaLabel='Upload image file'
														onChange={handleFileChangeProfile}
													/>
												</div>
												
												<div className='col-12'>
													<p className='lead text-muted'>
														Upload Logo from here.
													</p>
												</div>
											</div>
										</div>
										</>}
									</div>
								</div>
							</CardBody>
						</Card>
						{userData?.role !== "attorney" &&
						<Card>
							<CardHeader>
								<CardLabel icon='Person' iconColor='success'>
									<CardTitle tag='div' className='h5'>
										Organization
									</CardTitle>
									<CardSubTitle tag='div' className='h6'>
										Organization Detail
									</CardSubTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-4'>
									<div className='col-md-6'>
										<FormGroup id='orginaztionName' label='Organization Name' isFloating>
											<Input
												placeholder='First Name'
												autoComplete='additional-name'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.orginaztionName}
												isValid={formik.isValid}
												isTouched={formik.touched.orginaztionName}
												invalidFeedback={formik.errors.orginaztionName}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
									<div className='col-md-6'>
										<FormGroup id='lastName' label='Organization Contact' isFloating>
											<Input
												placeholder='Last Name'
												autoComplete='family-name'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.orginaztionContact}
												isValid={formik.isValid}
												isTouched={formik.touched.orginaztionContact}
												invalidFeedback={formik.errors.orginaztionContact}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
									<div className='col-12'>
										<FormGroup
											id='displayName'
											label='Organization Website'
											isFloating
											>
											<Input
												placeholder='Display Name'
												autoComplete='username'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.orginaztionWebsite}
												isValid={formik.isValid}
												isTouched={formik.touched.orginaztionWebsite}
												invalidFeedback={formik.errors.orginaztionWebsite}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
									<div className='col-12'>
										<FormGroup
											id='displayName'
											label='Notifization Email'
											isFloating
											>
											<Input
												placeholder='Display Name'
												autoComplete='username'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.emailAddress}
												isValid={formik.isValid}
												isTouched={formik.touched.emailAddress}
												invalidFeedback={formik.errors.emailAddress}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
								</div>
							</CardBody>
						</Card>}
						
						<Card>
							<CardHeader>
								<CardLabel icon='LocalPolice' iconColor='primary'>
									<CardTitle tag='div' className='h5'>
										Password
									</CardTitle>
									<CardSubTitle tag='div' className='h6'>
										Password change operations
									</CardSubTitle>
								</CardLabel>
								<CardActions>
									{passwordChangeCTA ? (
										<Button
											color='danger'
											isLight
											icon='Cancel'
											onClick={() => setPasswordChangeCTA(false)}>
											Cancel
										</Button>
									) : (
										<>
											<span>Do you want to change?</span>
											<Button
												color='primary'
												isLight
												icon='PublishedWithChanges'
												onClick={() => setPasswordChangeCTA(true)}>
												Yes
											</Button>
										</>
									)}
								</CardActions>
							</CardHeader>
							{passwordChangeCTA && (
								<CardBody>
									<div className='row g-4'>
										<div className='col-12'>
											<FormGroup
												id='oldPassword'
												label='Current password'
												isFloating>
												<Input
													type='password'
													placeholder='Current password'
													autoComplete='current-password'
													onChange={formik.handleChange}
													value={formik.values.oldPassword}
												/>
											</FormGroup>
										</div>
										<div className='col-12'>
											<FormGroup
												id='password'
												label='New password'
												isFloating>
												<Input
													type='password'
													placeholder='New password'
													autoComplete='new-password'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.password}
													isValid={formik.isValid}
													isTouched={formik.touched.password}
													invalidFeedback={formik.errors.password}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
										{/* <div className='col-12'>
											<FormGroup
												id='confirmPassword'
												label='Confirm new password'
												isFloating>
												<Input
													type='password'
													placeholder='Confirm new password'
													autoComplete='new-password'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.confirmPassword}
													isValid={formik.isValid}
													isTouched={formik.touched.confirmPassword}
													invalidFeedback={formik.errors.confirmPassword}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div> */}
									</div>{' '}
								</CardBody>
							)}
							{/* <CardFooter>
								<CommonDesc>
									For your security, we recommend that you change your password
									every 3 months at most.
								</CommonDesc>
							</CardFooter> */}
						</Card>
					</div>
					
				</div>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardBody>
								<div className='row align-items-center'>
									<div className='col'>
										{lastSave ? (
											<>
												<Icon
													icon='DoneAll'
													size='lg'
													className='me-2 text-muted'
												/>
												<span className='me-2 text-muted'>Last Saved</span>
												<strong>
													{dayjs(lastSave).format(
														'MMMM Do, YYYY - HH:mm',
													)}
												</strong>
											</>
										) : (
											<>
												<Icon
													icon='Warning'
													size='lg'
													className='me-2 text-warning'
												/>
												<span className='text-warning'>Not saved yet</span>
											</>
										)}
									</div>
									<div className='col-auto'>
										<div className='row g-1'>
											<div className='col-auto'>
												<Button
													className='me-3'
													icon={isLoading ? undefined : 'Save'}
													isLight
													color={lastSave ? 'info' : 'success'}
													isDisable={isLoading}
													onClick={formik.handleSubmit}>
													{isLoading && <Spinner isSmall inButton />}
													{isLoading
														? (lastSave && 'Saving') || 'Saving'
														: (lastSave && 'Save') || 'Save'}
												</Button>
											</div>
											<div className='col-auto'>
												<Dropdown direction='up'>
													<DropdownToggle hasIcon={false}>
														<Button
															// color={themeStatus}
															icon='MoreVert'
															aria-label='More'
														/>
													</DropdownToggle>
													<DropdownMenu isAlignmentEnd>
														<DropdownItem>
															<Button
																className='me-3'
																icon='Save'
																isLight
																isDisable={isLoading}
																onClick={formik.resetForm}>
																Reset
															</Button>
														</DropdownItem>
													</DropdownMenu>
												</Dropdown>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default SettingPage;
