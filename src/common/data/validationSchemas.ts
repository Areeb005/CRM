import * as Yup from 'yup';

// Step 1 Validation Schema
export const step1Schema = Yup.object().shape({
  attonyName: Yup.string().required('Attorney Name is required'),
  firmName: Yup.string().required('Firm Name is required'),
  emailAddress: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string().required('Phone Number is required'),
  addressLine: Yup.string().required('Address Line is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zip: Yup.string().required('Zip is required'),
});

// Step 2 Validation Schema
 export const step2Schema = Yup.object().shape({
  caseType: Yup.string().required('Case Type is required'),
  caseName: Yup.string().required('Case Name is required'),
  billTo: Yup.string().required('Bill To is required'),
  caseNumber: Yup.string().required('Case Number is required'),
  
  courtName: Yup.string().required('Court Name is required'),
  CourtAddress: Yup.string().required('Court Address is required'),
  CourtCity: Yup.string().required('Court City is required'),
  CourtState: Yup.string().required('Court State is required'),
  CourtZip: Yup.string().required('Court Zip is required'),
});

// Step 3 Validation Schema
export const step3Schema = Yup.object().shape({
  recordTypePerson: Yup.object().shape({
    firstName: Yup.string().when('person', {
      is: true,
      then: Yup.string().required('First Name is required'),
    }),
    lastName: Yup.string().when('person', {
      is: true,
      then: Yup.string().required('Last Name is required'),
    }),
    SSN: Yup.string().when('person', {
      is: true,
      then: Yup.string().required('SSN is required'),
    }),
  }),
  recordTypeEntity: Yup.object().shape({
    name: Yup.string().when('entity', {
      is: true,
      then: Yup.string().required('Entity Name is required'),
    }),
  }),
});

export const states = [
    { value: "AL", text: "Alabama" },
    { value: "AK", text: "Alaska" },
    { value: "AZ", text: "Arizona" },
    { value: "AR", text: "Arkansas" },
    { value: "CA", text: "California" },
    { value: "CO", text: "Colorado" },
    { value: "CT", text: "Connecticut" },
    { value: "DE", text: "Delaware" },
    { value: "DC", text: "District of Columbia" },
    { value: "FL", text: "Florida" },
    { value: "GA", text: "Georgia" },
    { value: "HI", text: "Hawaii" },
    { value: "ID", text: "Idaho" },
    { value: "IL", text: "Illinois" },
    { value: "IN", text: "Indiana" },
    { value: "IA", text: "Iowa" },
    { value: "KS", text: "Kansas" },
    { value: "KY", text: "Kentucky" },
    { value: "LA", text: "Louisiana" },
    { value: "ME", text: "Maine" },
    { value: "MD", text: "Maryland" },
    { value: "MA", text: "Massachusetts" },
    { value: "MI", text: "Michigan" },
    { value: "MN", text: "Minnesota" },
    { value: "MS", text: "Mississippi" },
    { value: "MO", text: "Missouri" },
    { value: "MT", text: "Montana" },
    { value: "NE", text: "Nebraska" },
    { value: "NV", text: "Nevada" },
    { value: "NH", text: "New Hampshire" },
    { value: "NJ", text: "New Jersey" },
    { value: "NM", text: "New Mexico" },
    { value: "NY", text: "New York" },
    { value: "NC", text: "North Carolina" },
    { value: "ND", text: "North Dakota" },
    { value: "OH", text: "Ohio" },
    { value: "OK", text: "Oklahoma" },
    { value: "OR", text: "Oregon" },
    { value: "PA", text: "Pennsylvania" },
    { value: "RI", text: "Rhode Island" },
    { value: "SC", text: "South Carolina" },
    { value: "SD", text: "South Dakota" },
    { value: "TN", text: "Tennessee" },
    { value: "TX", text: "Texas" },
    { value: "UT", text: "Utah" },
    { value: "VT", text: "Vermont" },
    { value: "VA", text: "Virginia" },
    { value: "WA", text: "Washington" },
    { value: "WV", text: "West Virginia" },
    { value: "WI", text: "Wisconsin" },
    { value: "WY", text: "Wyoming" }
  ];
  
  export const processType = [
    "Arranged Job (For Production Of Records)",
    "Authorization",
    "Civil Arbitration CCP 1011 At Law Firm",
    "Civil Arbitration CCP 1011 At Residence",
    "Civil CCP 1011 At Law Firm",
    "Civil CCP 1011 At Residence",
    "Double Sealed To A Civil Arbitration",
    "Double Sealed To A Federal Arbitration",
    "Double Sealed To Court",
    "Entity- To Appear At A Deposition",
    "Entity- To Appear With Records At A Deposition",
    "Federal Arbitration CCP 1011",
    "Federal CCP 1011",
    "Index Search",
    "Individual- To Appear At A Deposition",
    "Individual- To Appear With Records At A Deposition",
    "Interpreter",
    "Notice Of Deposition For Records",
    "Personal Appearance With Records At W.C.A.B",
    "Personal Appearance At A Trial",
    "Personal Appearance With Records At A Trial",
    "Subpoena For Records",
    "Subpoena Double Sealed To Court",
    "Subpoena To Appear At A Deposition",
    "Subpoena To Appear At A Trial",
  ];

  export const caseOptions = [
    { value: "ARRANGED JOB", label: "ARRANGED JOB" },
    { value: "CIVIL", label: "CIVIL" },
    { value: "CIVIL ARBITRATION", label: "CIVIL ARBITRATION" },
    { value: "FEDERAL", label: "FEDERAL" },
    { value: "FEDERAL ARBITRATION", label: "FEDERAL ARBITRATION" },
    { value: "INTERPRETER", label: "INTERPRETER" },
    { value: "UNINSURED MOTORIST", label: "UNINSURED MOTORIST" },
    { value: "W.C.A.B", label: "W.C.A.B" },
  ];
  

export const customStyles = {
	control: (base: any) => ({
		...base,
		backgroundColor: '#f8f9fa', // Light gray background
		border: '1px solid #e0e0e0', // Light border
		borderRadius: '10px', // Rounded corners
		boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.075)', // Remove default shadow
		padding: '3px 5px', // Add padding
		textTransform: 'capitalize',
		fontWeight: 600, // Added font weight
		'&:hover': {
			border: '1px solid #bbb', // Slightly darker border on hover
		},
	}),
	placeholder: (base: any) => ({
		...base,
		color: '#737b83', // Placeholder text color
		fontSize: '1rem',
		fontWeight: 500, // Added font weight
		fontFamily: '"Poppins", sans-serif',
	}),
	singleValue: (base: any) => ({
		...base,
		color: '#323232', // Selected value text color
		fontWeight: 600, // Added font weight
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
		color: '#323232',
		// fontWeight: 600, // Ensuring font weight in dropdown options
		cursor: 'pointer',
		'&:active': {
			backgroundColor: '#eaeaea', // Slightly darker gray when clicked
		},
	}),
};

export const participantsType = [
    { value: "OpposingCounsel", label: "Opposing Counsel" },
    { value: "Insurance", label: "Insurance Company" },
    { value: "Employer", label: "Employer" },
    { value: "Other", label: "Other" },
  ];

 export  const representsOptions = [
    { value: 1, label: "Defendant" },
    { value: 2, label: "Plaintiff" },
    { value: 3, label: "Petitioner" },
    { value: 4, label: "Respondent" },
    { value: 5, label: "Defendant & Cross Complaintant" },
    { value: 6, label: "Plaintiff & Cross Defendant" },
    { value: 7, label: "Defendant In Et Al" },
    { value: 8, label: "Plaintiff In Et Al" },
    { value: 9, label: "Petitioner In Et AL" },
    { value: 10, label: "Respondent In Et AL" },
  ];