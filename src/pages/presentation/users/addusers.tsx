import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Button from '../../../components/bootstrap/Button';
import Spinner from '../../../components/bootstrap/Spinner';
import Page from '../../../layout/Page/Page';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import dayjs, { Dayjs } from 'dayjs';
import Input from '../../../components/bootstrap/forms/Input';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as Yup from "yup";
// import Select from '../../../components/bootstrap/forms/Select';
import Select from 'react-select'
import { useCreateUserMutation, useGetSingleQuery } from '../../../features/users';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import { states } from '../../../common/data/validationSchemas';

const customStyles = {
	control: (base: any) => ({
		...base,
		backgroundColor: '#f9f9f9', // Light gray background
		border: '1px solid #e0e0e0', // Light border
		borderRadius: '10px', // Rounded corners
		boxShadow: 'none', // Remove default shadow
		padding: '3px 5px', // Add padding
		textTransform: 'capitalize',
		'&:hover': {
			border: '1px solid #bbb', // Slightly darker border on hover
		},
	}),
	placeholder: (base: any) => ({
		...base,
		color: '#aaa', // Placeholder text color
		fontSize: '12px',
	}),
	singleValue: (base: any) => ({
		...base,
		color: '#555', // Selected value text color
	}),
	menu: (base: any) => ({
		...base,
		zIndex: 9999,
		borderRadius: '10px', // Rounded corners for dropdown menu
		overflow: 'hidden',
	}),
	option: (base: any, state: any) => ({
		...base,
		backgroundColor: state.isFocused ? '#f0f0f0' : '#fff', // Light gray on hover
		color: '#333',
		cursor: 'pointer',
		'&:active': {
			backgroundColor: '#eaeaea', // Slightly darker gray when clicked
		},
	}),
};

