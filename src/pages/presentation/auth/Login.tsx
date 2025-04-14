import React, { FC, useCallback, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useFormik } from 'formik';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Logo from '../../../components/Logo';
import useDarkMode from '../../../hooks/useDarkMode';
import AuthContext from '../../../contexts/authContext';
import USERS, { getUserDataWithUsername } from '../../../common/data/userDummyData';
import Spinner from '../../../components/bootstrap/Spinner';
import Alert from '../../../components/bootstrap/Alert';
import { useLoginMutation, useRegisterMutation } from '../../../features/auth/login';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../../../features/auth/authSlice';
import { customStyles, states } from '../../../common/data/validationSchemas';
import Select from 'react-select'

interface ILoginHeaderProps {
	isNewUser?: boolean;
}
const LoginHeader: FC<ILoginHeaderProps> = ({ isNewUser }) => {
	if (isNewUser) {
		return (
			<>
				<div className='text-center h1 fw-bold mt-5'>Create Account,</div>
				<div className='text-center h4 text-muted mb-5'>Sign up to get started!</div>
			</>
		);
	}
	return (
		<>
			<div className='text-center h1 fw-bold mt-5'>Welcome,</div>
			<div className='text-center h4 text-muted mb-5'>Sign in to continue!</div>
		</>
	);
};
LoginHeader.defaultProps = {
	isNewUser: false,
};

