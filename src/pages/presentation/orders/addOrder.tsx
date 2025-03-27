import React, { FC, useEffect, useState } from 'react';
import { useFormik } from 'formik';
// import Select from 'react-select';
import Button from '../../../components/bootstrap/Button';
import Spinner from '../../../components/bootstrap/Spinner';
import Page from '../../../layout/Page/Page';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Select from 'react-select'
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import dayjs, { Dayjs } from 'dayjs';
import Input from '../../../components/bootstrap/forms/Input';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import Wizard, { WizardItem } from '../../../components/Wizard';
import Label from '../../../components/bootstrap/forms/Label';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
// import Select from '../../../components/bootstrap/forms/Select';
import Alert from '../../../components/bootstrap/Alert';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '../../../components/bootstrap/Modal';
import { OffCanvasTitle } from '../../../components/bootstrap/OffCanvas';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import { caseOptions, participantsType, representsOptions, states, step1Schema, step2Schema, step3Schema } from '../../../common/data/validationSchemas';
import { useCreateOrderMutation, useDeleteOrderMutation, useGetBillToQuery, useGetCaseTypeQuery, useGetCourtNameQuery, useGetParticipantsQuery, useGetSingleQuery, useGetUsersQuery } from '../../../features/users';
import getAuthTokenFromLocalStorage from '../../../utils';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { debounce } from '../../../helpers/helpers';
import useDebounce from '../../../components/useDebounce';
import SelectDropdown from '../../../components/SelectDropdown';
import { RootState } from '../../../store';
import CreatableSelect from "react-select/creatable";


// const processTypeOptions: any[] = [
//     { label: "Arranged Job (For Production Of Records)", value: "Arranged Job (For Production Of Records)" },
//     { label: "Authorization", value: "Authorization" },
//     { label: "Civil Arbitration CCP 1011 At Law Firm", value: "Civil Arbitration CCP 1011 At Law Firm" },
//     { label: "Civil Arbitration CCP 1011 At Residence", value: "Civil Arbitration CCP 1011 At Residence" },
//     { label: "Civil CCP 1011 At Law Firm", value: "Civil CCP 1011 At Law Firm" },
//     { label: "Civil CCP 1011 At Residence", value: "Civil CCP 1011 At Residence" },
//     { label: "Double Sealed To A Civil Arbitration", value: "Double Sealed To A Civil Arbitration" },
//     { label: "Double Sealed To A Federal Arbitration", value: "Double Sealed To A Federal Arbitration" },
//     { label: "Double Sealed To Court", value: "Double Sealed To Court" },
//     { label: "Entity- To Appear At A Deposition", value: "Entity- To Appear At A Deposition" },
//     { label: "Entity- To Appear With Records At A Deposition", value: "Entity- To Appear With Records At A Deposition" },
//     { label: "Federal Arbitration CCP 1011", value: "Federal Arbitration CCP 1011" },
//     { label: "Federal CCP 1011", value: "Federal CCP 1011" },
//     { label: "Index Search", value: "Index Search" },
//     { label: "Individual- To Appear At A Deposition", value: "Individual- To Appear At A Deposition" },
//     { label: "Individual- To Appear With Records At A Deposition", value: "Individual- To Appear With Records At A Deposition" },
//     { label: "Interpreter", value: "Interpreter" },
//     { label: "Notice Of Deposition For Records", value: "Notice Of Deposition For Records" },
//     { label: "Personal Appearance With Records At W.C.A.B", value: "Personal Appearance With Records At W.C.A.B" },
//     { label: "Personal Appearance At A Trial", value: "Personal Appearance At A Trial" },
//     { label: "Personal Appearance With Records At A Trial", value: "Personal Appearance With Records At A Trial" },
//     { label: "Subpoena For Records", value: "Subpoena For Records" },
//     { label: "Subpoena Double Sealed To Court", value: "Subpoena Double Sealed To Court" },
//     { label: "Subpoena For Records (a)", value: "Subpoena For Records (a)" },
//     { label: "Subpoena For Records (b)", value: "Subpoena For Records (b)" },
//     { label: "Subpoena For Records (c)", value: "Subpoena For Records (c)" },
//     { label: "Subpoena Personal Appearance AT W.C.A.B", value: "Subpoena Personal Appearance AT W.C.A.B" },
//     { label: "Subpoena To Appear At A Deposition", value: "Subpoena To Appear At A Deposition" },
//     { label: "Subpoena To Appear At A Trial", value: "Subpoena To Appear At A Trial" },
//     { label: "Subpoena To Appear With Records At A Deposition", value: "Subpoena To Appear With Records At A Deposition" },
// ];

const actionOptions: OptionType[] = [
    { label: "Prepare Subpoena - Serve - Copy", value: "Prepare Subpoena - Serve - Copy" },
    { label: "Prepare Subpoena - Serve", value: "Prepare Subpoena - Serve" },
    { label: "Prepare Subpoena - Copy", value: "Prepare Subpoena - Copy" },
    { label: "Subpoena Attached - Serve - Copy", value: "Subpoena Attached - Serve - Copy" },
    { label: "Subpoena Attached - Serve", value: "Subpoena Attached - Serve" },
    { label: "Subpoena Attached - Copy", value: "Subpoena Attached - Copy" },
    { label: "Copy", value: "Copy" }
];


const recordTypeOption: any[] = [
    { label: "ADDENDUM", value: "ADDENDUM" },
    { label: "DENTAL", value: "DENTAL" },
    { label: "EMPLOYMENT/ CIVIL", value: "EMPLOYMENT/ CIVIL" },
    { label: "HEALTH CLUB", value: "HEALTH CLUB" },
    { label: "INSURANCE/ CIVIL", value: "INSURANCE/ CIVIL" },
    { label: "ATTORNEY", value: "ATTORNEY" },
    { label: "MEDICAL/ CIVIL", value: "MEDICAL/ CIVIL" },
    { label: "PHARMACY", value: "PHARMACY" },
    { label: "PSYCHIATRIC", value: "PSYCHIATRIC" },
    { label: "SCHOLASTIC", value: "SCHOLASTIC" },
    { label: "X-RAY", value: "X-RAY" },
    { label: "BILLING", value: "BILLING" },
    { label: "MEDICAL/ W.C.", value: "MEDICAL/ W.C." },
    { label: "PARAMEDIC", value: "PARAMEDIC" },
    { label: "EMPLOYMENT/ W.C.", value: "EMPLOYMENT/ W.C." },
    { label: "INSURANCE/ W.C.", value: "INSURANCE/ W.C." },
    { label: "ATTACHMENT 3", value: "ATTACHMENT 3" },
    { label: "SCR-SANTA ANA-2", value: "SCR-SANTA ANA-2" },
    { label: "EMPLOYMENT RECORDS #1", value: "EMPLOYMENT RECORDS #1" },
    { label: "SCR MED/INVESTIGATION", value: "SCR MED/INVESTIGATION" },
    { label: "MEDICAL RECORDS #4", value: "MEDICAL RECORDS #4" },
    { label: "EMPLOYMENT RECORDS #3", value: "EMPLOYMENT RECORDS #3" },
    { label: "INSURANCE RECORDS #1", value: "INSURANCE RECORDS #1" },
    { label: "INSURANCE RECORDS AUTO", value: "INSURANCE RECORDS AUTO" },
    { label: "MEDICAL RECORDS #5", value: "MEDICAL RECORDS #5" },
    { label: "MEDICAL RECORDS #2", value: "MEDICAL RECORDS #2" },
    { label: "INSURANCE RECORDS #3", value: "INSURANCE RECORDS #3" },
    { label: "MEDICAL RECORDS #7", value: "MEDICAL RECORDS #7" },
    { label: "MEDICAL RECORDS #1", value: "MEDICAL RECORDS #1" },
    { label: "DENTAL RECORDS #1", value: "DENTAL RECORDS #1" },
    { label: "MEDICAL/INSURANCE RECORDS", value: "MEDICAL/INSURANCE RECORDS" },
    { label: "EMPLOYMENT RECORDS #2", value: "EMPLOYMENT RECORDS #2" },
    { label: "MEDICAL RECORDS-BILL-XRAYS", value: "MEDICAL RECORDS-BILL-XRAYS" },
    { label: "MEDICAL RECORDS #6", value: "MEDICAL RECORDS #6" },
    { label: "INSURANCE RECORDS #2", value: "INSURANCE RECORDS #2" },
    { label: "PHYSICAL THERAPY RECORDS", value: "PHYSICAL THERAPY RECORDS" },
    { label: "BUSINESS RECORDS", value: "BUSINESS RECORDS" },
    { label: "BILLING RECORDS #2", value: "BILLING RECORDS #2" },
    { label: "SCHOOL RECORDS", value: "SCHOOL RECORDS" },
    { label: "SHERIFF RECORDS", value: "SHERIFF RECORDS" },
    { label: "SCR-SANTA ANA-1", value: "SCR-SANTA ANA-1" },
    { label: "MEDICAL RECORDS #3", value: "MEDICAL RECORDS #3" },
    { label: "ADDITIONAL INFO NEEDED", value: "ADDITIONAL INFO NEEDED" },
    { label: "INSURANCE RECORDS - BENEFITS P", value: "INSURANCE RECORDS - BENEFITS P" },
    { label: "CORONER", value: "CORONER" },
    { label: "CAL OSHA", value: "CAL OSHA" },
    { label: "EDD", value: "EDD" },
    { label: "SECURITY / SURVEILLANCE", value: "SECURITY / SURVEILLANCE" },
    { label: "WCAB FILE", value: "WCAB FILE" },
    { label: "MATERIAL SAFETY DATA SHEETS", value: "MATERIAL SAFETY DATA SHEETS" },
    { label: "RATINGS BUREAU W/C", value: "RATINGS BUREAU W/C" },
    { label: "WCIRB REQUEST", value: "WCIRB REQUEST" },
    { label: "PAYROLL", value: "PAYROLL" },
    { label: "ORTHOPEDIC", value: "ORTHOPEDIC" },
    { label: "AUTOMOBILE INSURANCE", value: "AUTOMOBILE INSURANCE" },
    { label: "HEALTH PLAN PROVIDER", value: "HEALTH PLAN PROVIDER" },
    { label: "SPECIAL NOTICE OF LAWSUIT", value: "SPECIAL NOTICE OF LAWSUIT" },
    { label: "SKIP TRACE SEARCH", value: "SKIP TRACE SEARCH" },
    { label: "SOCIAL SECURITY RECORDS", value: "SOCIAL SECURITY RECORDS" },
];


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

interface IPreviewItemProps {
	title: string;
	value: any | any[];
}
const PreviewItem: FC<IPreviewItemProps> = ({ title, value }) => {
	return (
		<>
			<div className='col-3 text-end'>{title}</div>
			<div className='col-9 fw-bold'>{value || '-'}</div>
		</>
	);
};