interface IFormValues {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	user_type: string;
}
const validationSchema = Yup.object({
    username: Yup.string().required("User Name is required"),
    role: Yup.string().required("Role is required"),
    app_acct_no: Yup.string().required("App Acct No is required"),
    firm_name: Yup.string().required("Firm Name is required"),
    full_name: Yup.string().required("First Name is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zip: Yup.string()
      .matches(/^\d{5}$/, "Zip Code must be 5 digits")
      .required("Zip Code is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Confirm Password is required"),
  });
  
  const roleOptions = [
    // { value: "administrator", label: "Administrator" },
    { value: "attorney", label: "Attorney" },
  ];

const AddUser = () => {
	const navigate = useNavigate();
  const [create, { isLoading, error }] = useCreateUserMutation();
  const { id } = useParams();
  const [items, setItems] = useState<any>({});
	const { data: user, isLoading:userLoading , refetch} = useGetSingleQuery({ type: 'user', id }, { skip: !id });
  console.log(user)

	useEffect(()=>{
    if(id){

      refetch()
    }
  },[])

    const formik = useFormik({
        initialValues: {
          username: user ? user?.data?.UserName :  "",
          full_name: user ? user?.data?.FullName : "",
          role: user ? (user?.data?.Role).toLowerCase() :  "",
          app_acc_no: user ? user?.data?.AppAcctNo : "",
          firm_name: user ? user?.data?.FirmName :  "",
          phone: user ? user.data?.Phone : "",
          email: user ? user.data?.Email : "",
          address: user ? user.data?.Address : "",
          city: user ? user.data?.City : "",
          state: user ? user.data?.State :  "",
          zip: user ? user.data?.Zip : "",
          password: "",
        },
        enableReinitialize: true,
        // validationSchema: validationSchema,
        onSubmit: async (values) => {
          console.log("Form Data:", values);
          try {
            // const postData: any = {
            //   username: values.username,
            //   role: values?.role,
            //   email: values.email,
            //   password: values?.password,
            //   app_acc_no: values?.app_acct_no,
            //   address: values.address,
            //   city: values.city,
            //   state: values.state,
            //   zip : values.zip,
            //   full_name: values.full_name,
            //   firm_name: values.firm_name,
            //   phone: values.phone
            // };
            const postData = Object.entries(values).reduce((acc, [key, value]) => {
              if (value !== "" && value !== null && value !== undefined) {
                acc[key] = value;
              }
              return acc;
            }, {} as Record<string, any>);
            await create({ postData, id: user?.data?.UserID })
              .unwrap()
              ?.then((res) => {
                navigate('/users');
                showNotification(
                  <span className='d-flex align-items-center'>
                    <Icon icon='CheckCircle' size='lg' className='me-1' />
                    <span>Success!</span>
                  </span>,
                  res?.success,
                  'success',
                );
              });
          } catch (err: any) {
            showNotification(
              <span className='d-flex align-items-center'>
                <Icon icon='Error' size='lg' className='me-1' />
                <span>Error!</span>
              </span>,
              err?.data?.error,
              'danger',
            );
            console.log(err);
          }
        },
      });
      useEffect(() => {
        if (user?.success === 'User fetched successfully') {
          setItems(user?.data);
        }
      }, [user, items]);
      const stateOptions = states.map(({ value, text }) => ({
          value,
          label: text,
          }));

          if (userLoading) {
            return (
              <div
                style={{
                  position: "fixed",  // Ensure it covers the full viewport
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center", // Centers vertically
                  backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional: adds a subtle overlay
                  zIndex: 9999, // Ensure it stays on top
                }}
              >
                <Spinner isGrow color={"primary"} />
                <Spinner isGrow color={"primary"}/>
                <Spinner isGrow color={"primary"}/>
              </div>
            );
          }

	return (
		<Page container='fluid'>
			<div className='row h-100 align-content-start'>
				<form onSubmit={formik.handleSubmit}>
					<div className='col-md-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Person' iconColor='primary'>
									<CardTitle tag='div' className='h5'>
										User
									</CardTitle>
									<CardSubTitle tag='div' className='h6'>
										User Details
									</CardSubTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
                            <div className="row g-4">
      <div className="col-md-6">
        <FormGroup id="username" label="User Name" isFloating>
          <Input
            type="text"
            // name="username"
            {...formik.getFieldProps("username")}
            className={formik.touched.username && formik.errors.username ? "is-invalid" : ""}
          />
        </FormGroup>
        {formik.touched.username && formik.errors.username && (
          <div className="text-danger">{formik.errors.username}</div>
        )}
      </div>
      <div className="col-md-6">
        <FormGroup id="full_name" label="Full Name" isFloating>
          <Input
            type="text"
            // name="username"
            {...formik.getFieldProps("full_name")}
            className={formik.touched.full_name && formik.errors.full_name ? "is-invalid" : ""}
          />
        </FormGroup>
        {formik.touched.full_name && formik.errors.full_name && (
          <div className="text-danger">{formik.errors.full_name}</div>
        )}
      </div>

      <div className="col-md-6">
        <FormGroup id="role" label="" >
          {/* <Select
          	styles={customStyles}
            options={roleOptions}
            value={roleOptions.find((option) => option.value === formik.values.role)}
            onChange={(option) => formik.setFieldValue("role", option?.value)}
            className={formik.touched.role && formik.errors.role ? "is-invalid" : ""}
          /> */}
          <Select
													placeholder='Choose Role...'
													options={roleOptions}
                          onChange={(option: any) => formik.setFieldValue("role", option?.value)}
													onBlur={formik.handleBlur}
													value={roleOptions.find((option) => option.value === formik.values.role)}
                                                    // isValid={formik.isValid}
                                                    className={formik.touched.role && formik.errors.role ? "is-invalid" : ""}
                                                    styles={customStyles}
												/>
        </FormGroup>
        {formik.touched.role && formik.errors.role && (
          <div className="text-danger">{formik.errors.role}</div>
        )}
      </div>

      <div className="col-md-6">
        <FormGroup id="app_acc_no" label="App Acct No" isFloating>
          <Input
            type="number"
            // name="app_acc_no"
            {...formik.getFieldProps("app_acc_no")}
            className={formik.touched.app_acc_no && formik.errors.app_acc_no ? "is-invalid" : ""}
          />
        </FormGroup>
        {formik.touched.app_acc_no && formik.errors.app_acc_no && (
          <div className="text-danger">{formik.errors.app_acc_no}</div>
        )}
      </div>

      <div className="col-md-6">
        <FormGroup id="firm_name" label="Firm Name" isFloating>
          <Input
            type="text"
            // name="firm_name"
            {...formik.getFieldProps("firm_name")}
            className={formik.touched.firm_name && formik.errors.firm_name ? "is-invalid" : ""}
          />
        </FormGroup>
        {formik.touched.firm_name && formik.errors.firm_name && (
          <div className="text-danger">{formik.errors.firm_name}</div>
        )}
      </div>

      <div className="col-md-6">
        <FormGroup id="phone" label="Phone" isFloating>
          <Input
            type="number"
            // name="phone"
            {...formik.getFieldProps("phone")}
            className={formik.touched.phone && formik.errors.phone ? "is-invalid" : ""}
          />
        </FormGroup>
        {formik.touched.phone && formik.errors.phone && (
          <div className="text-danger">{formik.errors.phone}</div>
        )}
      </div>

      <div className="col-md-6">
        <FormGroup id="email" label="Email Address" isFloating>
          <Input
            type="email"
            // name="email"
            {...formik.getFieldProps("email")}
            className={formik.touched.email && formik.errors.email ? "is-invalid" : ""}
          />
        </FormGroup>
        {formik.touched.email && formik.errors.email && (
          <div className="text-danger">{formik.errors.email}</div>
        )}
      </div>

      <div className="col-md-6">
        <FormGroup id="address" label="Address" isFloating>
          <Input
            type="text"
            // name="address"
            {...formik.getFieldProps("address")}
            className={formik.touched.address && formik.errors.address ? "is-invalid" : ""}
          />
        </FormGroup>
        {formik.touched.address && formik.errors.address && (
          <div className="text-danger">{formik.errors.address}</div>
        )}
      </div>

      <div className="col-md-6">
        <FormGroup id="city" label="City" isFloating>
          <Input
            type="text"
            // name="city"
            {...formik.getFieldProps("city")}
            className={formik.touched.city && formik.errors.city ? "is-invalid" : ""}
          />
        </FormGroup>
        {formik.touched.city && formik.errors.city && (
          <div className="text-danger">{formik.errors.city}</div>
        )}
      </div>

      <div className="col-md-6">
        <FormGroup id="state" label="" >
          {/* <Select
          	styles={customStyles}
            options={stateOptions}
            value={stateOptions.find((option) => option.value === formik.values.state)}
            onChange={(option) => formik.setFieldValue("state", option?.value)}
            className={formik.touched.state && formik.errors.state ? "is-invalid" : ""}
          /> */}
           {/* <Select
													ariaLabel='State'
													placeholder='Choose...'
													list={[
														{ value: 'usa', text: 'USA' },
														{ value: 'ca', text: 'Canada' },
													]}
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        formik.setFieldValue(`state`, e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={formik.values.state}
                                                     className={formik.touched.state && formik.errors.state ? "is-invalid" : ""}
												/> */}
                         <Select
          options={stateOptions}
          placeholder="State"
          value={stateOptions.find((option) => option.value === formik.values.state)}
          onChange={(selectedOption) => formik.setFieldValue("state", selectedOption?.value)}
          onBlur={() => formik.setFieldTouched("state", true)}
		  styles={customStyles}
        />
        </FormGroup>
        {formik.touched.state && formik.errors.state && (
          <div className="text-danger">{formik.errors.state}</div>
        )}
      </div>

      <div className="col-md-6">
        <FormGroup id="zip" label="Zip Code" isFloating>
          <Input
            type="text"
            // name="zip"
            {...formik.getFieldProps("zip")}
            className={formik.touched.zip && formik.errors.zip ? "is-invalid" : ""}
          />
        </FormGroup>
        {formik.touched.zip && formik.errors.zip && (
          <div className="text-danger">{formik.errors.zip}</div>
        )}
      </div>

      <div className="col-md-6">
        <FormGroup id="password" label="Password" isFloating>
          <Input
            type="password"
            // name="password"
            {...formik.getFieldProps("password")}
            className={formik.touched.password && formik.errors.password ? "is-invalid" : ""}
          />
        </FormGroup>
        {formik.touched.password && formik.errors.password && (
          <div className="text-danger">{formik.errors.password}</div>
        )}
      </div>

      {/* <div className="col-md-6">
        <FormGroup id="confirm_password" label="Confirm Password" isFloating>
          <Input
            type="password"
            // name="confirm_password"
            {...formik.getFieldProps("confirm_password")}
            className={formik.touched.confirm_password && formik.errors.confirm_password ? "is-invalid" : ""}
          />
        </FormGroup>
        {formik.touched.confirm_password && formik.errors.confirm_password && (
          <div className="text-danger">{formik.errors.confirm_password}</div>
        )}
      </div> */}

    </div>

							</CardBody>
						</Card>
					</div>
					<div className='col-12 mt-3'></div>
				</form>
			</div>
			<div className='row'>
				<div className='col-12'>
					<Card>
						<CardBody>
							<div className='row align-items-center justify-content-end'>
								<div className='col-auto'>
									<div className='row g-1'>
										<div className='col-auto'>
                    <Button
													className='me-3'
													icon={isLoading ? undefined : 'Save'}
													color={'secondary'}
													isDisable={isLoading}
													onClick={formik.handleSubmit}>
													{isLoading && <Spinner isSmall inButton />}
													{items?.id ? 'Update' : 'Save'}
												</Button>
										</div>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</div>
			</div>
		</Page>
	);
};

export default AddUser;