interface ILoginProps {
	isSignUp?: boolean;
}
const Login: FC<ILoginProps> = ({ isSignUp }) => {
	// const { setUser } = useContext(AuthContext);
	const [doLogin, { isError, error, isLoading }]: any = useLoginMutation();
	const [doRegistration, { isError:registrationIsError , error: registrationError, isLoading: registrationLogin }]: any = useRegisterMutation();
  const dispatch = useDispatch()
	const { darkModeStatus } = useDarkMode();

	const [signInPassword, setSignInPassword] = useState<boolean>(false);
	const [singUpStatus, setSingUpStatus] = useState<boolean>(!!isSignUp);

	const navigate = useNavigate();
	const handleOnClick = useCallback(() => navigate('/dashboard'), [navigate]);

	const usernameCheck = (username: string) => {
		return !!getUserDataWithUsername(username);
	};

	const passwordCheck = (username: string, password: string) => {
		return getUserDataWithUsername(username).password === password;
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			loginUsername: USERS.JOHN.username,
			loginPassword: USERS.JOHN.password,
		},
		validate: (values) => {
			const errors: { loginUsername?: string; loginPassword?: string } = {};

			if (!values.loginUsername) {
				errors.loginUsername = 'Required';
			}

			if (!values.loginPassword) {
				errors.loginPassword = 'Required';
			}

			return errors;
		},
		validateOnChange: false,
		onSubmit: (values) => {
			// handleOnClick();
			doLogin({ username: values.loginUsername, password: values.loginPassword })
				.unwrap()
				.then((response: any) => {
					const userRole = response?.data?.Role;

    if (userRole === "attorney") {
      navigate("/order");
    } else if (userRole === "Administrator") {
      navigate("/dashboard");
    }
					localStorage.setItem('token', response?.access_token);
					localStorage.setItem('userData', JSON.stringify(response?.data));
					dispatch(setToken(response?.access_token));
      dispatch(setUser(response?.data));
					// dispatch(setData(response?.data));
					// dispatch(setUserData(response));
				})
				.catch((err: any) => {
					console.log({ err });
				});
		},
	});
	const signUpFormik = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: "",
            full_name: "",
            firm_name: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            state: "",
            zip: "",
            password: "",
            // confirmPassword: "",
			app_acc_no: 123
        },
        validate: (values) => {
            const errors: Partial<typeof values> = {};

            if (!values.username) errors.username = "Required";
            if (!values.full_name) errors.full_name = "Required";
            if (!values.firm_name) errors.firm_name = "Required";
            if (!values.phone) errors.phone = "Required";
            if (!values.email) errors.email = "Required";
            if (!values.address) errors.address = "Required";
            // if (!values.city) errors.city = "Required";
            if (!values.state) errors.state = "Required";
            if (!values.zip) errors.zip = "Required";
            if (!values.password) errors.password = "Required";
            // if (!values.confirmPassword) errors.confirmPassword = "Required";
            // if (values.password !== values.confirmPassword) errors.confirmPassword = "Passwords do not match";

            return errors;
        },
        validateOnChange: false,
        onSubmit: (values) => {
			doRegistration(values)
			.unwrap()
			.then((response: any) => {
				localStorage.setItem('token', response?.access_token);
				localStorage.setItem('userData', JSON.stringify(response?.data));
				dispatch(setToken(response?.access_token));
  dispatch(setUser(response?.data));
				// dispatch(setData(response?.data));
				// dispatch(setUserData(response));
				handleOnClick();
			})
			.catch((err: any) => {
				console.log({ err });
			});
        },
    });
	// const formik = useFormik({
	// 	enableReinitialize: true,
	// 	initialValues: {
	// 		loginEmail: '',
	// 		loginPassword: '',
	// 	},
	// 	validate: (values) => {
	// 		const errors: { loginEmail?: string; loginPassword?: string } = {};

	// 		if (!values.loginEmail) {
	// 			errors.loginEmail = 'Required';
	// 		}

	// 		if (!values.loginPassword) {
	// 			errors.loginPassword = 'Required';
	// 		}

	// 		return errors;
	// 	},
	// 	validateOnChange: false,
	// 	onSubmit: (values: any) => {
	// 		doLogin({ username: values.loginEmail, password: values.loginPassword })
	// 			.unwrap()
	// 			.then((response: any) => {
	// 				localStorage.setItem('token', response?.access_token);
	// 				localStorage.setItem('userData', JSON.stringify(response?.data));
	// 				dispatch(setToken(response?.access_token));
    //   dispatch(setUser(response?.data));
	// 				// dispatch(setData(response?.data));
	// 				// dispatch(setUserData(response));
	// 				handleOnClick();
	// 			})
	// 			.catch((err: any) => {
	// 				console.log({ err });
	// 			});
	// 	},
	// });
	// const [isLoading, setIsLoading] = useState<boolean>(false);
	const handleContinue = () => {
		// setIsLoading(true);
		setTimeout(() => {
			if (
				!Object.keys(USERS).find(
					(f) => USERS[f].username.toString() === formik.values.loginUsername,
				)
			) {
				formik.setFieldError('loginUsername', 'No such user found in the system.');
			} else {
				setSignInPassword(true);
			}
			// setIsLoading(false);
		}, 1000);
	};
	 const stateOptions = states.map(({ value, text }) => ({
			value,
			label: text,
		  }));
	

	return (
		<PageWrapper
			isProtected={false}
			title={singUpStatus ? 'Sign Up' : 'Login'}
			className="background-gradient">
			<Page className='p-0'>
				<div className='row h-100 align-items-center justify-content-center'>
				<div
  className={`shadow-3d-container ${
    singUpStatus ? 'col-xl-6' : 'col-xl-4'
  } col-lg-6 col-md-8`}
>
						<Card className='shadow-3d-dark' data-tour='login-page'>
							<CardBody>
								{/* <div className='text-center my-5'>
									<Link
										to='/'
										className={classNames(
											'text-decoration-none  fw-bold display-2',
											{
												'text-dark': !darkModeStatus,
												'text-light': darkModeStatus,
											},
										)}
										aria-label='Facit'>
										<Logo width={200} />
									</Link>
								</div> */}
								<div
									className={classNames('rounded-3', {
										'bg-l10-dark': !darkModeStatus,
										'bg-dark': darkModeStatus,
									})}>
									<div className='row row-cols-2 g-3 pb-3 px-3 mt-0'>
										<div className='col'>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												isLight={singUpStatus}
												className='rounded-1 w-100'
												size='lg'
												onClick={() => {
													setSignInPassword(false);
													setSingUpStatus(!singUpStatus);
												}}>
												Login
											</Button>
										</div>
										<div className='col'>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												isLight={!singUpStatus}
												className='rounded-1 w-100'
												size='lg'
												onClick={() => {
													setSignInPassword(false);
													setSingUpStatus(!singUpStatus);
												}}>
												Sign Up
											</Button>
										</div>
									</div>
								</div>

								<LoginHeader isNewUser={singUpStatus} />
								

								{/* <Alert isLight icon='Lock' isDismissible>
									<div className='row'>
										<div className='col-12'>
											<strong>Username:</strong> {USERS.JOHN.username}
										</div>
										<div className='col-12'>
											<strong>Password:</strong> {USERS.JOHN.password}
										</div>
									</div>
								</Alert> */}
								<form className='row g-4' >
									{singUpStatus ? (
										<>
										{registrationIsError ? (
									<Alert isLight icon='Lock' isDismissible>
										<div className='row'>
											<div className='col-12'>{registrationError?.data?.error}</div>
										</div>
									</Alert>
								) : null}
										 <div className="col-6">
          <FormGroup id="username" isFloating label="User Name">
            <Input
              autoComplete="username"
              name="username"
              value={signUpFormik.values.username}
              isTouched={signUpFormik.touched.username}
              invalidFeedback={signUpFormik.errors.username}
              isValid={signUpFormik.isValid}
              onChange={signUpFormik.handleChange}
              onBlur={signUpFormik.handleBlur}
              onFocus={() => signUpFormik.setErrors({})}
            />
          </FormGroup>
        </div>
        <div className="col-6">
          <FormGroup id="full_name" isFloating label="Full Name">
            <Input
              name="full_name"
              value={signUpFormik.values.full_name}
              isTouched={signUpFormik.touched.full_name}
              invalidFeedback={signUpFormik.errors.full_name}
              isValid={signUpFormik.isValid}
              onChange={signUpFormik.handleChange}
              onBlur={signUpFormik.handleBlur}
            />
          </FormGroup>
        </div>
        <div className="col-12">
          <FormGroup id="firm_name" isFloating label="Firm Name">
            <Input
              name="firm_name"
              value={signUpFormik.values.firm_name}
              isTouched={signUpFormik.touched.firm_name}
              invalidFeedback={signUpFormik.errors.firm_name}
              isValid={signUpFormik.isValid}
              onChange={signUpFormik.handleChange}
              onBlur={signUpFormik.handleBlur}
            />
          </FormGroup>
        </div>
        <div className="col-6">
          <FormGroup id="phone" isFloating label="Phone Number">
            <Input
			type='number'
              name="phone"
              value={signUpFormik.values.phone}
              isTouched={signUpFormik.touched.phone}
              invalidFeedback={signUpFormik.errors.phone}
              isValid={signUpFormik.isValid}
              onChange={signUpFormik.handleChange}
              onBlur={signUpFormik.handleBlur}
            />
          </FormGroup>
        </div>
        <div className="col-6">
          <FormGroup id="email" isFloating label="Your email">
            <Input
              type="email"
              autoComplete="email"
              name="email"
              value={signUpFormik.values.email}
              isTouched={signUpFormik.touched.email}
              invalidFeedback={signUpFormik.errors.email}
              isValid={signUpFormik.isValid}
              onChange={signUpFormik.handleChange}
              onBlur={signUpFormik.handleBlur}
            />
          </FormGroup>
        </div>
        <div className="col-12">
          <FormGroup id="address" isFloating label="Address">
            <Input
              name="address"
              value={signUpFormik.values.address}
              isTouched={signUpFormik.touched.address}
              invalidFeedback={signUpFormik.errors.address}
              isValid={signUpFormik.isValid}
              onChange={signUpFormik.handleChange}
              onBlur={signUpFormik.handleBlur}
            />
          </FormGroup>
        </div>
        <div className="col-6">
          <FormGroup id="city" isFloating label="City">
            <Input
              name="city"
              value={signUpFormik.values.city}
              isTouched={signUpFormik.touched.city}
              invalidFeedback={signUpFormik.errors.city}
              isValid={signUpFormik.isValid}
              onChange={signUpFormik.handleChange}
              onBlur={signUpFormik.handleBlur}
            />
          </FormGroup>
        </div>
        <div className="col-4">
          <FormGroup id="state" >
            {/* <Input
              name="state"
              value={signUpFormik.values.state}
              isTouched={signUpFormik.touched.state}
              invalidFeedback={signUpFormik.errors.state}
              isValid={signUpFormik.isValid}
              onChange={signUpFormik.handleChange}
              onBlur={signUpFormik.handleBlur}
            /> */}
			<Select
          options={stateOptions}
          placeholder="Choose State..."
          value={stateOptions.find((option) => option.label === signUpFormik.values.state)}
          onChange={(selectedOption) => signUpFormik.setFieldValue("state", selectedOption?.value)}
          onBlur={() => formik.setFieldTouched("state", true)}
		  styles={customStyles}
        />
          </FormGroup>
        </div>
        <div className="col-2">
          <FormGroup id="zip" isFloating label="Zip">
            <Input
              name="zip"
              value={signUpFormik.values.zip}
              isTouched={signUpFormik.touched.zip}
              invalidFeedback={signUpFormik.errors.zip}
              isValid={signUpFormik.isValid}
              onChange={signUpFormik.handleChange}
              onBlur={signUpFormik.handleBlur}
            />
          </FormGroup>
        </div>
        <div className="col-6">
          <FormGroup id="password" isFloating label="Password">
            <Input
              type="password"
              autoComplete="new-password"
              name="password"
              value={signUpFormik.values.password}
              isTouched={signUpFormik.touched.password}
              invalidFeedback={signUpFormik.errors.password}
              isValid={signUpFormik.isValid}
              onChange={signUpFormik.handleChange}
              onBlur={signUpFormik.handleBlur}
            />
          </FormGroup>
        </div>
        {/* <div className="col-6">
          <FormGroup id="confirmPassword" isFloating label="Confirm Password">
            <Input
              type="password"
              autoComplete="new-password"
              name="confirmPassword"
              value={signUpFormik.values.confirmPassword}
              isTouched={signUpFormik.touched.confirmPassword}
              invalidFeedback={signUpFormik.errors.confirmPassword}
              isValid={signUpFormik.isValid}
              onChange={signUpFormik.handleChange}
              onBlur={signUpFormik.handleBlur}
            />
          </FormGroup>
        </div> */}
											<div className='col-12'>
												<Button
													// color='info'
													className='w-100 py-3 button-gradient'
													onClick={signUpFormik.handleSubmit}
													type='submit'
													>
													Sign Up
												</Button>
											</div>
										</>
									) : (
										<>
										{isError ? (
									<Alert isLight icon='Lock' isDismissible>
										<div className='row'>
											<div className='col-12'>{error?.data?.error}</div>
										</div>
									</Alert>
								) : null}
											<div className='col-12'>
												<FormGroup
													id='loginUsername'
													isFloating
													label='Your email or username'
													className={classNames({
														'd-none': signInPassword,
													})}>
													<Input
														autoComplete='username'
														value={formik.values.loginUsername}
														isTouched={formik.touched.loginUsername}
														invalidFeedback={
															formik.errors.loginUsername
														}
														isValid={formik.isValid}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														onFocus={() => {
															formik.setErrors({});
														}}
													/>
												</FormGroup>
												
												<FormGroup
													id='loginPassword'
													isFloating
													label='Password'
													className='my-3'>
													<Input
														type='password'
														autoComplete='current-password'
														value={formik.values.loginPassword}
														isTouched={formik.touched.loginPassword}
														invalidFeedback={
															formik.errors.loginPassword
														}
														validFeedback='Looks good!'
														isValid={formik.isValid}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												
											<Button
											color='primary'
											className='w-100 py-3'
											isDisable={isLoading}
											onClick={formik.handleSubmit}
											type='submit'
											>
											{isLoading ? (
												<Spinner isSmall inButton isGrow />
											) : (
												'Login'
											)}
										</Button>
											</div>
										</>
									)}

									{/* BEGIN :: Social Login */}
								
									{/* END :: Social Login */}
								</form>
							</CardBody>
						</Card>
						{/* <div className='text-center'>
							<a
								href='/'
								className={classNames('text-decoration-none me-3', {
									'link-light': singUpStatus,
									'link-dark': !singUpStatus,
								})}>
								Privacy policy
							</a>
							<a
								href='/'
								className={classNames('link-light text-decoration-none', {
									'link-light': singUpStatus,
									'link-dark': !singUpStatus,
								})}>
								Terms of use
							</a>
						</div> */}
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};
Login.propTypes = {
	isSignUp: PropTypes.bool,
};
Login.defaultProps = {
	isSignUp: false,
};

export default Login;