// interface IValues {
// 	firstName: string;
// 	lastName: string;
// 	displayName: string;
// 	emailAddress: string;
// 	addressLine: string;
// 	phoneNumber: string;
// 	addressLine2: string;
// 	city: string;
// 	state: string;
// 	zip: string;
// 	currentPassword?: string;
// 	newPassword?: string;
// 	confirmPassword?: string;
// }
const validate = (values : any) => {
    const errors = {
        attonyName: '',
        firmName: '',
        emailAddress: '',
        phoneNumber: '',
        addressLine: '',
        addressLine2: '',
        city: '',
        state: '',
        zip: '',
    };

    if (!values.attonyName) {
        errors.attonyName = 'Attorney Name is required';
    } else if (values.attonyName.length < 3) {
        errors.attonyName = 'Must be at least 3 characters';
    } else if (values.attonyName.length > 50) {
        errors.attonyName = 'Must be 50 characters or less';
    }

    if (!values.firmName) {
        errors.firmName = 'Firm Name is required';
    } else if (values.firmName.length < 3) {
        errors.firmName = 'Must be at least 3 characters';
    } else if (values.firmName.length > 50) {
        errors.firmName = 'Must be 50 characters or less';
    }

    if (!values.emailAddress) {
        errors.emailAddress = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.emailAddress)) {
        errors.emailAddress = 'Invalid email address';
    }

    if (!values.phoneNumber) {
        errors.phoneNumber = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(values.phoneNumber)) {
        errors.phoneNumber = 'Phone Number must be 10 digits';
    }

    if (!values.addressLine) {
        errors.addressLine = 'Address Line is required';
    }

    if (!values.addressLine2) {
        errors.addressLine2 = 'Address Line 2 is required';
    }

    if (!values.city) {
        errors.city = 'City is required';
    }

    if (!values.state) {
        errors.state = 'State is required';
    }

    if (!values.zip) {
        errors.zip = 'ZIP code is required';
    } else if (!/^\d{5}$/.test(values.zip)) {
        errors.zip = 'ZIP code must be 5 digits';
    }

    return errors;
};

