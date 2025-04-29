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
import { useCreateOrderMutation, useDeleteOrderMutation, useGetActionsQuery, useGetBillToQuery, useGetCaseTypeQuery, useGetCourtNameQuery, useGetParticipantsQuery, useGetRecordTypeQuery, useGetRepresentsQuery, useGetSingleQuery, useGetUsersQuery } from '../../../features/users';
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

// const actionOptions= [
//     { label: "Prepare Subpoena - Serve - Copy", value: 2001 },
//     { label: "Prepare Subpoena - Serve", value: 2002 },
//     { label: "Prepare Subpoena - Copy", value: 2003 },
//     { label: "Subpoena Attached - Serve - Copy", value: 2004 },
//     { label: "Subpoena Attached - Serve", value: 2005 },
//     { label: "Subpoena Attached - Copy", value: 2006 },
//     { label: "Copy", value: 2007 }
// ];



// const recordTypeOption: any[] = [
//     { label: "ADDENDUM", value: 1001 },
//     { label: "DENTAL", value: 1002 },
//     { label: "EMPLOYMENT/ CIVIL", value: 1003 },
//     { label: "HEALTH CLUB", value: 1004 },
//     { label: "INSURANCE/ CIVIL", value: 1005 },
//     { label: "ATTORNEY", value: 1006 },
//     { label: "MEDICAL/ CIVIL", value: 1007 },
//     { label: "PHARMACY", value: 1008 },
//     { label: "PSYCHIATRIC", value: 1009 },
//     { label: "SCHOLASTIC", value: 1010 },
//     { label: "X-RAY", value: 1011 },
//     { label: "BILLING", value: 1012 },
//     { label: "MEDICAL/ W.C.", value: 1013 },
//     { label: "PARAMEDIC", value: 1014 },
//     { label: "EMPLOYMENT/ W.C.", value: 1015 },
//     { label: "INSURANCE/ W.C.", value: 1016 },
//     { label: "ATTACHMENT 3", value: 1017 },
//     { label: "SCR-SANTA ANA-2", value: 1018 },
//     { label: "EMPLOYMENT RECORDS #1", value: 1019 },
//     { label: "SCR MED/INVESTIGATION", value: 1020 },
//     { label: "MEDICAL RECORDS #4", value: 1021 },
//     { label: "EMPLOYMENT RECORDS #3", value: 1022 },
//     { label: "INSURANCE RECORDS #1", value: 1023 },
//     { label: "INSURANCE RECORDS AUTO", value: 1024 },
//     { label: "MEDICAL RECORDS #5", value: 1025 },
//     { label: "MEDICAL RECORDS #2", value: 1026 },
//     { label: "INSURANCE RECORDS #3", value: 1027 },
//     { label: "MEDICAL RECORDS #7", value: 1028 },
//     { label: "MEDICAL RECORDS #1", value: 1029 },
//     { label: "DENTAL RECORDS #1", value: 1030 },
//     { label: "MEDICAL/INSURANCE RECORDS", value: 1031 },
//     { label: "EMPLOYMENT RECORDS #2", value: 1032 },
//     { label: "MEDICAL RECORDS-BILL-XRAYS", value: 1033 },
//     { label: "MEDICAL RECORDS #6", value: 1034 },
//     { label: "INSURANCE RECORDS #2", value: 1035 },
//     { label: "PHYSICAL THERAPY RECORDS", value: 1036 },
//     { label: "BUSINESS RECORDS", value: 1037 },
//     { label: "BILLING RECORDS #2", value: 1038 },
//     { label: "SCHOOL RECORDS", value: 1039 },
//     { label: "SHERIFF RECORDS", value: 1040 },
//     { label: "SCR-SANTA ANA-1", value: 1041 },
//     { label: "MEDICAL RECORDS #3", value: 1042 },
//     { label: "ADDITIONAL INFO NEEDED", value: 1043 },
//     { label: "INSURANCE RECORDS - BENEFITS P", value: 1044 },
//     { label: "CORONER", value: 1045 },
//     { label: "CAL OSHA", value: 1046 },
//     { label: "EDD", value: 1047 },
//     { label: "SECURITY / SURVEILLANCE", value: 1048 },
//     { label: "WCAB FILE", value: 1049 },
//     { label: "MATERIAL SAFETY DATA SHEETS", value: 1050 },
//     { label: "RATINGS BUREAU W/C", value: 1051 },
//     { label: "WCIRB REQUEST", value: 1052 },
//     { label: "PAYROLL", value: 1053 },
//     { label: "ORTHOPEDIC", value: 1054 },
//     { label: "AUTOMOBILE INSURANCE", value: 1055 },
//     { label: "HEALTH PLAN PROVIDER", value: 1056 },
//     { label: "SPECIAL NOTICE OF LAWSUIT", value: 1057 },
//     { label: "SKIP TRACE SEARCH", value: 1058 },
//     { label: "SOCIAL SECURITY RECORDS", value: 1059 }
// ];



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
	console.log("itemId" ,userDataStore)
	const [activeTab, setActiveTab] = useState(TABS.ACCOUNT_DETAIL);
    const [addparticipants, setAddParticipants] = useState<boolean>(false);
   
    const [addDocuments, setAddDocuments] = useState<boolean>(false);
	const combinedSchema = step1Schema.concat(step2Schema).concat(step3Schema);
	const [createOrder, {isLoading: OrderLoading}] = useCreateOrderMutation()
	const [updateOrder, {isLoading: UpdateLoading}] = useDeleteOrderMutation()
	const id = useSelector((state: any)=> state.auth.user.id)
	const [selectedId , setSelectedId] = useState(id || userDataStore?.UserID)
	const [caseTypeId , setCaseTypeId] = useState(null)
	const { data: userData, isLoading:userLoading  } = useGetSingleQuery(
		{ type: "user", id: selectedId },
		{ skip: !selectedId } // Prevents API call if selectedId is falsy
	  );
	const { data: procType,  } = useGetSingleQuery(
		{ type: "proctypes", id: caseTypeId },
		{ skip: !caseTypeId } // Prevents API call if selectedId is falsy
	  );
	  const shouldSkip = !userDataStore || userDataStore.Role === "attorney";
	const {data:users}= useGetUsersQuery(undefined,{
		skip: shouldSkip
	})
	const {data:caseTypes}= useGetCaseTypeQuery({})
	const {data:actionsData}= useGetActionsQuery({})
	const {data:representData}= useGetRepresentsQuery({})
	const {data:recordTypeData}= useGetRecordTypeQuery({})
	console.log('====================================', actionsData);
	const { data: order , isLoading, refetch: orderRefetch} = useGetSingleQuery({ type: 'order', id: itemId }, { skip: !itemId });
	const [caseParticipants , setCasePArticipants] = useState<any[]> (order?.tblOrderCaseParties || [])
    const [documentLocationData , setdocumentLocationData] = useState <any[]>(order?.TblOrderDocLocations || [])
	console.log(userData, "userData")


	useEffect(()=>{
		setCasePArticipants(order?.tblOrderCaseParties)
		setdocumentLocationData(order?.TblOrderDocLocations)
	},[order])

	const recordDetails = 
	order?.record_details 

	
	
	
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
			orderBy: order?.orderByUser?.UserID || userData?.data?.UserID || null,
			attonyName:   order?.orderByUser
			? { value: order.orderByUser?.UserName, label: order.orderByUser?.UserName }: userData?.data?.UserName
			? { value: userData.data.UserName, label: userData.data.UserName } :  "",
			firmName: order?.orderByUser?.FirmName || userData?.data?.FirmName   || '',
			emailAddress: userData?.data?.Email || order?.orderByUser?.Email || '',
			phoneNumber: userData?.data?.Phone || order?.orderByUser?.Phone || '',
			addressLine: userData?.data?.Address || order?.orderByUser?.Address || '',
			addressLine2: order?.orderByUser?.addressLine2 || '',
			city: userData?.data?.City || order?.orderByUser?.city || '',
			state: userData?.data?.State || order?.orderByUser?.State || '',
			zip: userData?.data?.Zip || order?.orderByUser?.Zip || '',
			urgent: order?.IsRush || false,
			neededBy: order?.NeededBy ? dayjs(order?.NeededBy).format("YYYY-MM-DD") :  null,
			caseType: order?.CaseTypeID || '',
			ClaimNo: order?.ClaimNo || '',
			DOB: order?.DOB || '',
			Cros: order?.Cros || '',
			FilingDistrict: order?.FilingDistrict || '',
			CourtRoomNo: order?.CourtRoomNo || '',
			CourtDepartment: order?.CourtDepartment || '',
			Representing: 
			// order?.Representing ? { value: order.Representing, label: order.Representing }
			// : 
			"",
			
			billTo: order?.BillTo ? { value: order.BillTo, label: order.BillTo }
        : "",
			caseName: order?.CaseName || '',
			fileNumber: order?.FileNumber || '',
			caseNumber: order?.CaseNumber || '',
			courtName: order?.CourtName 
        ? { value: order.CourtName, label: order.CourtName } 
        : "",  
			CourtAddress: order?.CourtAddress || '',
			CourtCity: order?.CourtCity || "",
			CourtState: order?.CourtState || "",
			CourtZip: order?.CourtZip || "",
			person: order?.record_details?.RecordType === "Person" || "",
			entity: order?.record_details?.RecordType === "Entity" || "",
			recordTypePerson: {
				firstName: order?.record_details?.PFirstName ||  recordDetails?.PFirstName ||  "",
				lastName: order?.record_details?.PLastName || recordDetails?.PLastName || "",
				address: order?.record_details?.PAddress ||  recordDetails?.PAddress ||"",
				city: order?.record_details?.PCity || recordDetails?.PCity || "",
				state: order?.record_details?.PState || recordDetails?.PState || "",
				zip: order?.record_details?.record_zip || recordDetails?.record_zip ||  "",
				SSN: order?.record_details?.PSSN || recordDetails?.PSSN || "",
				AKA: order?.record_details?.PAKA || recordDetails?.PAKA || "",
				dateOfInjuryFrom: dayjs(order?.record_details?.date_of_injury?.from).format("YYYY-MM-DD") ||  dayjs(recordDetails?.date_of_injury?.from).format("YYYY-MM-DD")   ||  "",
				dateOfInjuryTo: dayjs(order?.record_details?.date_of_injury?.to).format("YYYY-MM-DD") ||  dayjs(recordDetails?.date_of_injury?.to).format("YYYY-MM-DD") || "",
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
			participants: order?.tblOrderCaseParties?.length > 0 
			? order?.tblOrderCaseParties?.map((p: any) => ({
				PartyName: { value: p.PartyName, label: p.PartyName } || "",
				PartyType: p?.PartyType || "",
				RepresentID: p?.RepresentID || "",
				PartyPhone: p?.PartyPhone || "",
				PartyAddress: p?.PartyAddress || "",
				PartyCity: p?.PartyCity || "",
				PartyState: p?.PartyState || "",
				PartyZip: p?.PartyZip || "",
				OpposingAttorney: p?.OpposingAttorney || "",
				InsuranceClaim: p?.InsuranceClaim || "",
				InsuranceAdjuster: p?.InsuranceAdjuster || "",
				Note: p?.Note || "",
			}))
			: [
				{
					PartyName: "",
					PartyType: "",
					RepresentID: "",
					PartyPhone: "",
					PartyAddress: "",
					PartyCity: "",
					PartyState: "",
					PartyZip: "",
					OpposingAttorney: "",
					InsuranceClaim: "",
					InsuranceAdjuster: "",
					Note: "",
				},
			],
			documentLocation: order?.TblOrderDocLocations?.length > 0
  ? order?.TblOrderDocLocations?.map((d:any) => ({
	LocationName:{ value: d?.LocationName, label: d?.LocationName } || "",
	LocationAddress: d?.LocationAddress || "",
	LocationCity: d?.LocationCity || "",
	LocationState: d?.LocationState || "",
	LocationZip: d?.LocationZip || "",
	ProcessType: d?.ProcessType || "",
	RecordType: d?.RecordType || "",
	Action: d?.Action || "",
	Note: d?.Note || "",
	CopyForReview: d?.CopyForReview ?? false, // Ensuring boolean value
	// DocFilePath: Array.isArray(d.files) ? d.files : [], // Ensuring an array
	DocFilePath: d?.DocFilePath || "", // Ensuring an array
    }))
  : [
      {
        LocationName: "",
        LocationAddress: "",
        LocationCity: "",
        LocationState: "",
        LocationZip: "",
        ProcessType: "",
        RecordType: "",
        Action: "",
        Note: "",
        CopyForReview: false,
        DocFilePath: "",
      },
    ],

		},
		enableReinitialize: true,
		onSubmit: async (values) => {
			console.log(values.participants, "values.participants")
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
					PartyName: p.PartyName?.value || "", // Ensure it's a string
				}));
			
				const formattedDocumentLocation = values.documentLocation.map(p => ({
					...p,
					LocationName: p.LocationName?.value || "", // Ensure it's a string
				}));
			
				const postData = {
					UserID: values.orderBy,
					IsRush: values.urgent,
					NeededBy: values.neededBy,
					CaseTypeID: values.caseType,
					CaseName: values.caseName,
					FileNumber: values.fileNumber,
					CaseNumber: values.caseNumber,
					CourtName: values.courtName?.value || "",
					CourtAddress: values.CourtAddress || "",
					CourtCity: values.CourtCity || "",
					CourtState: values.CourtState || "",
					CourtZip: values.CourtZip || "",
					ClaimNo: values.ClaimNo || "",
					DOB: values.DOB || "",
					Representing: values.Representing || "",
					Cros: values.Cros || "",
					FilingDistrict: values.FilingDistrict || "",
					CourtRoomNo: values.CourtRoomNo || "",
					CourtDepartment: values.CourtDepartment || "",
					BranchID: 5,
					record_details: {
						RecordType: values.person ? "Person" : values.entity ? "Entity" : "Person",
						PFirstName: values.recordTypePerson?.firstName || "",
						PLastName: values.recordTypePerson?.lastName || "",
						PAKA: values.recordTypePerson?.AKA || "",
						PSSN: values.recordTypePerson?.SSN || "",
						date_of_injury: {
							from: values.recordTypePerson?.dateOfInjuryFrom || "",
							to: values.recordTypePerson?.dateOfInjuryTo || "",
						},
						PAddress: values.recordTypePerson?.address || "",
						PCity: values.recordTypePerson?.city || "",
						PState: values.recordTypePerson?.state || "",
						PZip: values.recordTypePerson?.zip || "",
						continuous_trauma : values?.continuous_trauma
					},
					BillTo: values.billTo?.value || "",
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
					} catch (err: any) {
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
                PartyName: "",
                PartyType: "",
                RepresentID: "",
                PartyPhone: "",
                PartyAddress: "",
                PartyCity: "",
                PartyState: "",
                PartyZip: "",
                OpposingAttorney: "",
                InsuranceClaim: "",
                InsuranceAdjuster: "",
                Note: "",
            },
        ]);
    };
    const addDocumentLocation = () => {
        formik.setFieldValue("documentLocation", [
            ...formik.values.documentLocation,
            {
                LocationName:"",
                LocationAddress:"",
                LocationCity:"",
                LocationState:"",
                LocationZip:"",
                ProcessType:"",
                RecordType:"",
                Action:"",
                Note:"",
                CopyForReview:false,
                DocFilePath: ""
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
	// const handleFileChange = async (
	// 	event: React.ChangeEvent<HTMLInputElement>,
	// 	index: number
	//   ) => {
	// 	if (event.target.files) {
	// 	  const filesArray = Array.from(event.target.files);
	// 	  if (filesArray.length === 0) return;
	  
	// 	  setLoading((prev) => ({ ...prev, [index]: true }));
	  
	// 	  const formData = new FormData();
	// 	  filesArray.forEach((file) => {
	// 		formData.append("files", file);
	// 	  });
	  
	// 	  console.log("📂 Files selected:", filesArray);
	// 	  console.log("📤 FormData before upload:", formData);
	  
	// 	  try {
	// 		const response = await axios.post(
	// 		  "http://localhost:3000/api/upload",
	// 		  formData,
	// 		  {
	// 			headers: {
	// 			  "Content-Type": "multipart/form-data",
	// 			  Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
	// 			},
	// 		  }
	// 		);
	  
	// 		console.log("✅ Upload response:", response.data);
	  
	// 		if (response.data?.files && Array.isArray(response.data.files)) {
	// 		  const uploadedFiles = response.data.files.map(
	// 			(file: { path: string }) =>
	// 			  `http://localhost:3000/api/${file.path}`
	// 		  );
	  
	// 		  console.log("🖼️ Processed uploaded files:", uploadedFiles);
	  
	// 		  // Ensure we maintain existing files in the array
	// 		  formik.setFieldValue(`documentLocation[${index}].DocFilePath`,
	// 			uploadedFiles,
	// 		  );
	  
	// 		  // Reset file input
	// 		  event.target.value = "";
	// 		}
	// 	  } catch (error) {
	// 		console.error("❌ File upload failed:", error);
	// 	  } finally {
	// 		setLoading((prev) => ({ ...prev, [index]: false })); 
	// 	  }
	// 	}
	//   };
	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
		index: number
	  ) => {
		const file = event.target.files?.[0];
		if (!file) return;
	  
		setLoading((prev) => ({ ...prev, [index]: true }));
	  
		const formData = new FormData();
		formData.append("files", file); // single file key
	  
		console.log("📂 File selected:", file);
		console.log("📤 FormData before upload:", formData);
	  
		try {
		  const response = await axios.post(
			`${import.meta.env.VITE_BASE_URL}/upload`,
			formData,
			{
			  headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
			  },
			}
		  );
	  
		  console.log("✅ Upload response:", response.data);
	  
		//   if (response.data?.files[0].path) {
			const uploadedFileUrl = `${response.data?.files[0].filename}`;
			console.log("🖼️ Processed uploaded file:", uploadedFileUrl);
	  
			formik.setFieldValue(
			  `documentLocation[${index}].DocFilePath`,
			  uploadedFileUrl
			);
			console.log(formik.values, "formik")
	  
			// Reset file input
			event.target.value = "";
		//   }
		} catch (error) {
		  console.error("❌ File upload failed:", error);
		} finally {
		  setLoading((prev) => ({ ...prev, [index]: false }));
		}
	  };
	  
	  const stateOptions = states?.map(({ value, text }) => ({
		value,
		label: text,
	  }));

	  const userOptions =
  userDataStore.Role === "attorney"
    ? userData?.data
      ? [{ value: userData.data.username, label: userData.data.username }]
      : []
    : users?.data?.map((user: any) => ({
        value: user.UserID,
        label: user.UserName,
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
          value: court.Location?.locat_name || "aa",
          label: `${court.Location.locat_name}
		  , ${court.Location.locat_city}, ${court.Location.locat_state} ${court.Location.locat_zip}` || "aaa",
          address: court.Location.locat_address,
          city: court.Location.locat_city,
          state: court.Location.locat_state,
          zip: court.Location.locat_zip,
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
	console.log(Array.isArray(customerData?.data) , "losss")
	const optionsCustomer = Array.isArray(customerData?.data) 
    ? customerData?.data?.map((item: any) => ({
        value: item?.Location?.locat_name,
        label: item?.Location?.locat_name || 'Unknown',
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
	const actionOptions = Array.isArray(actionsData?.data) 
    ? actionsData?.data?.map((item: any) => ({
        value: item?.id,
        label: item?.Action || 'Unknown',
    })) 
    : [];
	const representOptions = Array.isArray(representData?.data) 
    ? representData?.data?.map((item: any) => ({
        value: item?.id,
        label: item?.name || 'Unknown',
    })) 
    : [];
	const recordTypeOption = Array.isArray(recordTypeData?.data) 
    ? recordTypeData?.data?.map((item: any) => ({
        value: item?.Word_ID,
        label: item?.Word_Name || 'Unknown',
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

	const caseNameId = optionsCaseType.find((option: any) => option.value === parseInt(formik.values.caseType))
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
      ? optionsCaseType.find((option: any) => option.value === parseInt(formik.values.caseType)) || 
        { label: formik.values.caseType, value: formik.values.caseType }
      : null // Ensure placeholder appears when no value is selected
  }
  onChange={(selectedOption) => {
	setCaseTypeId(selectedOption?.value)
	formik.setFieldValue("caseType", selectedOption?.value)}}
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
											<FormGroup
												id='ClaimNo'
												label='Claim Number'
												isFloating>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.ClaimNo}
													isValid={formik.isValid}
													isTouched={formik.touched.ClaimNo}
													invalidFeedback={formik.errors.ClaimNo}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
										<div className='col-lg-6'>
											<FormGroup
												id='DOB'
												label='DOB'
												isFloating>
												<Input
												type='date'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.DOB}
													isValid={formik.isValid}
													isTouched={formik.touched.DOB}
													invalidFeedback={formik.errors.DOB}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
										<div className='col-lg-6'>
											<FormGroup
												id='Cros'
												label='Cros'
												isFloating>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.Cros}
													isValid={formik.isValid}
													isTouched={formik.touched.Cros}
													invalidFeedback={formik.errors.Cros}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
										<div className='col-lg-6'>
											<FormGroup
												id='FilingDistrict'
												label='Filing District'
												isFloating>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.FilingDistrict}
													isValid={formik.isValid}
													isTouched={formik.touched.FilingDistrict}
													invalidFeedback={formik.errors.FilingDistrict}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
										<div className='col-lg-6'>
											<FormGroup
												id='CourtRoomNo'
												label='Court Room No'
												isFloating>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.CourtRoomNo}
													isValid={formik.isValid}
													isTouched={formik.touched.CourtRoomNo}
													invalidFeedback={formik.errors.CourtRoomNo}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
										<div className='col-lg-6'>
											<FormGroup
												id='CourtDepartment'
												label='Court Department'
												isFloating>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.CourtDepartment}
													isValid={formik.isValid}
													isTouched={formik.touched.CourtDepartment}
													invalidFeedback={formik.errors.CourtDepartment}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
										<div className='col-lg-6'>
											<FormGroup
												id='CourtDepartment'
												label=''
												>
														<Select
  options={representOptions}
  placeholder="Choose Represents..."
  value={
    formik.values.Representing
      ? representOptions.find((option: any) => option.value === parseInt(formik.values.Representing)) || 
        { label: formik.values.Representing, value: formik.values.Representing }
      : null // Ensures placeholder appears when no value is selected
  }
  onChange={(selectedOption) =>
    formik.setFieldValue(`Representing`, selectedOption?.value)
  }
  styles={customStyles} // Optional: Apply custom styles
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
												<div className='col-12'>
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
															checked={formik.values.recordTypeEntity.continuous_trauma || false}
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
												{/* <th>Represents</th> */}
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
                    <td>{ item?.PartyName?.value || item?.PartyName || "N/A"}</td>
                    <td>{item.PartyType}</td>
                    {/* <td>{item.RepresentID}</td> */}
                    <td>{item.PartyPhone}</td>
                    {/* <td>{item.attorney}</td> */}
                    <td>{item.InsuranceClaim}</td>
                    <td>{item.InsuranceAdjuster}</td>
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
                    <td>{item?.LocationName.value || item?.LocationName || "N/A"}</td>
                    <td>{item?.LocationAddress}</td>
                    <td>{item?.LocationCity}</td>
                    <td>{item?.LocationState}</td>
                    <td>{item?.LocationZip}</td>
                    {/* <td>{item?.ProcessType}</td>
                    <td>{item?.RecordType}</td>
                    <td>{item?.Action}</td> */}
					 <td>{item?.Proctype?.procname || item?.ProcessType || "N/A"}</td>
                    <td>{item?.Supword?.Word_Name || item?.RecordType || "NA"}</td>
                    <td>{item?.ProcAction?.Action || item?.Action || "N/A"}</td>
                    <td>{item?.Note}</td>
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
        formik.setFieldValue(`participants[${index}].PartyName`, option);
		formik.setFieldValue(`participants[${index}].PartyAddress`, option?.address || "");
        formik.setFieldValue(`participants[${index}].PartyCity`, option?.city || "");
        formik.setFieldValue(`participants[${index}].PartyState`, option?.state || "");
        formik.setFieldValue(`participants[${index}].PartyZip`, option?.zip || "");}
    } // Store entire object
    onBlur={formik.handleBlur}
	value={formik.values.participants?.[index]?.PartyName || null}
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
    formik.values.participants?.[index]?.PartyType
      ? participantsType.find(option => option.value === formik.values.participants[index]?.PartyType) || 
        { label: formik.values.participants[index]?.PartyType, value: formik.values.participants[index]?.PartyType }
      : null // Ensure placeholder appears when no value is selected
  }
  onChange={(selectedOption) =>
    formik.setFieldValue(`participants[${index}].PartyType`, selectedOption?.value)
  }
  onBlur={() => formik.setFieldTouched(`participants[${index}].PartyType`, true)}
  styles={customStyles} // Optional: Apply custom styles
/>

        {/* {formik.touched.participants?.[index]?.type && formik.errors.participants?.[index]?.type ? (
          <div className="invalid-feedback">{formik.errors.participants[index].type}</div>
        ) : (
          <div className="valid-feedback">Looks good!</div>
        )} */}
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
  options={representOptions}
  placeholder="Choose Represents..."
  value={
    formik.values.participants?.[index]?.RepresentID
      ? representOptions.find(option => option.value === parseInt(formik.values.participants[index]?.RepresentID)) || 
        { label: formik.values.participants[index]?.RepresentID, value: formik.values.participants[index]?.RepresentID }
      : null // Ensures placeholder appears when no value is selected
  }
  onChange={(selectedOption) =>
    formik.setFieldValue(`participants[${index}].RepresentID`, selectedOption?.value)
  }
  onBlur={() => formik.setFieldTouched(`participants[${index}].RepresentID`, true)}
  styles={customStyles} // Optional: Apply custom styles
/>

      {/* {formik.touched.participants?.[index]?.represents &&
      formik.errors.participants?.[index]?.represents ? (
        <div className="invalid-feedback">{formik.errors.participants[index].represents}</div>
      ) : (
        <div className="valid-feedback">Looks good!</div>
      )} */}
    </FormGroup>
									</div>
									<div className='col-12'>
										<FormGroup id='phone' label='Phone' isFloating>
                                        <Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        formik.setFieldValue(`participants[${index}].PartyPhone`, e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={p.PartyPhone}
                        isValid={formik.isValid}
                        // isTouched={formik.touched.participants?.[index]?.phone}
                        // invalidFeedback={formik.errors.participants?.[index]?.phone}
													validFeedback='Looks good!'
												/>
										</FormGroup>
									</div>
									<div className='col-12'>
										<FormGroup id='date' label='Address' isFloating>
                                        <Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        formik.setFieldValue(`participants[${index}].PartyAddress`, e.target.value)
                                                    }
													onBlur={formik.handleBlur}
                                                    value={p.PartyAddress}
                                                    isValid={formik.isValid}
                                                    // isTouched={formik.touched.participants?.[index]?.address}
                                                    // invalidFeedback={formik.errors.participants?.[index]?.address}
                                                                                validFeedback='Looks good!'
												/>
										</FormGroup>
									</div>
                                    <div className='col-6'>
										<FormGroup id='time' label='City' isFloating>
                                        <Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        formik.setFieldValue(`participants[${index}].PartyCity`, e.target.value)
                                                    }
													onBlur={formik.handleBlur}
                                                    value={p.PartyCity}
                                                    isValid={formik.isValid}
                                                    // isTouched={formik.touched.participants?.[index]?.city}
                                                    // invalidFeedback={formik.errors.participants?.[index]?.city}
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
    formik.values.participants?.[index]?.PartyState
      ? stateOptions.find(option => option.value === formik.values.participants[index]?.PartyState) || 
        { label: formik.values.participants[index]?.PartyState, value: formik.values.participants[index]?.PartyState }
      : null // Ensures placeholder appears when no value is selected
  }
  onChange={(selectedOption) => 
    formik.setFieldValue(`participants[${index}].PartyState`, selectedOption?.value)
  }
  onBlur={() => formik.setFieldTouched(`participants[${index}].PartyState`, true)}
  styles={customStyles} // Optional: Apply custom styles
