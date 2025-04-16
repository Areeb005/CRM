import React, { useEffect, useState } from 'react';

import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';
import Popovers from '../../../components/bootstrap/Popovers';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Papa from "papaparse";
import Icon from '../../../components/icon/Icon';

import Avatar from '../../../components/Avatar';
import Checks from '../../../components/bootstrap/forms/Checks';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useCancelOrderMutation, useCompleteOrderMutation, useCreateBulkOrderMutation, useDeleteOrderMutation, useDeleteOrdersMutation, useGetOrdersQuery } from '../../../features/users';
import dayjs from 'dayjs';
import Swal from "sweetalert2";
import Spinner from '../../../components/bootstrap/Spinner';
import Alert from '../../../components/bootstrap/Alert';
import PaginationButtons from '../../../components/PaginationButtons';
import Dropdown, { DropdownItem, DropdownMenu, DropdownToggle } from '../../../components/bootstrap/Dropdown';
import showNotification from '../../../components/extras/showNotification';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';


const OrderPage = () => {
	const navigate = useNavigate();
	const [showAllStatus, setShowAllStatus] = React.useState(false);
	const user = useSelector((state: RootState) => state?.auth?.user)
	const [searchModalStatus, setSearchModalStatus] = useState(false);
	const [createBulkOrders, {isLoading: orderBulkLoading}] = useCreateBulkOrderMutation()
	const [csvData, setCsvData] = useState<any[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
		const [perPage, setPerPage] = useState(10);
		const [updateOrder, {isLoading: UpdateLoading}] = useDeleteOrderMutation()
		const [inputVal, setInputVal] = useState('');
		const {
			data: orderData,
			isFetching,
			isLoading: orderLoading,
			refetch,
		} = useGetOrdersQuery({
			page: currentPage,
		limit: perPage,
		});
	console.log(orderData)
const [filteredData, setFilteredData] = useState(orderData?.order || []);
const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

    const toggleAccordion = (orderId: any) => {
		console.log(orderId)
        setExpandedOrder(expandedOrder === orderId?.OrderID ? null : orderId?.OrderID);
    };


useEffect(() => {
  if (!inputVal) {
    setFilteredData(orderData?.orders); // Reset if input is empty
    return;
  }

  // Filter logic (case insensitive search)
  const lowerCaseInput = inputVal.toLowerCase();
  const filtered = orderData?.orders?.filter((order: any) =>
    order.CourtName.toLowerCase().includes(lowerCaseInput) ||
    order.CaseNumber.toLowerCase().includes(lowerCaseInput) ||
    order.FileNumber.toLowerCase().includes(lowerCaseInput) ||
    dayjs(order.NeededBy).format("MMMM D, YYYY").toLowerCase().includes(lowerCaseInput)
  );

  setFilteredData(filtered);
}, [inputVal, orderData]);
	
	

	const [cancelOrder] = useCancelOrderMutation();
	const [deleteOrder] = useDeleteOrdersMutation();
	const [completeOrder, {isLoading: completOrderLoading}] = useCompleteOrderMutation();

  const handleCancelled = async (orderId: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Cancelled it!",
    });

    if (result.isConfirmed) {
      try {
        await cancelOrder(orderId).unwrap(); // Call RTK mutation
        Swal.fire("Cancelled!", "The order has been Cancelled.", "success");
		refetch()
      } catch (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  const handleComplete = async (orderId: string) => {
	
	if (!orderId) return;
  
	try {
	  const response = await completeOrder(orderId).unwrap();
	  console.log("Order marked as completed:", response);
	  refetch()
	  showNotification(
						  <span className='d-flex align-items-center'>
							<Icon icon='CheckCircle' size='lg' className='me-1' />
							<span>Success!</span>
						  </span>,
						  "Order has been Completed successfully",
						  'success',
						);
					  
	} catch (error: any) {
	  console.error("Error completing order:", error);
	  showNotification(
					  <span className='d-flex align-items-center'>
						<Icon icon='Error' size='lg' className='me-1' />
						<span>Error!</span>
					  </span>,
					  error?.data?.error,
					  'danger',
					);
	}
  };
  const handleDelete = async (orderId: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteOrder(orderId).unwrap(); // Call RTK mutation
        Swal.fire("Deletd!", "The order has been Deleted.", "success");
		refetch()
      } catch (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  useEffect(()=>{
      refetch()
  },[])

  const headers = [
	"Order By", "Needed By", "Case Type", "Case Name", "File Number", "Case Number",
	"Court Name", "Court Address", "Court City", "Court State", "Court Zip", "Bill To",
	"Record Type", "First Name", "Last Name", "AKA", "SSN", "Injury Date From", "Injury Date To",
	"Record Address", "Record City", "Record State", "Record Zip", "Participant Type", "Participant",
	"Attorney", "Represents", "Phone", "Participant Address", "Participant City", "Participant State",
	"Participant Zip", "Claim", "Adjuster", "Participant Note", "Document Name", "Document Address",
	"Document City", "Document State", "Document Zip", "Process Type", "Record Type", "Action", "Files", "Document Note"
  ];

  const sampleData = [headers.join(",")];
  const dummyRows = [
	["mozepo", "2025-03-10", "Civil", "Case A", "12345", "67890", "Supreme Court", "123 Court St", "New York", "NY", "10001", "XYZ Law Firm", "Medical", "Alice", "Smith", "N/A", "123-45-6789", "2024-01-01", "2024-01-10", "456 Record St", "Los Angeles", "CA", "90001", "Witness", "Bob Johnson", "ABC Law", "Plaintiff", "555-1234", "789 Part St", "San Francisco", "CA", "94105", "Claim 101", "Jane Adjuster", "No Notes", "Doc1.pdf", "111 Doc St", "Chicago", "IL", "60601", "Standard", "Medical", "Approved", "https://example.com/files/file1.pdf", "No Remarks"],
	["mozepo", "2025-04-15", "Criminal", "Case B", "54321", "09876", "High Court", "456 Court Ave", "Los Angeles", "CA", "90002", "ABC Law Firm", "Legal", "Bob", "Brown", "N/A", "987-65-4321", "2024-02-15", "2024-02-20", "789 Record Ave", "San Diego", "CA", "92101", "Defendant", "Charlie Green", "XYZ Law", "Defendant", "555-5678", "456 Part Ave", "Boston", "MA", "02108", "Claim 202", "Mike Adjuster", "Confidential", "Doc2.pdf", "222 Doc Ave", "Miami", "FL", "33101", "Urgent", "Legal", "Pending", "https://example.com/files/file1.pdf", "Under Review"],
	["mozepo", "2025-05-20", "Family", "Case C", "67890", "11223", "District Court", "789 Court Blvd", "Chicago", "IL", "60602", "DEF Law Firm", "Custody", "Charlie", "Davis", "N/A", "111-22-3333", "2024-03-05", "2024-03-15", "333 Record Blvd", "Houston", "TX", "77002", "Parent", "Emma White", "LMN Law", "Guardian", "555-7890", "333 Part Blvd", "Seattle", "WA", "98101", "Claim 303", "Nancy Adjuster", "Reviewed", "Doc3.pdf", "333 Doc Blvd", "Atlanta", "GA", "30301", "Expedited", "Custody", "Completed", "https://example.com/files/file1.pdf", "Reviewed"],
	["mozepo", "2025-06-25", "Bankruptcy", "Case D", "11122", "44556", "Federal Court", "222 Court St", "Houston", "TX", "77003", "GHI Law Firm", "Financial", "Daniel", "Lee", "N/A", "444-55-6666", "2024-04-10", "2024-04-18", "444 Record St", "Phoenix", "AZ", "85001", "Debtor", "Frank Black", "OPQ Law", "Client", "555-3456", "444 Part St", "Denver", "CO", "80201", "Claim 404", "Olivia Adjuster", "Awaiting Review", "Doc4.pdf", "444 Doc St", "Dallas", "TX", "75201", "Normal", "Financial", "In Progress", "https://example.com/files/file1.pdf", "Pending"],
  ];
  
  // Convert each row to CSV format and add it to `sampleData`
  dummyRows.forEach(row => sampleData.push(row.join(",")));
  const handleDownloadSample = () => {
	const blob = new Blob([sampleData.join("\n")], { type: "text/csv" });
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = "sample_case_data.csv";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (result) => {
        setCsvData(result.data as any[]);
      },
      header: true,
      skipEmptyLines: true,
    });
  };
 const handleSubmitOrders =  async()=>{
	const transformCSVData = (csvData: any[]) => {
		return csvData.map((data) => ({
		  order_by: data["Order By"] || "",
		  urgent: false,
		  needed_by: data["Needed By"] || null,
		  case_type: data["Case Type"] || "",
		  case_name: data["Case Name"] || "",
		  file_number: data["File Number"] || "",
		  case_number: data["Case Number"] || "",
		  court_name: data["Court Name"] || "",
		  court_address: data["Court Address"] || "",
		  court_city: data["Court City"] || "",
		  court_state: data["Court State"] || "",
		  court_zip: data["Court Zip"] || "",
		  record_details: {
			record_type: "Person", // Assuming it's always a person
			first_name: data["First Name"] || "",
			last_name: data["Last Name"] || "",
			aka: data["AKA"] || "",
			ssn: data["SSN"] || "",
			date_of_injury: {
			  from: data["Injury Date From"] || "",
			  to: data["Injury Date To"] || "",
			},
			record_address: data["Record Address"] || "",
			record_city: data["Record City"] || "",
			record_state: data["Record State"] || "",
			record_zip: data["Record Zip"] || "",
		  },
		  bill_to: data["Bill To"] || "",
		  participants: [
			{
				participant: data["Participant"] || "",
				type: data["Participant Type"] || "",
			  attorney: data["Attorney"] || "",
			  represents: data["Represents"] || "",
			  phone: data["Phone"] || "",
			  address: data["Participant Address"] || "",
			  city: data["Participant City"] || "",
			  state: data["Participant State"] || "",
			  zip: data["Participant Zip"] || "",
			  claim: data["Claim"] || "",
			  adjuster: data["Adjuster"] || "",
			  note: data["Participant Note"] || "",
			},
		  ],
		  document_locations: [
			{
				name: data["Document Name"] || "",
			  address: data["Document Address"] || "",
			  city: data["Document City"] || "",
			  state: data["Document State"] || "",
			  zip: data["Document Zip"] || "",
			  process_type: data["Process Type"] || "",
			  record_type: data["Record Type"] || "",
			  action: data["Action"] || "",
			  review_request: data["Review Request"] === true,
			  files: data["Files"] ? [data["Files"]] : [],
			  note: data["Document Note"] || "",
			},
		  ],
		}));
	  };
	  const postDataArray = transformCSVData(csvData);
	  const dataToSend = {
		orders: postDataArray
	  }
	  console.log(postDataArray, "transformCSVData")
	  try {
		const response = await createBulkOrders(dataToSend).unwrap();
		console.log("Create Order Response:", response);
		// navigate('/order');
		refetch()
		setSearchModalStatus(false)
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
 const [showModal, setShowModal] = useState(false);
    
  if (orderLoading || completOrderLoading) {
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
			<Spinner isGrow color={"primary"} />
			<Spinner isGrow color={"primary"} />
		</div>
	);
}


	return (
		<PageWrapper title='Dashboard Page'>
			<SubHeader className='mt-4'>
				<SubHeaderLeft >
					{/* <Breadcrumb list={[{ title: 'Order', to: '/dashboard' }]} />
					<SubheaderSeparator />
					<span className='text-muted'>Orders</span> */}
				</SubHeaderLeft>
				<SubHeaderRight>
					<CardActions className='px-4'>
					<Input
      className="w-100 py-2 my-4 bg-white"
      type="text"
      ariaLabel="search"
      id="searchCampaign"
      value={inputVal}
      onChange={(e) => setInputVal(e.target.value)}
      placeholder="Search..."
    />
					</CardActions>
					<Button
						color='secondary'
						// isLight
						icon='Add'
						className='bg-gradient '
						onClick={() => navigate('/order/add-order')}>
						Add New
					</Button>
					
					{/* <Button color='info' isOutline icon='Save' >
							Save
						</Button> */}
				</SubHeaderRight>
			</SubHeader>
			<Page container='fluid'>
				<Card stretch>
					<CardHeader>
						<CardLabel icon='Cases' iconColor='primary'>
							<CardTitle tag='div' className='h4 fs-3'>
								Order
							</CardTitle>
						</CardLabel>
						<CardActions>
						{/* <Button
								onClick={() => setSearchModalStatus(true)}
								color='secondary'
								icon='CloudDownload'
								// isLight
								tag='a'
								className='bg-gradient '
								// to='/somefile.txt'
								target='_blank'
								// download
							>
								Bulk Add
							</Button> */}
						</CardActions>
					</CardHeader>
					<CardBody className='table-responsive'>
						<table className='table table-modern '>
							<thead className=''>
								<tr>
									<th></th>
									<th >
										Deadline
										
									</th>
									<th >
										Code
										
									</th>
									{/* {user?.Role === "Administrator" &&
									<th>Client</th>} */}
									<th>Case Name</th>
									<th>Case NO</th>
									<th>File NO</th>
									<th>Type</th>
									<th>Created on</th>
									<th>Injury Date</th>
									<th>Till</th>
									<th>Status</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
                            { filteredData && filteredData?.map((order: any, index: number) => {
								console.log(order?.OrderID)
								// const recordDetails = order?.TblOrderDocLocations ?  JSON?.parse(order?.TblOrderDocLocations) : []
								

								return(
									<>
                            <tr key={index}>
								   <td>
                                        <button
                                            className="btn btn-sm btn-light"
                                            onClick={() => toggleAccordion(order)}
                                        >
                                            {expandedOrder === order.OrderID ? "−" : "+"}
                                        </button>
                                    </td>
                                <td className='position-relative' style={{maxWidth:"200px" ,width:"200px"}}>
									{order.IsRush &&
                                <Icon
							icon='Circle'
							style={{left:"80%"}}
							className={classNames(
								'position-absolute  mx-2',
								'text-danger',
								'animate__animated animate__heartBeat animate__infinite animate__slower',
							)}
						/>}
						{order.NeededBy ? dayjs(order.NeededBy).format("MMMM D, YYYY") : "N/A"}
									</td>
                                <td>{order.OrderCode}</td>
								{/* {user?.Role === "Administrator" &&
                                <td>{order.orderByUser.username}</td>} */}
                                <td>{order.CaseName}</td>
                                <td>{order.CaseNumber}</td>
                                <td>{order.FileNumber}</td>
                                <td>{order.case_type}</td>
                                <td>{dayjs(order?.createdAt).format("MMM DD, YYYY HH:mm A")}</td>
                                <td>{dayjs(order?.record_details?.date_of_injury.from).format("MMMM D, YYYY")}</td>
                                <td>{dayjs(order?.record_details?.date_of_injury.to).format("MMMM D, YYYY")}</td>
                                <td>
                                    <span
                                        className={`badge ${
                                            order.RequestStatus === 'Completed'
                                                ? 'bg-success'
                                                : order.RequestStatus === 'Active'
                                                ? 'bg-secondary'
                                                : 'bg-danger'
                                        }`}
                                    >
                                        {order.RequestStatus}
                                    </span>
                                </td>
                                <td >
									<Dropdown className='d-inline'>
								<DropdownToggle hasIcon={false}>
									<Button
										color={"light"}
										icon='MoreVert'
										aria-label='More Actions'
									/>
								</DropdownToggle>
								<DropdownMenu isAlignmentEnd>
									<DropdownItem>
										<Button onClick={() => navigate("/order/add-order", { state: { itemId: order.OrderID } })} icon='Edit'>Edit</Button>
									</DropdownItem>
									<DropdownItem>
										<Button onClick={()=> navigate(`/order/${order.OrderID}`)} icon='RemoveRedEye'>View</Button>
									</DropdownItem>
									{order?.status !== "Cancelled" &&
									<DropdownItem>
										<Button onClick={()=>handleCancelled(order?.OrderID)} icon='Cancel'>Cancel</Button>
									</DropdownItem>}
                                     {user?.Role === "Administrator" &&
									<DropdownItem>
										<Button onClick={()=>handleDelete(order?.OrderID)} icon='Delete'>Delete</Button>
									</DropdownItem>}
									<DropdownItem>
										<Button  onClick={()=>handleComplete(order?.OrderID)} icon='TaskAlt'>Mark As Completed</Button>
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
                                 </td>

								 
                            </tr>

							{expandedOrder === order.OrderID && (
    <tr>
        <td colSpan={13}>
            <div className="accordion-content p-3 border rounded bg-light">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Process Type</th>
                            <th>Record Type</th>
                            <th>Action</th>
                            <th>Status</th>
                            <th>Files</th>
                            <th>Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order?.TblOrderDocLocations?.map((doc: any, docIndex: number) => {
							// const filesDataToShow = doc
							// ?.files?.map((it: any) => it?.dataValues?.files && JSON.parse(it.dataValues.files))
							// ?.filter(Boolean) ?? [];
							const filesDataToShow = `http://localhost:3000/api/uploads//1744485314579-23207316.png || http://localhost:3000/api/uploads//1744485314579-23207316.png`;
							

							const statusHistory = doc?.statusLogs ?? []; // assuming this holds your array
							const firstStatus = statusHistory[0]?.AStatus;
							const remainingStatuses = statusHistory.slice(1);

	console.log(filesDataToShow , "filesDataToShow")

							return(
                            <tr key={`doc-${order.id}-${docIndex}`}>
                                <td>{doc.LocationName}</td>
                                <td>{doc.LocationAddress}, {doc.LocationCity}, {doc.LocationState} {doc.LocationZip}</td>
                                <td>{doc.ProcessType}</td>
                                <td>{doc.RecordType}</td>
                                <td>{doc.Action}</td>
								<td>
      {/* First AStatus */}
      <span
        style={{
          background: "#e0e7ff",
          color: "#1e3a8a",
          fontWeight: "500",
          fontSize: "13px",
          padding: "4px 10px",
          borderRadius: "12px",
          display: "inline-block",
        }}
      >
        {doc?.statusLogs[0]?.AStatus || "N/A"}
      </span>

      {/* Toggle Button */}
      {doc?.statusLogs?.length > 0 && (
        <div style={{ marginTop: "6px" }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: "none",
              border: "none",
              color: "#2563eb",
              cursor: "pointer",
              fontSize: "12px",
              textDecoration: "underline",
            }}
          >
            + View History
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>Status History</h3>
            {doc?.statusLogs?.map((status, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: "14px",
                  marginBottom: "8px",
                  color: "#333",
                }}
              >
                <strong>{status.AStatus}</strong> <br />
                <span style={{ color: "#666", fontSize: "12px" }}>
                  {dayjs(status.StatDate).format("MMM D, YYYY - h:mm A")}
                </span>
              </div>
            ))}

            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: "12px",
                padding: "6px 12px",
                background: "#1e3a8a",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </td>
								{/* <td>{doc?.DocFilePath}</td> */}
                                <td> 
								{/* {doc?.DocFilePath ? (
    filesDataToShow.map((doc: any, docIndex: number) => {
        if (typeof doc !== "string") return null; // Ensure doc is a string before using split
        const fileName = doc.includes("/") ? doc.split("/").pop() : doc;

        return (
          
        );
    })
) : (
    <p>No files available</p>
)} */}
{doc?.CopyServiceFiles ? (
  doc?.CopyServiceFiles?.split('||').map((file: any, idx: any) => (
    <a
      key={`file-${idx}`}
      href={`${import.meta.env.VITE_BASE_URL}/uploads/${file}`}
      target="_blank"
      rel="noopener noreferrer"
      download
    >
      {file} <br />
    </a>
  ))
) : (
  "N/A"
)}


		</td>
                               
                                <td>{doc?.Note}</td>
                            </tr>

							
                        )})}
                    </tbody>
                </table>

                {/* Files Section */}

            </div>
        </td>
    </tr>
)}

</>
                        )})}
							</tbody>
							
						</table>

						{!filteredData?.length && 
							<Alert color='warning' isLight icon='Report' className=''>
							No Orders on database
						</Alert>}
					</CardBody>
					{filteredData?.length > 0 &&
					<PaginationButtons
						data={orderData?.order}
						label='items'
						setCurrentPage={setCurrentPage}
						currentPage={currentPage}
						perPage={perPage}
						setPerPage={setPerPage}
						totalPage={orderData?.totalPages}
						totalSites={orderData?.totalOrders}
					/>}
				</Card>

				{/* modal */}

				<Modal
					setIsOpen={setSearchModalStatus}
					isOpen={searchModalStatus}
					isStaticBackdrop
					isScrollable
					id='asasasasaaxzczxss'
					data-tour='search-modal'
					size={'xl'}>
					{/* <ModalHeader setIsOpen={setSearchModalStatus}>
						<ModalTitle id='bulkAddSites'>Bulk Add Sites</ModalTitle>
					</ModalHeader> */}
					<ModalBody>
						<>
							<div className='d-flex justify-content-end mb-4'>
								<Button
									className='d-flex align-items-center p-0' // Align items and remove padding
									onClick={handleDownloadSample}
									>
									<i className='bi bi-download me-2'></i>{' '}
									{/* Change this to 'fas fa-download' for Font Awesome */}
									Download Sample
								</Button>
							</div>
							<input
								id='file-input'
								style={{ display: 'none' }}
								type='file'
								accept='.csv'
								onChange={handleFileUpload}
								className='mb-3'
							/>
							<div
								onClick={() => document.getElementById('file-input')?.click()}
								className='file_input text-center'
								style={{
									cursor: 'pointer',
									border: '1px dashed #ededf5',
									borderRadius: '5px',
									width: '100%',
									height: '100px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#000',
									fontSize: '1rem',
									borderRight: '8px',
								}}>
								Click here to upload CSV File
							</div>

							{csvData.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Preview Uploaded Data</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                {Object.keys(csvData[0])?.map((header, index) => (
                  <th key={index} className="border p-2">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData?.map((row, rowIndex) => (
                <tr key={rowIndex} className="border">
                  {Object.values(row).map((value, colIndex) => (
                    <td key={colIndex} className="border p-2">{value as string}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
						</>
					</ModalBody>
					<ModalFooter>
						<>
						<Button onClick={handleSubmitOrders} isDisable={orderBulkLoading} color='secondary'>
							{orderBulkLoading ? <Spinner isGrow isSmall /> : "Submit"}
						</Button>
						<Button onClick={()=> setCsvData([])}  color='secondary'>
							Clear
						</Button>
						</>
					</ModalFooter>
				</Modal>
			</Page>
		</PageWrapper>
	);
};

export default OrderPage;