const AddOrder = () => {
	const location = useLocation();
  const itemId = location.state?.itemId; // Get itemId from state
	const navigate = useNavigate();
    const TABS = {
		ACCOUNT_DETAIL: 'Account Details',
		PASSWORD: 'Password',
		MY_WALLET: 'My Wallet',
	};
	const userDataStore = useSelector((state: RootState) => state.auth.user);
	
	const [activeTab, setActiveTab] = useState(TABS.ACCOUNT_DETAIL);
    const [addparticipants, setAddParticipants] = useState<boolean>(false);
   
    const [addDocuments, setAddDocuments] = useState<boolean>(false);
	const combinedSchema = step1Schema.concat(step2Schema).concat(step3Schema);
	const [createOrder, {isLoading: OrderLoading}] = useCreateOrderMutation()
	const [updateOrder, {isLoading: UpdateLoading}] = useDeleteOrderMutation()
	const id = useSelector((state: any)=> state.auth.user.id)
	const [selectedId , setSelectedId] = useState(id)
	const [caseTypeId , setCaseTypeId] = useState(null)
	const { data: userData, isLoading:userLoading  } = useGetSingleQuery(
		{ type: "user", id: selectedId },
		{ skip: !selectedId } // Prevents API call if selectedId is falsy
	  );
	const { data: procType,  } = useGetSingleQuery(
		{ type: "proctypes", id: caseTypeId },
		{ skip: !caseTypeId } // Prevents API call if selectedId is falsy
	  );
	  const shouldSkip = !userDataStore || userDataStore.role === "attorney";
	const {data:users}= useGetUsersQuery(undefined,{
		skip: shouldSkip
	})
	const {data:caseTypes}= useGetCaseTypeQuery({})
	const { data: order , isLoading, refetch: orderRefetch} = useGetSingleQuery({ type: 'order', id: itemId }, { skip: !itemId });
	const [caseParticipants , setCasePArticipants] = useState<any[]> (order?.Participants || [])
    const [documentLocationData , setdocumentLocationData] = useState <any[]>(order?.DocumentLocations || [])
	console.log(userData, "userData")


	useEffect(()=>{
		setCasePArticipants(order?.Participants)
		setdocumentLocationData(order?.DocumentLocations)
	},[order])

	const recordDetails = order?.record_details ? JSON.parse(order.record_details) : {};

	
	
	
    // const formik = useFormik({
    //     initialValues: {
    //         attonyName: userData?.data?.username || "",
    //         firmName: userData ? userData?.data?.firm_name :'',
    //         emailAddress: userData ? userData?.data?.email : '',
    //         phoneNumber: userData ? userData?.data?.phone :  '',
    //         addressLine: userData ? userData?.data?.address : '',
    //         addressLine2: '',
    //         city: userData ? userData?.data?.city :'',
    //         state: userData ? userData?.data?.state : '',
    //         zip:  userData ? userData?.data?.zip : '',
    //         urgent: false,
    //         neededBy: '',
    //         caseType: '',
    //         billTo: '',
    //         caseName: '',
    //         fileNumber: '',
    //         caseNumber: '',
    //         courtName: '',
    //         CourtAddress: '',
    //         CourtCity: "",
    //         CourtState: "",
    //         CourtZip:"",
    //         person: true,
    //         entity: false,
    //         recordTypePerson:{
    //             firstName:"",
    //             lastName:"",
    //             address:"",
    //             city:"",
    //             state:"",
    //             zip:"",
    //             SSN:"",
    //             AKA:"",
    //             dateOfInjuryFrom:"",
    //             dateOfInjuryTo:""
    //         },
    //         recordTypeEntity:{
    //             name:"",
    //             address:"",
    //             city:"",
    //             state:"",
    //             zip:"",
    //             dateOfInjuryFrom:"",
    //             dateOfInjuryTo:""
    //         },
    //         participants: [
    //             {
    //                 participant: "",
    //                 type: "",
    //                 represents: "",
    //                 phone: "",
    //                 address: "",
    //                 city: "",
    //                 state: "",
    //                 zip: "",
    //                 attorney: "",
    //                 claim: "",
    //                 adjuster: "",
    //                 note: "",
    //             },
    //         ],
    //         documentLocation:[
    //         {
    //             name:"",
    //             address:"",
    //             city:"",
    //             state:"",
    //             zip:"",
    //             process_type:"",
    //             record_type:"",
    //             action:"",
    //             note:"",
    //             review_request:false,
    //             files: null
    //         }
    //     ]
    //     },
	// 	enableReinitialize: true,
	// 	// validationSchema: combinedSchema,
    //     // validationSchema: Yup.object({
    //     //     // Step 1 Validation
    //     //     attonyName: Yup.string().required("Attorney Name is required"),
    //     //     firmName: Yup.string().required("Firm Name is required"),
    //     //     emailAddress: Yup.string().email("Invalid email").required("Email is required"),
    //     //     phoneNumber: Yup.string().required("Phone Number is required"),
    //     //     addressLine: Yup.string().required("Address Line is required"),
    //     //     city: Yup.string().required("City is required"),
    //     //     state: Yup.string().required("State is required"),
    //     //     zip: Yup.string().required("Zip is required"),

    //     //     // Step 2 Validation
    //     //     caseType: Yup.string().required("Case Type is required"),
    //     //     caseName: Yup.string().required("Case Name is required"),
    //     //     courtName: Yup.string().required("Court Name is required"),
    //     //     CourtAddress: Yup.string().required("Court Address is required"),
    //     //     CourtCity: Yup.string().required("Court City is required"),
    //     //     CourtState: Yup.string().required("Court State is required"),
    //     //     CourtZip: Yup.string().required("Court Zip is required"),

    //     //     // Step 3 Validation
    //     //     recordTypePerson: Yup.object().shape({
    //     //         firstName: Yup.string().when("person", {
    //     //             is: true,
    //     //             then: Yup.string().required("First Name is required")
    //     //         }),
    //     //         lastName: Yup.string().when("person", {
    //     //             is: true,
    //     //             then: Yup.string().required("Last Name is required")
    //     //         }),
    //     //         SSN: Yup.string().when("person", {
    //     //             is: true,
    //     //             then: Yup.string().required("SSN is required")
    //     //         })
    //     //     }),
    //     //     recordTypeEntity: Yup.object().shape({
    //     //         name: Yup.string().when("entity", {
    //     //             is: true,
    //     //             then: Yup.string().required("Entity Name is required")
    //     //         })
    //     //     })
    //     // }),
    //     onSubmit: async (values) => {
	// 		try {
	// 			const postData: any = {
	// 				order_by: 2,
	// 				urgent: values?.urgent,
	// 				needed_by: values.neededBy,
	// 				case_type: values.caseType,
	// 				case_name: values.caseName,
	// 				file_number: values.fileNumber,
	// 				case_number: values.caseNumber,
	// 				court_name: values.courtName,
	// 				court_address: values.CourtAddress,
	// 				court_city: values.CourtCity,
	// 				court_state: values.CourtState,
	// 				court_zip: values.CourtZip,
	// 				record_details:{
	// 					record_type: values.person ? "Person" : values.entity ? "Entity" : "Person",
	// 					first_name : values.recordTypePerson.firstName,
	// 					last_name: values.recordTypePerson.lastName,
	// 					aka: values.recordTypePerson.AKA,
	// 					ssn: values.recordTypePerson.SSN,
	// 					date_of_injury: {
	// 						from: values.recordTypePerson.dateOfInjuryFrom,
	// 						to: values.recordTypePerson.dateOfInjuryTo
	// 					},
	// 					record_address: values.recordTypePerson.address,
	// 					record_city: values.recordTypePerson.city,
	// 					record_state: values.recordTypePerson.state,
	// 					record_zip: values.recordTypePerson.zip
	// 				},
	// 				bill_to: values.billTo,
	// 				participants: values.participants,
	// 				document_locations: values.documentLocation,
	// 			};
	// 			console.log(postData, "postData")
	// 			await createOrder(postData)
	// 			  .unwrap()
	// 			  ?.then((res) => {
	// 				navigate('/order');
	// 				showNotification(
	// 				  <span className='d-flex align-items-center'>
	// 					<Icon icon='CheckCircle' size='lg' className='me-1' />
	// 					<span>Success!</span>
	// 				  </span>,
	// 				  "Order has been created successfully",
	// 				  'success',
	// 				);
	// 			  });
	// 		  } catch (err: any) {
	// 			showNotification(
	// 			  <span className='d-flex align-items-center'>
	// 				<Icon icon='Error' size='lg' className='me-1' />
	// 				<span>Error!</span>
	// 			  </span>,
	// 			  err?.data?.error,
	// 			  'danger',
	// 			);
	// 			console.log(err);
	// 		  }
			
    //     },
    // });

	console.log(recordDetails , "recordDetails")
	const formik = useFormik({
		initialValues: {
			orderBy: order?.orderByUser?.id || null,
			attonyName:   order?.orderByUser
			? { value: order.orderByUser?.username, label: order.orderByUser?.username }: userData?.data?.username
			? { value: userData.data.username, label: userData.data.username } :  "",
			firmName: order?.orderByUser?.firm_name || userData?.data?.firm_name   || '',
			emailAddress: userData?.data?.email || order?.orderByUser?.email || '',
			phoneNumber: userData?.data?.phone || order?.orderByUser?.phone || '',
			addressLine: userData?.data?.address || order?.orderByUser?.address || '',
			addressLine2: order?.orderByUser?.addressLine2 || '',
			city: userData?.data?.city || order?.orderByUser?.city || '',
			state: userData?.data?.state || order?.orderByUser?.state || '',
			zip: userData?.data?.zip || order?.orderByUser?.zip || '',
			urgent: order?.urgent || false,
			neededBy: order?.needed_by ? dayjs(order?.needed_by).format("YYYY-MM-DD") :  null,
			caseType: order?.case_type || '',
			billTo: order?.bill_to ? { value: order.bill_to, label: order.bill_to }
        : "",
			caseName: order?.case_name || '',
			fileNumber: order?.file_number || '',
			caseNumber: order?.case_number || '',
			courtName: order?.court_name 
        ? { value: order.court_name, label: order.court_name } 
        : "",  
			CourtAddress: order?.court_address || '',
			CourtCity: order?.court_city || "",
			CourtState: order?.court_state || "",
			CourtZip: order?.court_zip || "",
			person: order?.record_details?.record_type === "Person" || recordDetails.record_type == "Person",
			entity: order?.record_details?.record_type === "Entity" || recordDetails.record_type == "Entity",
			recordTypePerson: {
				firstName: order?.record_details?.first_name ||  recordDetails?.first_name ||  "",
				lastName: order?.record_details?.last_name || recordDetails?.last_name || "",
				address: order?.record_details?.record_address ||  recordDetails?.record_address ||"",
				city: order?.record_details?.record_city || recordDetails?.record_city || "",
				state: order?.record_details?.record_state || recordDetails?.record_state || "",
				zip: order?.record_details?.record_zip || recordDetails?.record_zip ||  "",
				SSN: order?.record_details?.ssn || recordDetails?.ssn || "",
				AKA: order?.record_details?.aka || recordDetails?.aka || "",
				dateOfInjuryFrom: order?.record_details?.date_of_injury?.from || dayjs(recordDetails?.date_of_injury?.from).format("YYYY-MM-DD")   ||  "",
				dateOfInjuryTo: order?.record_details?.date_of_injury?.to || dayjs(recordDetails?.date_of_injury?.to).format("YYYY-MM-DD") || "",
			},
			recordTypeEntity: {
				name: order?.record_details?.name || "",
				address: order?.record_details?.address || "",
				city: order?.record_details?.city || "",
				state: order?.record_details?.state || "",
				zip: order?.record_details?.zip || recordDetails?.record_zip || "",
				dateOfInjuryFrom: order?.record_details?.date_of_injury?.from || "",
				dateOfInjuryTo: order?.record_details?.date_of_injury?.to || "",
				continuous_trauma : recordDetails?.continuous_trauma || false
			},
			participants: order?.Participants?.length > 0 
			? order?.Participants?.map((p) => ({
				participant: { value: p.participant, label: p.participant } || "",
				type: p.type || "",
				represents: p.represents || "",
				phone: p.phone || "",
				address: p.address || "",
				city: p.city || "",
				state: p.state || "",
				zip: p.zip || "",
				attorney: p.attorney || "",
				claim: p.claim || "",
				adjuster: p.adjuster || "",
				note: p.note || "",
			}))
			: [
				{
					participant: "",
					type: "",
					represents: "",
					phone: "",
					address: "",
					city: "",
					state: "",
					zip: "",
					attorney: "",
					claim: "",
					adjuster: "",
					note: "",
				},
			],
			documentLocation: order?.DocumentLocations?.length > 0
  ? order?.DocumentLocations?.map((d) => ({
      name:{ value: d.name, label: d.name } || "",
      address: d.address || "",
      city: d.city || "",
      state: d.state || "",
      zip: d.zip || "",
      process_type: d.process_type || "",
      record_type: d.record_type || "",
      action: d.action || "",
      note: d.note || "",
      review_request: d.review_request ?? false, // Ensuring boolean value
      files: Array.isArray(d.files) ? d.files : [], // Ensuring an array
    }))
  : [
      {
        name: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        process_type: "",
        record_type: "",
        action: "",
        note: "",
        review_request: false,
        files: [],
      },
    ],

		},
		enableReinitialize: true,
		onSubmit: async (values) => {
			// try {
			// 	const formattedParticipants = values.participants.map(p => ({
			// 		...p,
			// 		participant: p.participant?.value || "", // Ensure it's a string
			// 	}));
			// 	const formattedDocumentLocation = values.documentLocation.map(p => ({
			// 		...p,
			// 		name: p.name?.value || "", // Ensure it's a string
			// 	}));
			// 	const postData = {
			// 		order_by: selectedId,
			// 		urgent: values.urgent,
			// 		needed_by: values.neededBy,
			// 		case_type: values.caseType,
			// 		case_name: values.caseName,
			// 		file_number: values.fileNumber,
			// 		case_number: values.caseNumber,
			// 		court_name: values.courtName.value,
			// 		court_address: values.CourtAddress,
			// 		court_city: values.CourtCity,
			// 		court_state: values.CourtState,
			// 		court_zip: values.CourtZip,
			// 		record_details: {
			// 			record_type: values.person ? "Person" : values.entity ? "Entity" : "Person",
			// 			first_name: values.recordTypePerson.firstName,
			// 			last_name: values.recordTypePerson.lastName,
			// 			aka: values.recordTypePerson.AKA,
			// 			ssn: values.recordTypePerson.SSN,
			// 			date_of_injury: {
			// 				from: values.recordTypePerson.dateOfInjuryFrom,
			// 				to: values.recordTypePerson.dateOfInjuryTo
			// 			},
			// 			record_address: values.recordTypePerson.address,
			// 			record_city: values.recordTypePerson.city,
			// 			record_state: values.recordTypePerson.state,
			// 			record_zip: values.recordTypePerson.zip
			// 		},
			// 		bill_to: values.billTo?.value,
			// 		participants: formattedParticipants,
			// 		document_locations: formattedDocumentLocation,
			// 	};
	
			// 	console.log(postData, "postData");
	
			// 	if (itemId) {
			// 		// Update order if itemId exists
			// 		await updateOrder({ id: itemId, postData: postData })
			// 			.unwrap()
			// 			?.then(() => {
			// 				navigate('/order');
			// 				orderRefetch()
			// 				showNotification(
			// 					<span className='d-flex align-items-center'>
			// 						<Icon icon='CheckCircle' size='lg' className='me-1' />
			// 						<span>Updated Successfully</span>
			// 					</span>,
			// 					"Order has been updated successfully",
			// 					'success',
			// 				);
			// 			});
			// 	} 
			// 	else {
			// 		// Create new order
			// 		const response = await createOrder(postData).unwrap();
            // console.log("Create Order Response:", response);
            // navigate('/order');
            // orderRefetch();
            // showNotification(
            //     <span className='d-flex align-items-center'>
            //         <Icon icon='CheckCircle' size='lg' className='me-1' />
            //         <span>Success!</span>
            //     </span>,
            //     "Order has been created successfully",
            //     'success'
            // );
			// 	}
			// } catch (err) {
			// 	showNotification(
			// 		<span className='d-flex align-items-center'>
			// 			<Icon icon='Error' size='lg' className='me-1' />
			// 			<span>Error!</span>
			// 		</span>,
			// 		err?.data?.error,
			// 		'danger',
			// 	);
			// 	console.log(err);
			// }

			try {
				const formattedParticipants = values.participants.map(p => ({
					...p,
					participant: p.participant?.value || "", // Ensure it's a string
				}));
			
				const formattedDocumentLocation = values.documentLocation.map(p => ({
					...p,
					name: p.name?.value || "", // Ensure it's a string
				}));
			
				const postData = {
					order_by: selectedId,
					urgent: values.urgent,
					needed_by: values.neededBy,
					case_type: values.caseType,
					case_name: values.caseName,
					file_number: values.fileNumber,
					case_number: values.caseNumber,
					court_name: values.courtName?.value || "",
					court_address: values.CourtAddress || "",
					court_city: values.CourtCity || "",
					court_state: values.CourtState || "",
					court_zip: values.CourtZip || "",
					record_details: {
						record_type: values.person ? "Person" : values.entity ? "Entity" : "Person",
						first_name: values.recordTypePerson?.firstName || "",
						last_name: values.recordTypePerson?.lastName || "",
						aka: values.recordTypePerson?.AKA || "",
						ssn: values.recordTypePerson?.SSN || "",
						date_of_injury: {
							from: values.recordTypePerson?.dateOfInjuryFrom || "",
							to: values.recordTypePerson?.dateOfInjuryTo || "",
						},
						record_address: values.recordTypePerson?.address || "",
						record_city: values.recordTypePerson?.city || "",
						record_state: values.recordTypePerson?.state || "",
						record_zip: values.recordTypePerson?.zip || "",
						continuous_trauma : values?.continuous_trauma
					},
					bill_to: values.billTo?.value || "",
					participants: formattedParticipants,
					document_locations: formattedDocumentLocation,
				};
			
				console.log("postData:", postData);
			
				if (itemId) {
					// Update order if itemId exists
					try {
						const response = await updateOrder({ id: itemId, postData }).unwrap();
						console.log("Update Order Response:", response);
						navigate('/order');
						orderRefetch();
						showNotification(
							<span className='d-flex align-items-center'>
								<Icon icon='CheckCircle' size='lg' className='me-1' />
								<span>Updated Successfully</span>
							</span>,
							"Order has been updated successfully",
							'success'
						);
					} catch (err) {
						console.error("Update Order Error:", err);
						showNotification(
							<span className='d-flex align-items-center'>
								<Icon icon='Error' size='lg' className='me-1' />
								<span>Error!</span>
							</span>,
							err?.data?.error || "An error occurred while updating the order.",
							'danger'
						);
					}
				} else {
					// Create new order
					try {
						const response = await createOrder(postData).unwrap();
						console.log("Create Order Response:", response);
						navigate('/order');
						// orderRefetch();
						showNotification(
							<span className='d-flex align-items-center'>
								<Icon icon='CheckCircle' size='lg' className='me-1' />
								<span>Success!</span>
							</span>,
							"Order has been created successfully",
							'success'
						);
					} 
					catch (err) {
						console.error("Create Order Error:", err);
						
						showNotification(
							<span className='d-flex align-items-center'>
								<Icon icon='Error' size='lg' className='me-1' />
								<span>Error!</span>
							</span>,
							err?.data?.error || "An error occurred while creating the order.",
							'danger'
						);
					}
				}
			} catch (err) {
				console.error("Unexpected Error:", err);
				showNotification(
					<span className='d-flex align-items-center'>
						<Icon icon='Error' size='lg' className='me-1' />
						<span>Error!</span>
					</span>,
					err?.data?.error,
					'danger'
				);
			}
			
		},
	});

	
    const addParticipant = () => {
        formik.setFieldValue("participants", [
            ...formik.values.participants,
            {
                participant: "",
                type: "",
                represents: "",
                phone: "",
                address: "",
                city: "",
                state: "",
                zip: "",
                attorney: "",
                claim: "",
                adjuster: "",
                note: "",
            },
        ]);
    };
    const addDocumentLocation = () => {
        formik.setFieldValue("documentLocation", [
            ...formik.values.documentLocation,
            {
                name:"",
                address:"",
                city:"",
                state:"",
                zip:"",
                process_type:"",
                record_type:"",
                action:"",
                note:"",
                review_request:false,
                files: null
            }
        ]);
    };

    const removeParticipant = (index: number) => {
        const updatedParticipants = [...formik.values.participants];
        updatedParticipants.splice(index, 1);
        formik.setFieldValue("participants", updatedParticipants);
        setCasePArticipants(updatedParticipants)
    };
    const removeDocumentLocation = (index: number) => {
        const updatedParticipants = [...formik.values.documentLocation];
        updatedParticipants.splice(index, 1);
        formik.setFieldValue("documentLocation", updatedParticipants);
        setdocumentLocationData(updatedParticipants)
    };
 const [loading , setLoading] = useState({})
 const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
	// const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
	// 	if (event.target.files) {
	// 		const filesArray = Array.from(event.target.files);
	// 		if (filesArray.length === 0) return;
	// 		setLoading(true); // Start loading
	// 		// setUploadingIndex(null); // Reset the uploading index
	// 		const formData = new FormData();
	// 		filesArray.forEach((file) => {
	// 			formData.append('files', file); // Ensure API supports multiple files
	// 		});

	// 		console.log('📂 Files selected:', filesArray);
	// 		console.log('📤 FormData before upload:', formData);

	// 		try {
	// 			// Replace with your actual API endpoint
	// 			const response = await axios.post(
	// 				'http://localhost:3000/api/upload',
	// 				formData,
	// 				{
	// 					headers: {
	// 						'Content-Type': 'multipart/form-data',
	// 						Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`, // Attach the token
	// 					},
	// 				},
	// 			);

	// 			console.log('✅ Upload response:', response.data);

	// 			if (response.data?.files && Array.isArray(response.data.files)) {
	// 				const uploadedFiles = response.data.files.map(
	// 					(file: { path: string }) =>
	// 						`https://api-petromin.thesymmetry.net/api/${file.path}`,
	// 				);
	// 				uploadedFiles.forEach((_: any, idx: number) => {
	// 					setUploadingIndex(idx);
	// 					setTimeout(() => setUploadingIndex(null), 2000); // Simulate 2-sec delay
	// 				});

	// 				console.log('🖼️ Processed uploaded files:', uploadedFiles);

	// 				// Update Formik with the new file URLs
	// 				formik.setFieldValue(`documentLocation[${index}].files`, [
	// 					...(formik.values.documentLocation.files || []),
	// 					...uploadedFiles,
	// 				]);

	// 				// Reset file input
	// 				event.target.value = '';
	// 			}
	// 		} catch (error) {
	// 			console.error('❌ File upload failed:', error);
	// 		} finally {
	// 			setLoading(false); // Stop loading
	// 		}
	// 	}
	// };
	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
		index: number
	  ) => {
		if (event.target.files) {
		  const filesArray = Array.from(event.target.files);
		  if (filesArray.length === 0) return;
	  
		  setLoading((prev) => ({ ...prev, [index]: true }));
	  
		  const formData = new FormData();
		  filesArray.forEach((file) => {
			formData.append("files", file);
		  });
	  
		  console.log("📂 Files selected:", filesArray);
		  console.log("📤 FormData before upload:", formData);
	  
		  try {
			const response = await axios.post(
			  "https://casemanagement.medbillcollections.net/api/upload",
			  formData,
			  {
				headers: {
				  "Content-Type": "multipart/form-data",
				  Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
				},
			  }
			);
	  
			console.log("✅ Upload response:", response.data);
	  
			if (response.data?.files && Array.isArray(response.data.files)) {
			  const uploadedFiles = response.data.files.map(
				(file: { path: string }) =>
				  `https://casemanagement.medbillcollections.net/api/${file.path}`
			  );
	  
			  console.log("🖼️ Processed uploaded files:", uploadedFiles);
	  
			  // Ensure we maintain existing files in the array
			  formik.setFieldValue(`documentLocation[${index}].files`, [
				...(formik.values.documentLocation[index].files || []),
				...uploadedFiles,
			  ]);
	  
			  // Reset file input
			  event.target.value = "";
			}
		  } catch (error) {
			console.error("❌ File upload failed:", error);
		  } finally {
			setLoading((prev) => ({ ...prev, [index]: false })); 
		  }
		}
	  };
	  const stateOptions = states?.map(({ value, text }) => ({
		value,
		label: text,
	  }));

	  const userOptions =
  userDataStore.role === "attorney"
    ? userData?.data
      ? [{ value: userData.data.username, label: userData.data.username }]
      : []
    : users?.data?.map((user: any) => ({
        value: user.id,
        label: user.username,
      })) || [];


	  console.log(userOptions.find((option: any) => option.value === formik.values.attonyName))
	  
	  
	// const removeImage = (index: number) => {
	// 	const updatedFiles = formik?.values?.attachment?.filter((_: any, i: number) => i !== index);
	// 	// setSelectedFiles(updatedFiles);
	// 	formik.setFieldValue('attachment', updatedFiles);
	// };


	const [debouncedBillTo, setDebouncedBillTo] = useState(formik.values.billTo);
	const [debouncedParticipant, setDebouncedParticipant] = useState("");