/>
{/* 
        {formik.touched.participants?.[index]?.state && formik.errors.participants?.[index]?.state ? (
          <div className="invalid-feedback">{formik.errors.participants[index].state}</div>
        ) : (
          <div className="valid-feedback">Looks good!</div>
        )} */}
      </FormGroup>
    </div>
										<div className='col-md-3'>
											<FormGroup id='zip' label='Zip' isFloating>
												<Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        formik.setFieldValue(`participants[${index}].PartyZip`, e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={p.PartyZip}
                                                    isValid={formik.isValid}
                                                    // isTouched={formik.touched.participants?.[index]?.zip}
                                                    // invalidFeedback={formik.errors.participants?.[index]?.zip}
                                                                                validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
                                        <div className='col-12'>
										<FormGroup id='time' label='Attorney' isFloating>
                                        <Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        formik.setFieldValue(`participants[${index}].OpposingAttorney`, e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={p.OpposingAttorney}
                                                    isValid={formik.isValid}
                                                    // isTouched={formik.touched.participants?.[index]?.attorney}
                                                    // invalidFeedback={formik.errors.participants?.[index]?.attorney}
                                                                                validFeedback='Looks good!'
												/>
										</FormGroup>
									</div>
                                    <div className='col-6'>
										<FormGroup id='time' label='Claim' isFloating>
                                        <Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        formik.setFieldValue(`participants[${index}].InsuranceClaim`, e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={p.InsuranceClaim}
                                                    isValid={formik.isValid}
                                                    // isTouched={formik.touched.participants?.[index]?.claim}
                                                    // invalidFeedback={formik.errors.participants?.[index]?.claim}
                                                                                validFeedback='Looks good!'
												/>
										</FormGroup>
									</div>
                                    <div className='col-6'>
										<FormGroup id='time' label='Adjustor' isFloating>
                                        <Input
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        formik.setFieldValue(`participants[${index}].InsuranceAdjuster`, e.target.value)
                                                    }
													onBlur={formik.handleBlur}
													value={p.InsuranceAdjuster}
                                                    isValid={formik.isValid}
                                                    // isTouched={formik.touched.participants?.[index]?.adjuster}
                                                    // invalidFeedback={formik.errors.participants?.[index]?.adjuster}
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
                                                            formik.setFieldValue(`participants[${index}].Note`, e.target.value)
                                                        }
														value={p.Note}
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
        formik.setFieldValue(`documentLocation[${index}].LocationName`, option);
		formik.setFieldValue(`documentLocation[${index}].LocationAddress`, option?.address || "");
        formik.setFieldValue(`documentLocation[${index}].LocationCity`, option?.city || "");
        formik.setFieldValue(`documentLocation[${index}].LocationState`, option?.state || "");
        formik.setFieldValue(`documentLocation[${index}].LocationZip`, option?.zip || "");}
    } // Store entire object
    onBlur={formik.handleBlur}
    value={formik?.values?.documentLocation?.[index]?.LocationName || null} // Ensure it's an object or null
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
                    onChange={(e: any) =>
                        formik.setFieldValue(`documentLocation[${index}].LocationAddress`, e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    value={d.LocationAddress}
                    isValid={formik.isValid}
                    // isTouched={formik.touched.documentLocation?.[index]?.address}
                    // invalidFeedback={formik.errors.documentLocation?.[index]?.address}
                    validFeedback="Looks good!"
                />
            </FormGroup>
        </div>

        <div className="col-6">
            <FormGroup id="city" label="City" isFloating>
                <Input
                    type="text"
                    onChange={(e: any) =>
                        formik.setFieldValue(`documentLocation[${index}].LocationCity`, e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    value={d.LocationCity}
                    isValid={formik.isValid}
                    // isTouched={formik.touched.documentLocation?.[index]?.city}
                    // invalidFeedback={formik.errors.documentLocation?.[index]?.city}
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
    formik.values.documentLocation?.[index]?.LocationState
      ? stateOptions.find(option => option.value === formik.values.documentLocation[index]?.LocationState) || 
        { label: formik.values.documentLocation[index]?.LocationState, value: formik.values.documentLocation[index]?.LocationState }
      : null // Ensures placeholder appears when no value is selected
  }
  onChange={(selectedOption) => 
    formik.setFieldValue(`documentLocation[${index}].LocationState`, selectedOption?.value)
  }
  onBlur={() => formik.setFieldTouched(`documentLocation[${index}].LocationState`, true)}
  styles={customStyles} // Optional: Apply custom styles
/>
{/* 
        {formik.touched.documentLocation?.[index]?.state &&
        formik.errors.documentLocation?.[index]?.state ? (
          <div className="invalid-feedback">{formik.errors.documentLocation[index].state}</div>
        ) : (
          <div className="valid-feedback">Looks good!</div>
        )} */}
      </FormGroup>
    </div>

        <div className="col-md-3">
            <FormGroup id="zip" label="Zip" isFloating>
                <Input
                    type="text"
                    onChange={(e: any) =>
                        formik.setFieldValue(`documentLocation[${index}].LocationZip`, e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    value={d.LocationZip}
                    isValid={formik.isValid}
                    // isTouched={formik.touched.documentLocation?.[index]?.zip}
                    // invalidFeedback={formik.errors.documentLocation?.[index]?.zip}
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
    formik?.values?.documentLocation?.[index]?.ProcessType
      ? processTypeOptions.find((option: any) => option.value === parseInt(formik.values.documentLocation[index]?.ProcessType)) || 
        { label: formik.values.documentLocation[index]?.ProcessType, value: formik.values.documentLocation[index]?.ProcessType }
      : null // Ensures placeholder appears when no value is selected
  }
  onChange={(selectedOption) => 
    formik.setFieldValue(`documentLocation[${index}].ProcessType`, selectedOption?.value)
  }
  onBlur={() => formik.setFieldTouched(`documentLocation[${index}].ProcessType`, true)}
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
    formik?.values?.documentLocation?.[index]?.RecordType
      ? recordTypeOption.find(option => option.value === parseInt(formik.values.documentLocation[index]?.RecordType)) || 
        { label: formik.values.documentLocation[index]?.RecordType, value: formik.values.documentLocation[index]?.RecordType }
      : null // Ensures placeholder appears when no value is selected
  }
  onChange={(selectedOption) => 
    formik.setFieldValue(`documentLocation[${index}].RecordType`, selectedOption?.value)
  }
  onBlur={() => formik.setFieldTouched(`documentLocation[${index}].RecordType`, true)}
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
    formik?.values?.documentLocation?.[index]?.Action
      ? actionOptions.find(option => option.value === parseInt(formik.values.documentLocation[index]?.Action)) || 
        { label: formik.values.documentLocation[index]?.Action, value: formik.values.documentLocation[index]?.Action }
      : null // Ensures placeholder appears when no value is selected
  }
  onChange={(selectedOption) => 
    formik.setFieldValue(`documentLocation[${index}].Action`, selectedOption?.value)
  }
  onBlur={() => formik.setFieldTouched(`documentLocation[${index}].Action`, true)}
  styles={customStyles} // Optional: Apply custom styles
/>
            </FormGroup>
        </div>

        <div className="col-12">
            <FormGroup id="note" label="Note" isFloating>
                <Input
                    type="text"
                    onChange={(e: any) =>
                        formik.setFieldValue(`documentLocation[${index}].Note`, e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    value={d.Note}
                    isValid={formik.isValid}
                    // isTouched={formik.touched.documentLocation?.[index]?.note}
                    // invalidFeedback={formik.errors.documentLocation?.[index]?.note}
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
                        checked={d.CopyForReview}
                        onChange={(e) =>
                            formik.setFieldValue(`documentLocation[${index}].CopyForReview`, e.target.checked)
                        }
                    />
                    <label className="form-check-label" htmlFor={`CopyForReview-${index}`}>
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
  {/* <FormGroup id="files" label="Document Upload">
    <Input
      type="file"
      multiple
      onChange={(e: any) => handleFileChange(e, index)}
      onBlur={formik.handleBlur}
      isValid={formik.isValid}
    //   isTouched={formik.touched.documentLocation?.[index]?.files}
    //   invalidFeedback={formik.errors.documentLocation?.[index]?.files}
      validFeedback="Looks good!"
    />
  </FormGroup> */}
  <FormGroup id="files" label="Document Upload">
  <div
  onClick={() => document.getElementById(`file-upload-${index}`)?.click()}
    className={`dropzone ${formik.touched.documentLocation?.[index]?.files ? 'is-touched' : ''} ${
      formik.errors.documentLocation?.[index]?.files ? 'is-invalid' : ''
    }`}
    onDragOver={(e) => {
      e.preventDefault()
      e.stopPropagation()
      e.currentTarget.classList.add('dragover')
    }}
    onDragLeave={(e) => {
      e.preventDefault()
      e.stopPropagation()
      e.currentTarget.classList.remove('dragover')
    }}
    onDrop={(e) => {
      e.preventDefault()
      e.stopPropagation()
      e.currentTarget.classList.remove('dragover')
      const files = Array.from(e.dataTransfer.files)
      handleFileChange({ target: { files } }, index)
    }}
  >
    <div className="dropzone-content">
      {/* <CloudUpload size={48} className="text-primary" /> */}
      <div className="mt-2">
        Drag & drop files here or <span className="text-primary">browse</span>
      </div>
      {/* <small className="text-muted">Supports: PDF, DOCX, JPG, PNG </small> */}
    </div>
    <input
      type="file"
      multiple
      onChange={(e) => handleFileChange(e, index)}
      onBlur={formik.handleBlur}
      className="d-none"
      id={`file-upload-${index}`}
    />
  </div>
  
  {/* Display selected files */}
  {/* {formik.values.documentLocation?.[index]?.files?.length > 0 && (
    <div className="mt-3">
      <h6>Selected Files:</h6>
      <ul className="list-group">
        {Array.from(formik.values.documentLocation[index].files).map((file, i) => (
          <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{file.name}</span>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => {
                const newFiles = [...formik.values.documentLocation[index].files]
                newFiles.splice(i, 1)
                formik.setFieldValue(`documentLocation.${index}.files`, newFiles)
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )} */}
</FormGroup>
  {loading[index] && (
        <div className="text-center my-2">
          <Spinner isGrow variant="primary" />
          <p>Uploading...</p>
        </div>
      )}
  {/* Display uploaded files */}
  {formik.values.documentLocation[index]?.DocFilePath && (
    <div className="mt-2">
      <h6>Uploaded Files:</h6>
      <ul>
	{/* {(formik?.values?.documentLocation?.[index]?.DocFilePath) 
  ? formik.values.documentLocation[index].DocFilePath 
  : ""
)?.map((fileUrl: string, i: number) => ( */}
  <li >
    <a href={formik.values.documentLocation[index].DocFilePath} target="_blank" rel="noopener noreferrer">
      {decodeURIComponent(formik.values.documentLocation[index].DocFilePath.split("/").pop() || "File")}
	  
    </a>
	{/* <Button
	icon='cancel'
	isOutline
            type="submit"
            onClick={() => {
              const updatedFiles = formik.values.documentLocation[index].DocFilePath.filter(
                (_: string, fileIndex: number) => fileIndex !== i
              );
              formik.setFieldValue(`documentLocation[${index}].DocFilePath`, updatedFiles);
            }}
            className="text-red-500 hover:underline"
          >
            Remove
          </Button> */}
  </li>
{/* ))} */}


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