const debouncedSearchParticipant = useDebounce(debouncedParticipant, 200);
	const [debouncedCourtName, setDebouncedCourtName] = useState(formik.values.courtName);
	const debouncedSearchTermAudience = useDebounce(debouncedBillTo, 200);

	console.log(formik.values.courtName, "cort")

	const debouncedSearchCourtName = useDebounce(debouncedCourtName, 200);

    // Fetch data with debounced input value
    const { data: courtData, isFetching } = useGetCourtNameQuery(debouncedSearchCourtName, {
        skip: !debouncedSearchCourtName, // Skip query if input is empty
    });

    // Transform API data into Select options
    const courtOptions = Array.isArray(courtData?.data)
    ? courtData?.data?.map((court: any) => ({
          value: court.location.locat_name,
          label: `${court.location.locat_name}
		  , ${court.location.locat_city}, ${court.location.locat_state} ${court.location.locat_zip}`,
          address: court.location.locat_address,
          city: court.location.locat_city,
          state: court.location.locat_state,
          zip: court.location.locat_zip,
      }))
    : [];

		console.log(courtOptions)

    // Fetch data with debounced input value
    const { data:customerData, isLoading:customerLoading } = useGetBillToQuery(debouncedSearchTermAudience, {
        skip: !debouncedSearchTermAudience, // Skip query if debouncedBillTo is empty
    });
    const { data:ParticipantsData } = useGetParticipantsQuery(debouncedSearchParticipant, {
        skip: !debouncedSearchParticipant, // Skip query if debouncedBillTo is empty
    });
	const optionsCustomer = Array.isArray(customerData?.data) 
    ? customerData?.data?.map((item: any) => ({
        value: item?.location?.locat_name,
        label: item?.location?.locat_name || 'Unknown',
    })) 
    : [];
	const optionsCaseType = Array.isArray(caseTypes?.data) 
    ? caseTypes?.data?.map((item: any) => ({
        value: item?.casetypeid,
        label: item?.casename || 'Unknown',
    })) 
    : [];
	const processTypeOptions = Array.isArray(procType?.data) 
    ? procType?.data?.map((item: any) => ({
        value: item?.processid,
        label: item?.procname || 'Unknown',
    })) 
    : [];
	const optionsParticipants = Array.isArray(ParticipantsData?.data) 
    ? ParticipantsData?.data?.map((item: any) => ({
        value: item?.locat_name,
        label: item?.locat_name || 'Unknown',
		address: item.locat_address,
      city: item.locat_city,
      state: item.locat_state,
      zip: item.locat_zip,
    })) 
    : [];

	const caseNameId = optionsCaseType.find(option => option.label === formik.values.caseType)
	console.log(caseNameId, "ParticipantsData")
	useEffect(()=>{
		setCaseTypeId(caseNameId?.value)
	   },[caseTypeId])
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
				
						
                            <div className='col-lg-12 col-md-6'>
						{TABS.ACCOUNT_DETAIL === activeTab && (
							<Wizard
								isHeader
								formik={formik}
								color='info'
								OrderLoading={OrderLoading || UpdateLoading}
								noValidate
								onSubmit={formik.handleSubmit}
								className=''>
								<WizardItem id='step1' title='Order By' >
									

									<Card shadow={"none"}>
									
										<CardBody className='pt-0'>
											<div className='row g-4'>
												<div className='col-md-6'>
                                                {/* <FormGroup id='attonyName' label='Attony Name' isFloating>
												<Select
													ariaLabel=''
													placeholder='Choose...'
													list={[
														{ value: 'usa', text: 'USA' },
														{ value: 'ca', text: 'Canada' },
													]}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.attonyName}
													isValid={formik.isValid}
													isTouched={formik.touched.attonyName}
													invalidFeedback={formik.errors.attonyName}
												/>
											</FormGroup> */}
								<FormGroup id="attonyName" label="">
  <Select
    options={userOptions} // List of options [{ value: "1", label: "John Doe" }]
    placeholder="Attorney Name"
    value={formik.values.attonyName || null}
    onChange={(selectedOption) => {
      setSelectedId(selectedOption?.value);
      formik.setFieldValue("attonyName", selectedOption); // Store full object
      formik.setFieldValue("orderBy", selectedOption?.value);
    }}
    styles={customStyles}
  />
</FormGroup>


											{/* <FormGroup id='attonyName' label='Attorney Name' isFloating>
    <Input
        type="text"
        placeholder="Attorney Name"
        value={formik.values.attonyName} // Shows the username
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isValid={formik.isValid}
        isTouched={formik.touched.attonyName}
        invalidFeedback={formik.errors.attonyName}
        readOnly // Prevents user from editing
    />
</FormGroup> */}
												</div>
												<div className='col-md-6'>
													<FormGroup
														id='firmName'
														label='Firm Name'
														isFloating>
														<Input
															placeholder='Last Name'
															autoComplete='firm-name'
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.firmName}
															isValid={formik.isValid}
															isTouched={formik.touched.firmName}
															invalidFeedback={formik.errors.firmName}
															validFeedback='Looks good!'
														/>
													</FormGroup>
												</div>
												<div className='col-6'>
													<FormGroup
														id='emailAddress'
														label='Email address'
														isFloating>
														<Input
															type='email'
															placeholder='Email address'
															autoComplete='email'
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.emailAddress}
															isValid={formik.isValid}
															isTouched={formik.touched.emailAddress}
															invalidFeedback={
																formik.errors.emailAddress
															}
															validFeedback='Looks good!'
														/>
													</FormGroup>
												</div>
											
												<div className='col-6'>
													<FormGroup
														id='phoneNumber'
														label='Phone Number'
														isFloating>
														<Input
															placeholder='Phone Number'
															type='tel'
															autoComplete='tel'
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.phoneNumber}
															isValid={formik.isValid}
															isTouched={formik.touched.phoneNumber}
															invalidFeedback={
																formik.errors.phoneNumber
															}
															validFeedback='Looks good!'
														/>
													</FormGroup>
												</div>
												
											
								
										<div className='col-lg-12'>
											<FormGroup
												id='addressLine'
												label='Address Line'
												isFloating>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.addressLine}
													isValid={formik.isValid}
													isTouched={formik.touched.addressLine}
													invalidFeedback={formik.errors.addressLine}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>

										<div className='col-lg-6'>
											<FormGroup id='city' label='City' isFloating>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.city}
													isValid={formik.isValid}
													isTouched={formik.touched.city}
													invalidFeedback={formik.errors.city}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
										<div className='col-md-3'>
										{/* <FormGroup id="state" label="State" isFloating>
										<Select
    ariaLabel="State"
    placeholder="Choose..."
    list={states}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    value={formik.values.state || ''} // Ensure it's always defined
    isValid={formik.isValid}
    isTouched={formik.touched.state}
    invalidFeedback={formik.errors.state}
/>

</FormGroup> */}
<FormGroup id="state" label="" >
        <Select
          options={stateOptions}
          placeholder="Choose..."
          value={stateOptions.find((option) => option.value === formik.values.state) || {label:formik.values.state, value: formik.values.state }}
          onChange={(selectedOption) => formik.setFieldValue("state", selectedOption?.value)}
          onBlur={() => formik.setFieldTouched("state", true)}
		  styles={customStyles}
        />
        {/* {formik.touched.state && formik.errors.state && (
          <div className="invalid-feedback">{formik.errors.state}</div>
        )} */}
      </FormGroup>

										</div>
										<div className='col-md-3'>
											<FormGroup id='zip' label='Zip' isFloating>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.zip}
													isValid={formik.isValid}
													isTouched={formik.touched.zip}
													invalidFeedback={formik.errors.zip}
												/>
											</FormGroup>
										</div>
								
                                    
                                    </div>
										</CardBody>
									</Card>
                                    </WizardItem>
								<WizardItem id='step2' title='Case Details'>
									

									<Card shadow={"none"}>
										
										<CardBody className='pt-0'>
											<div className='row g-4'>
												<div className='col-md-6'>
                                                <FormGroup id='urgent' label='' isFloating>
												<Checks
															type='switch'
															key={"urgent"}
															id={`urgent`}
															name='urgent'
															label={"urgent"}
															onChange={formik.handleChange}
															checked={formik.values.urgent}
														/>
											</FormGroup>
												</div>
												<div className='col-md-6'>
													<FormGroup
														id='neededBy'
														label='Needed On'
														isFloating>
														<Input
															type='date'
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.neededBy}
															isValid={formik.isValid}
															isTouched={formik.touched.neededBy}
															invalidFeedback={formik.errors.neededBy}
															validFeedback='Looks good!'
                                                            disabled={!formik.values.urgent}
														/>
													</FormGroup>
												</div>
												<div className='col-6'>
													<FormGroup
														id='caseType'
														label=''
														
														>
														{/* <Select
													ariaLabel=''
													placeholder='Choose...'
													list={[
														{ value: 'usa', text: 'USA' },
														{ value: 'ca', text: 'Canada' },
													]}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.caseType}
													isValid={formik.isValid}
													isTouched={formik.touched.caseType}
													invalidFeedback={formik.errors.caseType}
												/> */}
										<Select
  options={optionsCaseType}
  placeholder="Select a Case Type"
  value={
    formik.values.caseType
      ? optionsCaseType.find(option => option.label === formik.values.caseType) || 
        { label: formik.values.caseType, value: formik.values.caseType }
      : null // Ensure placeholder appears when no value is selected
  }
  onChange={(selectedOption) => {
	setCaseTypeId(selectedOption?.value)
	formik.setFieldValue("caseType", selectedOption?.label)}}
  onBlur={() => formik.setFieldTouched("caseType", true)}
  styles={customStyles} // Optional: Apply custom styles
/>

													</FormGroup>
												</div>
											
												
														<div className='col-6'>
            <FormGroup id='billTo' >
                {/* <Select
				isClearable
                    placeholder='Select Bill To...'
                    options={optionsCustomer}
                    onInputChange={(value) => setDebouncedBillTo(value)}
                    onChange={(option) => formik.setFieldValue('billTo', option?.value)}
                    onBlur={formik.handleBlur}
                    value={optionsCustomer.find(option => option.value === formik.values.billTo)}
                    isLoading={customerLoading}
                    noOptionsMessage={() => 'No options available'}
                    className={formik.touched.billTo && formik.errors.billTo ? 'is-invalid' : ''}
					styles={customStyles}
					defaultInputValue={formik.values.billTo ? [formik.values.billTo] : []} 
                /> */}
				<Select
    isClearable
    placeholder='Select Bill To...'
    options={optionsCustomer}
    onInputChange={(value) => setDebouncedBillTo(value)}
    onChange={(option) => formik.setFieldValue('billTo', option)} // Store full object
    onBlur={formik.handleBlur}
    value={formik.values.billTo} // Directly use the stored object
    isLoading={customerLoading}
    noOptionsMessage={() => 'No options available'}
    className={formik.touched.billTo && formik.errors.billTo ? 'is-invalid' : ''}
    styles={customStyles}
/>

                {/* {formik.touched.billTo && formik.errors.billTo && (
                    <div className="invalid-feedback">{formik.errors.billTo}</div>
                )} */}
            </FormGroup>
        </div>
														
													
												
											
								
										<div className='col-lg-6'>
											<FormGroup
												id='caseName'
												label='Case Name'
												isFloating>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.caseName}
													isValid={formik.isValid}
													isTouched={formik.touched.caseName}
													invalidFeedback={formik.errors.caseName}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
										<div className='col-lg-6'>
											<FormGroup
												id='fileNumber'
												label='File Number'
												isFloating>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.fileNumber}
													isValid={formik.isValid}
													isTouched={formik.touched.fileNumber}
													invalidFeedback={formik.errors.fileNumber}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>

										<div className='col-lg-6'>
											<FormGroup id='caseNumber' label='CaseNumber' isFloating>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.caseNumber}
													isValid={formik.isValid}
													isTouched={formik.touched.caseNumber}
													invalidFeedback={formik.errors.caseNumber}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
										{/* <div className='col-lg-6'>
											<FormGroup id='courtName' label='Court Name' isFloating>
                                            <Input
                                            type='search'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.courtName}
													isValid={formik.isValid}
													isTouched={formik.touched.courtName}
													invalidFeedback={formik.errors.courtName}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div> */}
												<div className='col-6'>
            <FormGroup id='courtName' >
			{/* <Select
    placeholder="Select Court Name..."
    options={courtOptions}
    isClearable
    onInputChange={(value) => setDebouncedCourtName(value)}
    onChange={(option) => {
        formik.setFieldValue("courtName", option?.value);
        formik.setFieldValue("CourtAddress", option?.address || "");
        formik.setFieldValue("CourtCity", option?.city || "");
        formik.setFieldValue("CourtState", option?.state || "");
        formik.setFieldValue("CourtZip", option?.zip || "");
       
    }}
    onBlur={formik.handleBlur}
    value={courtOptions.find((option) => option.value === formik.values.courtName) || null}
	// value={formik.values.courtName}
    isLoading={isFetching}
    noOptionsMessage={() => "No options available"}
    styles={customStyles}
/> */}
<CreatableSelect
    placeholder="Select Court Name..."
    options={courtOptions}
    isClearable
    onInputChange={(value) => setDebouncedCourtName(value)}
    onChange={(option) => {
        formik.setFieldValue("courtName", option);
        formik.setFieldValue("CourtAddress", option?.address || "");
        formik.setFieldValue("CourtCity", option?.city || "");
        formik.setFieldValue("CourtState", option?.state || "");
        formik.setFieldValue("CourtZip", option?.zip || "");
    }}
    onBlur={formik.handleBlur}
    value={formik.values.courtName || null} // Ensure it's an object or null
    isLoading={isFetching}
    noOptionsMessage={() => "No options available"}
    styles={customStyles}
/>


                {/* {formik.touched.billTo && formik.errors.billTo && (
                    <div className="invalid-feedback">{formik.errors.billTo}</div>
                )} */}
            </FormGroup>
        </div>
                                        <div className='col-lg-12'>
											<FormGroup
												id='CourtAddress'
												label='Court Address'
												isFloating>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.CourtAddress}
													isValid={formik.isValid}
													isTouched={formik.touched.CourtAddress}
													invalidFeedback={formik.errors.CourtAddress}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>

										<div className='col-lg-6'>
											<FormGroup id='CourtCity' label='Court City' isFloating>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.CourtCity}
													isValid={formik.isValid}
													isTouched={formik.touched.CourtCity}
													invalidFeedback={formik.errors.CourtCity}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
										<div className='col-md-3'>
											<FormGroup id='CourtState' label='' >
												{/* <Select
													ariaLabel='State'
													placeholder='Choose...'
													list={states}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.CourtState}
													isValid={formik.isValid}
													isTouched={formik.touched.CourtState}
													invalidFeedback={formik.errors.CourtState}
												/> */}
												 <Select
          options={stateOptions}
          placeholder="Court State"
          value={
			formik.values.CourtState
			  ? stateOptions.find((option) => option.value === formik.values.CourtState) || 
				{ label: formik.values.CourtState, value: formik.values.CourtState }
			  : null // Ensure placeholder appears when no value is selected
		  }
          onChange={(selectedOption) => formik.setFieldValue("CourtState", selectedOption?.value)}
          onBlur={() => formik.setFieldTouched("state", true)}
		  styles={customStyles}
        />
											</FormGroup>
										</div>
										<div className='col-md-3'>
											<FormGroup id='CourtZip' label='Court Zip' isFloating>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.CourtZip}
													isValid={formik.isValid}
													isTouched={formik.touched.CourtZip}
													invalidFeedback={formik.errors.CourtZip}
												/>
											</FormGroup>
										</div>
                                        <div className='col-md-6'>
                                                <FormGroup id='person' label='' isFloating>
												<Checks
															type='switch'
															key={"person"}
															id={`person`}
															name='person'
															label={"Person"}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                formik.setValues({
                                                                    ...formik.values,
                                                                    entity: !e.target.checked,
                                                                    person: e.target.checked, // Ensure "person" is false when "entity" is true
                                                                });
                                                            }}
															checked={formik.values.person}
														/>
											</FormGroup>
												</div>
                                                <div className='col-md-6'>
                                                <FormGroup id='entity' label='' isFloating>
												<Checks
															type='switch'
															key={"entity"}
															id={`entity`}
															name='entity'
															label={"Entity"}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                formik.setValues({
                                                                    ...formik.values,
                                                                    entity: e.target.checked,
                                                                    person: !e.target.checked, // Ensure "person" is false when "entity" is true
                                                                });
                                                            }}
															checked={formik.values.entity}
														/>
											</FormGroup>
												</div>
                                                {formik?.values?.person ? 
                                                <>
                                                <div className='col-lg-6'>
											<FormGroup id='recordTypePerson.firstName' label='First Name' isFloating>
                                            <Input
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                formik.setFieldValue("recordTypePerson.firstName", e.target.value)
                                            }
													onBlur={formik.handleBlur}
													value={formik.values.recordTypePerson?.firstName}
													isValid={formik.isValid}
													isTouched={formik.touched.recordTypePerson?.firstName}
													invalidFeedback={formik.errors.recordTypePerson?.firstName}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
                                              
                                                <div className='col-lg-6'>
											<FormGroup id='lastName' label='Last Name' isFloating>
                                            <Input
                                            type='search'
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                formik.setFieldValue("recordTypePerson.lastName", e.target.value)
                                            }
													onBlur={formik.handleBlur}
													value={formik.values.recordTypePerson?.lastName}
													isValid={formik.isValid}
													isTouched={formik.touched.recordTypePerson?.lastName}
													invalidFeedback={formik.errors.recordTypePerson?.lastName}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
                                        <div className='col-lg-12'>
											<FormGroup
												id='addressLine'
												label='Address Line'
												isFloating>
												<Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                        formik.setFieldValue("recordTypePerson.address", e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={formik.values.recordTypePerson?.address}
													isValid={formik.isValid}
													isTouched={formik.touched.recordTypePerson?.address}
													invalidFeedback={formik.errors.recordTypePerson?.address}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>

										<div className='col-lg-6'>
											<FormGroup id='city' label='City' isFloating>
												<Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                        formik.setFieldValue("recordTypePerson.city", e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={formik.values.recordTypePerson?.city}
													isValid={formik.isValid}
													isTouched={formik.touched.recordTypePerson?.city}
													invalidFeedback={formik.errors.recordTypePerson?.city}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
										{/* <div className='col-md-3'>
											<FormGroup id='state' label='State' isFloating>
												<Select
													ariaLabel='State'
													placeholder='Choose...'
													list={states}
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                        formik.setFieldValue("recordTypePerson.state", e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={formik.values.recordTypePerson?.state}
													isValid={formik.isValid}
													isTouched={formik.touched.recordTypePerson?.state}
													invalidFeedback={formik.errors.recordTypePerson?.state}
												/>
											</FormGroup>
										</div> */}
										<div className="col-md-3">
      <FormGroup id="state" label="" >
        <Select
          options={stateOptions}
          placeholder="Choose State..."
          value={stateOptions.find(option => option.value === formik.values.recordTypePerson?.state) || {label:formik.values.recordTypePerson?.state , value: formik.values.recordTypePerson?.state } || null}
          onChange={(selectedOption) => formik.setFieldValue("recordTypePerson.state", selectedOption?.value)}
          onBlur={() => formik.setFieldTouched("recordTypePerson.state", true)}
          styles={customStyles} // Optional: Apply custom styles
        />
      </FormGroup>
    </div>
										<div className='col-md-3'>
											<FormGroup id='zip' label='Zip' isFloating>
												<Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                        formik.setFieldValue("recordTypePerson.zip", e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={formik.values.recordTypePerson?.zip}
													isValid={formik.isValid}
													isTouched={formik.touched.recordTypePerson?.zip}
													invalidFeedback={formik.errors.recordTypePerson?.zip}
												/>
											</FormGroup>
										</div>
                                        <div className='col-lg-6'>
											<FormGroup id='SSN' label='SSN' isFloating>
                                            <Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                        formik.setFieldValue("recordTypePerson.SSN", e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={formik.values.recordTypePerson?.SSN}
													isValid={formik.isValid}
													isTouched={formik.touched.recordTypePerson?.SSN}
													invalidFeedback={formik.errors.recordTypePerson?.SSN}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
                                        <div className='col-lg-6'>
											<FormGroup id='AKA' label='AKA' isFloating>
                                            <Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                        formik.setFieldValue("recordTypePerson.AKA", e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={formik.values.recordTypePerson?.AKA}
													isValid={formik.isValid}
													isTouched={formik.touched.recordTypePerson?.AKA}
													invalidFeedback={formik.errors.recordTypePerson?.AKA}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
                                        <div className='col-lg-6'>
											<FormGroup id='from' label='DIO Start' isFloating>
                                            <Input
                                            type='date'
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                formik.setFieldValue("recordTypePerson.dateOfInjuryFrom", e.target.value)
                                            }
													onBlur={formik.handleBlur}
													value={formik.values.recordTypePerson?.dateOfInjuryFrom}
													isValid={formik.isValid}
													isTouched={formik.touched.recordTypePerson?.dateOfInjuryFrom}
													invalidFeedback={formik.errors.recordTypePerson?.dateOfInjuryFrom}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
                                        <div className='col-lg-6'>
											<FormGroup id='To' label='DOI End' isFloating>
                                            <Input
                                            type='date'
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                formik.setFieldValue("recordTypePerson.dateOfInjuryTo", e.target.value)
                                            }
													onBlur={formik.handleBlur}
													value={formik.values.recordTypePerson?.dateOfInjuryTo}
													isValid={formik.isValid}
													isTouched={formik.touched.recordTypePerson?.dateOfInjuryTo}
													invalidFeedback={formik.errors.recordTypePerson?.dateOfInjuryTo}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
										<div className='col-md-12'>
                                                <FormGroup id='continuous_trauma' label='' isFloating>
												<Checks
															type='switch'
															key={"continuous_trauma"}
															id={`continuous_trauma`}
															name='continuous_trauma'
															label={"Continuous Trauma"}
															onChange={formik.handleChange}
															checked={formik.values.recordTypeEntity.continuous_trauma}
														/>
											</FormGroup>
											</div>
                                                </>
                                                :
                                                <>
                                                <div className='col-lg-12'>
											<FormGroup id='name' label='Name' isFloating>
                                            <Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                        formik.setFieldValue("recordTypeEntity.name", e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={formik.values.recordTypeEntity?.name}
													isValid={formik.isValid}
													isTouched={formik.touched.recordTypeEntity?.name}
													invalidFeedback={formik.errors.recordTypeEntity?.name}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
                                              
                                                
                                        <div className='col-lg-12'>
											<FormGroup
												id='addressLine'
												label='Address Line'
												isFloating>
												<Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                        formik.setFieldValue("recordTypePerson.address", e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={formik.values.recordTypePerson?.address}
													isValid={formik.isValid}
													isTouched={formik.touched.recordTypePerson?.address}
													invalidFeedback={formik.errors.recordTypePerson?.address}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>

										<div className='col-lg-6'>
											<FormGroup id='city' label='City' isFloating>
												<Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                        formik.setFieldValue("recordTypePerson.city", e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={formik.values.recordTypePerson?.city}
													isValid={formik.isValid}
													isTouched={formik.touched.recordTypePerson?.city}
													invalidFeedback={formik.errors.recordTypePerson?.city}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
										{/* <div className='col-md-3'>
											<FormGroup id='state' label='State' isFloating>
												<Select
													ariaLabel='State'
													placeholder='Choose...'
													list={states}
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                        formik.setFieldValue("recordTypeEntity.state", e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={formik.values.recordTypeEntity?.state}
													isValid={formik.isValid}
													isTouched={formik.touched.recordTypeEntity?.state}
													invalidFeedback={formik.errors.recordTypeEntity?.state}
												/>
											</FormGroup>
										</div> */}
										<div className="col-md-3">
      <FormGroup id="state" label="" >
        <Select
          options={stateOptions}
          placeholder="Choose..."
          value={stateOptions.find(option => option.value === formik.values.recordTypePerson?.state) || null}
          onChange={(selectedOption) => formik.setFieldValue("recordTypePerson.state", selectedOption?.value)}
          onBlur={() => formik.setFieldTouched("recordTypePerson.state", true)}
          styles={customStyles} // Optional: Apply custom styles
        />
      </FormGroup>
    </div>
										<div className='col-md-3'>
											<FormGroup id='zip' label='Zip' isFloating>
												<Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                        formik.setFieldValue("recordTypePerson.zip", e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={formik.values.recordTypePerson?.zip}
													isValid={formik.isValid}
													isTouched={formik.touched.recordTypePerson?.zip}
													invalidFeedback={formik.errors.recordTypePerson?.zip}
												/>
											</FormGroup>
										</div>
                                        <div className='col-lg-6'>
											<FormGroup id='from' label='DOI Start' isFloating>
                                            <Input
                                            type='date'
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                formik.setFieldValue("recordTypePerson.dateOfInjuryFrom", e.target.value)
                                            }
													onBlur={formik.handleBlur}
													value={formik.values.recordTypePerson?.dateOfInjuryFrom}
													isValid={formik.isValid}
													isTouched={formik.touched.recordTypePerson?.dateOfInjuryFrom}
													invalidFeedback={formik.errors.recordTypePerson?.dateOfInjuryFrom}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
                                        <div className='col-lg-6'>
											<FormGroup id='To' label='DOI End' isFloating>
                                            <Input
                                            type='date'
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                formik.setFieldValue("recordTypePerson.dateOfInjuryTo", e.target.value)
                                            }
													onBlur={formik.handleBlur}
													value={formik.values.recordTypePerson?.dateOfInjuryTo}
													isValid={formik.isValid}
													isTouched={formik.touched.recordTypePerson?.dateOfInjuryTo}
													invalidFeedback={formik.errors.recordTypePerson?.dateOfInjuryTo}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>

										<div className='col-md-12'>
                                                <FormGroup id='urgent' label='' isFloating>
												<Checks
															type='switch'
															key={"continuous_trauma"}
															id={`continuous_trauma`}
															name='continuous_trauma'
															label={"Continuous Trauma"}
															onChange={formik.handleChange}
															checked={formik.values.continuous_trauma}
														/>
											</FormGroup>
											</div>
                                                </>
                                            }
								
                                    
                                    </div>
										</CardBody>
									</Card>
                                    </WizardItem>
								<WizardItem id='step3' title='Case Participants'>
									<div className='row g-4'>
                                    <Card shadow={"none"}>
							<CardHeader>
								<CardLabel icon='Task' iconColor='danger'>
                                <CardTitle tag='div' className='h4 fs-3'>
						Case Participants
					</CardTitle>
                                  
								</CardLabel>
                                <CardActions>
                                    <Button
						color='secondary'
						// isLight
						icon='Add'
						className='bg-gradient '
						onClick={() => setAddParticipants(true)}
                        >
						Add Participants
					</Button>
                                    </CardActions>
							</CardHeader>
							<CardBody>
								<div className='table-responsive'>
									<table className='table table-modern mb-0'>
										<thead>
											<tr>
												<th>Participants</th>
												<th>Type</th>
												<th>Represents</th>
												<th>Phone</th>
												{/* <th>Attorney</th> */}
												<th>Claim</th>
												<th>Adjustor</th>
												<th>Action</th>
											</tr>
										</thead>
                                        <tbody>
        {caseParticipants?.length > 0 && (
            caseParticipants?.map((item: any, index) => (
                <tr key={index}>
                    <td>{item?.participant?.value || item?.participant || "N/A"}</td>
                    <td>{item.type}</td>
                    <td>{item.represents}</td>
                    <td>{item.phone}</td>
                    {/* <td>{item.attorney}</td> */}
                    <td>{item.claim}</td>
                    <td>{item.adjuster}</td>
                    <td>
                        <button className="btn btn-danger" onClick={() => removeParticipant(index)}>Remove</button>
                        <button className="btn btn-primary mx-2" type='button' onClick={() => setAddParticipants(true)}>Edit</button>
                    </td>
                </tr>
            ))
        ) }
    </tbody>
									</table>
								</div>
                                {!caseParticipants?.length && (
									<Alert color='warning' isLight icon='Report' className='mt-3'>
										There is no Participants yet.
									</Alert>
								)}
							</CardBody>
						</Card>
									</div>
								</WizardItem>
								<WizardItem id='step3' title='Document Locations'>
									<div className='row g-4'>
                                    <Card shadow={"none"}>
							<CardHeader>
								<CardLabel icon='Task' iconColor='primary'>
                                <CardTitle tag='div' className='h4 fs-3'>
                                Document Locations
					</CardTitle>
                                  
								</CardLabel>
                                <CardActions>
                                    <Button
						color='secondary'
						// isLight
						icon='Add'
						className='bg-gradient '
						onClick={() => setAddDocuments(true)}
                        >
						Add Document Locations
					</Button>
                                    </CardActions>
							</CardHeader>
							<CardBody>
								<div className='table-responsive'>
									<table className='table table-modern mb-0'>
										<thead>
                                        <tr>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Zip</th>
            <th>Process Type</th>
            <th>Record Type</th>
            <th>Action</th>
            <th>Note</th>
            <th>Action</th> {/* File column */}
        </tr>
										</thead>
										<tbody>
                                        {documentLocationData?.length > 0 && (
            documentLocationData?.map((item, index) => (
                <tr key={index}>
                    <td>{item.name?.value || item?.name}</td>
                    <td>{item.address}</td>
                    <td>{item.city}</td>
                    <td>{item.state}</td>
                    <td>{item.zip}</td>
                    <td>{item.process_type}</td>
                    <td>{item.record_type}</td>
                    <td>{item.action}</td>
                    <td>{item.note}</td>
                    <td>
                        <button className="btn btn-danger" onClick={() => removeDocumentLocation(index)}>Remove</button>
                        <button className="btn btn-primary mx-2" type='button' onClick={() => setAddDocuments(true)}>Edit</button>
                    </td>
                </tr>
            ))
        ) }
										</tbody>
									</table>
								</div>
								{!documentLocationData?.length && (
									<Alert color='warning' isLight icon='Report' className='mt-3'>
										There is no Document Location.
									</Alert>
								)}
							</CardBody>
						</Card>
									</div>
								</WizardItem>
							</Wizard>
						)}
						
					</div>

							{/* </CardBody>
						</Card> */}
					
			</div>
			{/* <div className='row'>
				<div className='col-12'>
					<Card>
						<CardBody>
							<div className='row align-items-center justify-content-end'>
								<div className='col-auto'>
									<div className='row g-1'>
										<div className='col-auto'>
											<Button
												className='me-3'
												icon={'Save'}
												color={'secondary'}
												onClick={formik.handleSubmit}>
												
												save
											</Button>
										</div>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</div>
			</div> */}


            {/* modal participants */}
            <Modal
							setIsOpen={setAddParticipants}
							isOpen={addparticipants}
							titleId='upcomingEdit'
							isCentered
							isScrollable
							size='lg'>
							<ModalHeader setIsOpen={setAddParticipants}>
								<OffCanvasTitle id='addPArticipants'>Add Participants</OffCanvasTitle>
							</ModalHeader>
							<ModalBody>
                                <div className='w-full'>
                            <Button type="button" className="btn btn-primary my-3 d-flex justify-content-end" onClick={addParticipant}>
        Add new Participant
    </Button>
    </div>
                            {formik?.values?.participants?.map((p, index) => (
								<div className='row g-4'>
									<div className='col-12'>
										<FormGroup id='customerName' >
                                        {/* <Input
                                        type='search'
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            formik.setFieldValue(`participants[${index}].participant`, e.target.value)
                                        }
													onBlur={formik.handleBlur}
													value={p.participant}
													isValid={formik.isValid}
													isTouched={formik.touched.participants?.[index]?.participant}
                        invalidFeedback={formik.errors.participants?.[index]?.participant}
													validFeedback='Looks good!'
												/> */}
												{/* <Select
    placeholder="Select Participant..."
    options={optionsParticipants}
    isClearable
    onInputChange={(value) => setDebouncedParticipant(value)}
    onChange={(option) => formik.setFieldValue(`participants[${index}].participant`, option?.value)}
    onBlur={formik.handleBlur}
    value={optionsParticipants.find(option => option.value === p.participant) || null}
    isLoading={isFetching}
    noOptionsMessage={() => "No options available"}
    className={formik.touched.participants?.[index]?.participant && formik.errors.participants?.[index]?.participant ? "is-invalid" : ""}
    styles={customStyles}
/> */}
<CreatableSelect
    placeholder="Select Participant..."
    options={optionsParticipants}
    isClearable
    onInputChange={(value) => setDebouncedParticipant(value)}
    onChange={(option) =>{
        formik.setFieldValue(`participants[${index}].participant`, option);
		formik.setFieldValue(`participants[${index}].address`, option?.address || "");
        formik.setFieldValue(`participants[${index}].city`, option?.city || "");
        formik.setFieldValue(`participants[${index}].state`, option?.state || "");
        formik.setFieldValue(`participants[${index}].zip`, option?.zip || "");}
    } // Store entire object
    onBlur={formik.handleBlur}
	value={formik.values.participants?.[index]?.participant || null}
	// Ensure it's an object or null
    isLoading={isFetching}
    noOptionsMessage={() => "No options available"}
    styles={customStyles}
/>



										</FormGroup>
									</div>
									{/* <div className='col-6'>
										<FormGroup id='type' label='Type' isFloating>
                                        <Input
													  onChange={(e : React.ChangeEvent<HTMLInputElement>) =>
                                                        formik.setFieldValue(`participants[${index}].type`, e.target.value)
                                                    }
													onBlur={formik.handleBlur}
                                                    value={p.type}
                                                    isValid={formik.isValid}
                                                    isTouched={formik.touched.participants?.[index]?.type}
                                                    invalidFeedback={formik.errors.participants?.[index]?.type}
													validFeedback='Looks good!'
												/>
										</FormGroup>
									</div> */}
									<div className="col-6">
      <FormGroup id="type" label="" >
	  <Select
  options={participantsType}
  placeholder="Choose Type..."
  value={
    formik.values.participants?.[index]?.type
      ? participantsType.find(option => option.value === formik.values.participants[index]?.type) || 
        { label: formik.values.participants[index]?.type, value: formik.values.participants[index]?.type }
      : null // Ensure placeholder appears when no value is selected
  }
  onChange={(selectedOption) =>
    formik.setFieldValue(`participants[${index}].type`, selectedOption?.value)
  }
  onBlur={() => formik.setFieldTouched(`participants[${index}].type`, true)}
  styles={customStyles} // Optional: Apply custom styles
/>

        {formik.touched.participants?.[index]?.type && formik.errors.participants?.[index]?.type ? (
          <div className="invalid-feedback">{formik.errors.participants[index].type}</div>
        ) : (
          <div className="valid-feedback">Looks good!</div>
        )}
      </FormGroup>
    </div>
									<div className='col-6'>
										{/* <FormGroup id='employee' label='Represents' isFloating>
                                        <Input
													 onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        formik.setFieldValue(`participants[${index}].represents`, e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={p.represents}
                        isValid={formik.isValid}
                        isTouched={formik.touched.participants?.[index]?.represents}
                        invalidFeedback={formik.errors.participants?.[index]?.represents}
													validFeedback='Looks good!'
												/>
										</FormGroup> */}
										<FormGroup id="employee" label="" >
										<Select
  options={representsOptions}
  placeholder="Choose Represents..."
  value={
    formik.values.participants?.[index]?.represents
      ? representsOptions.find(option => option.value === formik.values.participants[index]?.represents) || 
        { label: formik.values.participants[index]?.represents, value: formik.values.participants[index]?.represents }
      : null // Ensures placeholder appears when no value is selected
  }
  onChange={(selectedOption) =>
    formik.setFieldValue(`participants[${index}].represents`, selectedOption?.value)
  }
  onBlur={() => formik.setFieldTouched(`participants[${index}].represents`, true)}
  styles={customStyles} // Optional: Apply custom styles
/>

      {formik.touched.participants?.[index]?.represents &&
      formik.errors.participants?.[index]?.represents ? (
        <div className="invalid-feedback">{formik.errors.participants[index].represents}</div>
      ) : (
        <div className="valid-feedback">Looks good!</div>
      )}
    </FormGroup>
									</div>
									<div className='col-12'>
										<FormGroup id='phone' label='Phone' isFloating>
                                        <Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        formik.setFieldValue(`participants[${index}].phone`, e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={p.phone}
                        isValid={formik.isValid}
                        isTouched={formik.touched.participants?.[index]?.phone}
                        invalidFeedback={formik.errors.participants?.[index]?.phone}
													validFeedback='Looks good!'
												/>
										</FormGroup>
									</div>
									<div className='col-12'>
										<FormGroup id='date' label='Address' isFloating>
                                        <Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        formik.setFieldValue(`participants[${index}].address`, e.target.value)
                                                    }
													onBlur={formik.handleBlur}
                                                    value={p.address}
                                                    isValid={formik.isValid}
                                                    isTouched={formik.touched.participants?.[index]?.address}
                                                    invalidFeedback={formik.errors.participants?.[index]?.address}
                                                                                validFeedback='Looks good!'
												/>
										</FormGroup>
									</div>
                                    <div className='col-6'>
										<FormGroup id='time' label='City' isFloating>
                                        <Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        formik.setFieldValue(`participants[${index}].city`, e.target.value)
                                                    }
													onBlur={formik.handleBlur}
                                                    value={p.city}
                                                    isValid={formik.isValid}
                                                    isTouched={formik.touched.participants?.[index]?.city}
                                                    invalidFeedback={formik.errors.participants?.[index]?.city}
                                                                                validFeedback='Looks good!'
												/>
										</FormGroup>
									</div>
                                    {/* <div className='col-md-3'>
											<FormGroup id='state' label='State' isFloating>
												<Select
													ariaLabel='State'
													placeholder='Choose...'
													list={states}
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        formik.setFieldValue(`participants[${index}].state`, e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={p.state}
                                                    isValid={formik.isValid}
                                                    isTouched={formik.touched.participants?.[index]?.state}
                                                    invalidFeedback={formik.errors.participants?.[index]?.state}
                                                                                validFeedback='Looks good!'
												/>
											</FormGroup>
										</div> */}
										 <div className="col-md-3">
      <FormGroup id="state" label="" >
	  <Select
  options={stateOptions}
  placeholder="Choose..."
  value={
    formik.values.participants?.[index]?.state
      ? stateOptions.find(option => option.value === formik.values.participants[index]?.state) || 
        { label: formik.values.participants[index]?.state, value: formik.values.participants[index]?.state }
      : null // Ensures placeholder appears when no value is selected
  }
  onChange={(selectedOption) => 
    formik.setFieldValue(`participants[${index}].state`, selectedOption?.value)
  }
  onBlur={() => formik.setFieldTouched(`participants[${index}].state`, true)}
  styles={customStyles} // Optional: Apply custom styles
/>

        {formik.touched.participants?.[index]?.state && formik.errors.participants?.[index]?.state ? (
          <div className="invalid-feedback">{formik.errors.participants[index].state}</div>
        ) : (
          <div className="valid-feedback">Looks good!</div>
        )}
      </FormGroup>
    </div>
										<div className='col-md-3'>
											<FormGroup id='zip' label='Zip' isFloating>
												<Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        formik.setFieldValue(`participants[${index}].zip`, e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={p.zip}
                                                    isValid={formik.isValid}
                                                    isTouched={formik.touched.participants?.[index]?.zip}
                                                    invalidFeedback={formik.errors.participants?.[index]?.zip}
                                                                                validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
                                        <div className='col-12'>
										<FormGroup id='time' label='Attorney' isFloating>
                                        <Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        formik.setFieldValue(`participants[${index}].attorney`, e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={p.attorney}
                                                    isValid={formik.isValid}
                                                    isTouched={formik.touched.participants?.[index]?.attorney}
                                                    invalidFeedback={formik.errors.participants?.[index]?.attorney}
                                                                                validFeedback='Looks good!'
												/>
										</FormGroup>
									</div>
                                    <div className='col-6'>
										<FormGroup id='time' label='Claim' isFloating>
                                        <Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        formik.setFieldValue(`participants[${index}].claim`, e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={p.claim}
                                                    isValid={formik.isValid}
                                                    isTouched={formik.touched.participants?.[index]?.claim}
                                                    invalidFeedback={formik.errors.participants?.[index]?.claim}
                                                                                validFeedback='Looks good!'
												/>
										</FormGroup>
									</div>
                                    <div className='col-6'>
										<FormGroup id='time' label='Adjustor' isFloating>
                                        <Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        formik.setFieldValue(`participants[${index}].adjuster`, e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={p.adjuster}
                                                    isValid={formik.isValid}
                                                    isTouched={formik.touched.participants?.[index]?.adjuster}
                                                    invalidFeedback={formik.errors.participants?.[index]?.adjuster}
                                                                                validFeedback='Looks good!'
												/>
										</FormGroup>
									</div>
								
									<div className='col-12'>
										
												<FormGroup id='note' label='Note' isFloating>
													<Textarea
														rows={8}
														placeholder='note'
														onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                            formik.setFieldValue(`participants[${index}].note`, e.target.value)
                                                        }
														value={p.note}
													/>
												</FormGroup>
											
									</div>
                                    <div className="mt-3 text-end">
                            {formik.values.participants.length > 1 &&  index > 0 && (
                                <button
                                    type="button"
                                    className="btn btn-danger me-2"
                                    onClick={() => removeParticipant(index)}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        <div className="text-end m-0">
                            {formik.values.participants.length > 1 && index !== formik.values.participants.length - 1 && (
                               <div className='my-4 border ' />
                            )}
                        </div>
								</div>
                                   ))}
                                  
							</ModalBody>
							<ModalFooter className='bg-transparent'>
								<Button
									color='info'
									className='w-100'
									onClick={() => {
                                        setCasePArticipants(formik?.values?.participants)
                                        setAddParticipants(false)}}>
									Save
								</Button>
							</ModalFooter>
						</Modal>

                        {/* modal documnet */}
                        <Modal
							setIsOpen={setAddDocuments}
							isOpen={addDocuments}
							titleId='upcomingEdit'
							isCentered
							isScrollable
							size='lg'>
							<ModalHeader setIsOpen={setAddDocuments}>
								<OffCanvasTitle id='addPArticipants'>Add Document </OffCanvasTitle>
							</ModalHeader>
							<ModalBody>
                                <div className='w-full'>
                            <Button type="button" className="btn btn-primary my-3 d-flex justify-content-end" onClick={addDocumentLocation}>
        Add new Document
    </Button>
    </div>
    {formik?.values?.documentLocation?.map((d: any, index: number) => (
    <div className="row g-4" key={index}>
        <div className="col-12">
            <FormGroup id="name" >
                {/* <Input
                    type="text"
                    onChange={(e) =>
                        formik.setFieldValue(`documentLocation[${index}].name`, e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    value={d.name}
                    isValid={formik.isValid}
                    isTouched={formik.touched.documentLocation?.[index]?.name}
                    invalidFeedback={formik.errors.documentLocation?.[index]?.name}
                    validFeedback="Looks good!"
                /> */}
				<CreatableSelect
    placeholder="Search Location..."
    options={optionsParticipants}
    isClearable
    onInputChange={(value) => setDebouncedParticipant(value)}
    onChange={(option) =>{
        formik.setFieldValue(`documentLocation[${index}].name`, option);
		formik.setFieldValue(`documentLocation[${index}].address`, option?.address || "");
        formik.setFieldValue(`documentLocation[${index}].city`, option?.city || "");
        formik.setFieldValue(`documentLocation[${index}].state`, option?.state || "");
        formik.setFieldValue(`documentLocation[${index}].zip`, option?.zip || "");}
    } // Store entire object
    onBlur={formik.handleBlur}
    value={formik?.values?.documentLocation?.[index]?.name || null} // Ensure it's an object or null
    isLoading={isFetching}
    noOptionsMessage={() => "No options available"}
    styles={customStyles}
/>


            </FormGroup>
        </div>

        <div className="col-12">
            <FormGroup id="address" label="Address" isFloating>
                <Input
                    type="text"
                    onChange={(e) =>
                        formik.setFieldValue(`documentLocation[${index}].address`, e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    value={d.address}
                    isValid={formik.isValid}
                    isTouched={formik.touched.documentLocation?.[index]?.address}
                    invalidFeedback={formik.errors.documentLocation?.[index]?.address}
                    validFeedback="Looks good!"
                />
            </FormGroup>
        </div>

        <div className="col-6">
            <FormGroup id="city" label="City" isFloating>
                <Input
                    type="text"
                    onChange={(e) =>
                        formik.setFieldValue(`documentLocation[${index}].city`, e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    value={d.city}
                    isValid={formik.isValid}
                    isTouched={formik.touched.documentLocation?.[index]?.city}
                    invalidFeedback={formik.errors.documentLocation?.[index]?.city}
                    validFeedback="Looks good!"
                />
            </FormGroup>
        </div>
{/* 
        <div className="col-md-3">
            <FormGroup id="state" label="State" isFloating>
                <Select
                    ariaLabel="State"
                    placeholder="Choose..."
                    list={states}
                    onChange={(e) =>
                        formik.setFieldValue(`documentLocation[${index}].state`, e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    value={d.state}
                    isValid={formik.isValid}
                    isTouched={formik.touched.documentLocation?.[index]?.state}
                    invalidFeedback={formik.errors.documentLocation?.[index]?.state}
                    validFeedback="Looks good!"
                />
            </FormGroup>
        </div> */}
		 <div className="col-md-3">
      <FormGroup id="state" label="" >
	  <Select
  options={stateOptions}
  placeholder="Choose..."
  value={
    formik.values.documentLocation?.[index]?.state
      ? stateOptions.find(option => option.value === formik.values.documentLocation[index]?.state) || 
        { label: formik.values.documentLocation[index]?.state, value: formik.values.documentLocation[index]?.state }
      : null // Ensures placeholder appears when no value is selected
  }
  onChange={(selectedOption) => 
    formik.setFieldValue(`documentLocation[${index}].state`, selectedOption?.value)
  }
  onBlur={() => formik.setFieldTouched(`documentLocation[${index}].state`, true)}
  styles={customStyles} // Optional: Apply custom styles
/>

        {formik.touched.documentLocation?.[index]?.state &&
        formik.errors.documentLocation?.[index]?.state ? (
          <div className="invalid-feedback">{formik.errors.documentLocation[index].state}</div>
        ) : (
          <div className="valid-feedback">Looks good!</div>
        )}
      </FormGroup>
    </div>

        <div className="col-md-3">
            <FormGroup id="zip" label="Zip" isFloating>
                <Input
                    type="text"
                    onChange={(e) =>
                        formik.setFieldValue(`documentLocation[${index}].zip`, e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    value={d.zip}
                    isValid={formik.isValid}
                    isTouched={formik.touched.documentLocation?.[index]?.zip}
                    invalidFeedback={formik.errors.documentLocation?.[index]?.zip}
                    validFeedback="Looks good!"
                />
            </FormGroup>
        </div>

        <div className="col-6">
            <FormGroup id="processType" >
                {/* <Input
                    type="text"
                    onChange={(e) =>
                        formik.setFieldValue(`documentLocation[${index}].process_type`, e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    value={d.process_type}
                    isValid={formik.isValid}
                    isTouched={formik.touched.documentLocation?.[index]?.process_type}
                    invalidFeedback={formik.errors.documentLocation?.[index]?.process_type}
                    validFeedback="Looks good!"
                /> */}
				<Select
  options={processTypeOptions}
  placeholder="Choose Process type..."
  value={
    formik?.values?.documentLocation?.[index]?.process_type
      ? processTypeOptions.find(option => option.value === formik.values.documentLocation[index]?.process_type) || 
        { label: formik.values.documentLocation[index]?.process_type, value: formik.values.documentLocation[index]?.process_type }
      : null // Ensures placeholder appears when no value is selected
  }
  onChange={(selectedOption) => 
    formik.setFieldValue(`documentLocation[${index}].process_type`, selectedOption?.label)
  }
  onBlur={() => formik.setFieldTouched(`documentLocation[${index}].process_type`, true)}
  styles={customStyles} // Optional: Apply custom styles
/>

            </FormGroup>
        </div>

        <div className="col-6">
            <FormGroup id="RecordType" >
                {/* <Input
                    type="text"
                    onChange={(e) =>
                        formik.setFieldValue(`documentLocation[${index}].record_type`, e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    value={d.record_type}
                    isValid={formik.isValid}
                    isTouched={formik.touched.documentLocation?.[index]?.record_type}
                    invalidFeedback={formik.errors.documentLocation?.[index]?.record_type}
                    validFeedback="Looks good!"
                /> */}
				<Select
  options={recordTypeOption}
  placeholder="Choose Record type..."
  value={
    formik?.values?.documentLocation?.[index]?.record_type
      ? recordTypeOption.find(option => option.value === formik.values.documentLocation[index]?.record_type) || 
        { label: formik.values.documentLocation[index]?.record_type, value: formik.values.documentLocation[index]?.record_type }
      : null // Ensures placeholder appears when no value is selected
  }
  onChange={(selectedOption) => 
    formik.setFieldValue(`documentLocation[${index}].record_type`, selectedOption?.value)
  }
  onBlur={() => formik.setFieldTouched(`documentLocation[${index}].record_type`, true)}
  styles={customStyles} // Optional: Apply custom styles
/>
            </FormGroup>
        </div>

        <div className="col-12">
            <FormGroup id="action" >
                {/* <Input
                    type="text"
                    onChange={(e) =>
                        formik.setFieldValue(`documentLocation[${index}].action`, e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    value={d.action}
                    isValid={formik.isValid}
                    isTouched={formik.touched.documentLocation?.[index]?.action}
                    invalidFeedback={formik.errors.documentLocation?.[index]?.action}
                    validFeedback="Looks good!"
                /> */}
				<Select
  options={actionOptions}
  placeholder="Choose Action..."
  value={
    formik?.values?.documentLocation?.[index]?.action
      ? actionOptions.find(option => option.value === formik.values.documentLocation[index]?.action) || 
        { label: formik.values.documentLocation[index]?.action, value: formik.values.documentLocation[index]?.action }
      : null // Ensures placeholder appears when no value is selected
  }
  onChange={(selectedOption) => 
    formik.setFieldValue(`documentLocation[${index}].action`, selectedOption?.value)
  }
  onBlur={() => formik.setFieldTouched(`documentLocation[${index}].action`, true)}
  styles={customStyles} // Optional: Apply custom styles
/>
            </FormGroup>
        </div>

        <div className="col-12">
            <FormGroup id="note" label="Note" isFloating>
                <Input
                    type="text"
                    onChange={(e) =>
                        formik.setFieldValue(`documentLocation[${index}].note`, e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    value={d.note}
                    isValid={formik.isValid}
                    isTouched={formik.touched.documentLocation?.[index]?.note}
                    invalidFeedback={formik.errors.documentLocation?.[index]?.note}
                    validFeedback="Looks good!"
                />
            </FormGroup>
        </div>

        <div className="col-12">
            <FormGroup id="review_request" label="Email for Review">
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={`review_request-${index}`}
                        checked={d.review_request}
                        onChange={(e) =>
                            formik.setFieldValue(`documentLocation[${index}].review_request`, e.target.checked)
                        }
                    />
                    <label className="form-check-label" htmlFor={`review_request-${index}`}>
                        Send Email for Review
                    </label>
                </div>
            </FormGroup>
        </div>

        {/* <div className="col-12">
            <FormGroup id="files" label="Document Upload">
                <Input
                    type="file"
                    // onChange={(e) =>
                    //     formik.setFieldValue(`documentLocation[${index}].files`, e.target.files[0])
                    // }
					onChange={(e)=>handleFileChange(e , index)}
                    onBlur={formik.handleBlur}
                    isValid={formik.isValid}
                    isTouched={formik.touched.documentLocation?.[index]?.files}
                    invalidFeedback={formik.errors.documentLocation?.[index]?.files}
                    validFeedback="Looks good!"
                />
            </FormGroup>
        </div> */}
		<div className="col-12">
  <FormGroup id="files" label="Document Upload">
    <Input
      type="file"
      multiple
      onChange={(e) => handleFileChange(e, index)}
      onBlur={formik.handleBlur}
      isValid={formik.isValid}
      isTouched={formik.touched.documentLocation?.[index]?.files}
      invalidFeedback={formik.errors.documentLocation?.[index]?.files}
      validFeedback="Looks good!"
    />
  </FormGroup>
  {loading[index] && (
        <div className="text-center my-2">
          <Spinner isGrow variant="primary" />
          <p>Uploading...</p>
        </div>
      )}
  {/* Display uploaded files */}
  {formik.values.documentLocation[index]?.files?.length > 0 && (
    <div className="mt-2">
      <h6>Uploaded Files:</h6>
      <ul>
	{(Array.isArray(formik?.values?.documentLocation?.[index]?.files) 
  ? formik.values.documentLocation[index].files 
  : []
)?.map((fileUrl: string, i: number) => (
  <li key={i}>
    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
      {decodeURIComponent(fileUrl.split("/").pop() || "File")}
	  
    </a>
	<Button
	icon='cancel'
	isOutline
            type="submit"
            onClick={() => {
              const updatedFiles = formik.values.documentLocation[index].files.filter(
                (_: string, fileIndex: number) => fileIndex !== i
              );
              formik.setFieldValue(`documentLocation[${index}].files`, updatedFiles);
            }}
            className="text-red-500 hover:underline"
          >
            Remove
          </Button>
  </li>
))}


      </ul>
    </div>
  )}
</div>


        <div className="mt-3 text-end">
            {formik.values.documentLocation.length > 1 && index > 0 && (
                <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={() => removeDocumentLocation(index)}
                >
                    Remove
                </button>
            )}
        </div>
                        <div className="text-end m-0">
                            {formik.values.documentLocation.length > 1 && index !== formik.values.documentLocation.length - 1 && (
                               <div className='my-4 border ' />
                            )}
                        </div>
    </div>
))}

                                  
							</ModalBody>
							<ModalFooter className='bg-transparent'>
								<Button
									color='info'
									className='w-100'
									isDisable={Object.values(loading).some((status) => status)} 
									onClick={() => {
                                        setdocumentLocationData(formik?.values?.documentLocation)
                                        setAddDocuments(false)}}>
									Save
								</Button>
							</ModalFooter>
						</Modal>
		</Page>
	);
};

export default AddOrder;
