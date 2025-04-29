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

import Icon from '../../../components/icon/Icon';

import Avatar from '../../../components/Avatar';
import Checks from '../../../components/bootstrap/forms/Checks';
import { useNavigate } from 'react-router-dom';
import { useCreateBulkUsersMutation, useGetUsersQuery, useUpdateUserMutation } from '../../../features/users';
import Alert from '../../../components/bootstrap/Alert';
import useSortableData from '../../../hooks/useSortableData';
import PaginationButtons from '../../../components/PaginationButtons';
import Spinner from '../../../components/bootstrap/Spinner';
import Swal from 'sweetalert2';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import Papa from 'papaparse';
import showNotification from '../../../components/extras/showNotification';


const useDebounce = (value, delay) => {
	const [debouncedValue, setDebouncedValue] = useState(value);
  
	useEffect(() => {
	  const handler = setTimeout(() => {
		setDebouncedValue(value);
	  }, delay);
  
	  return () => {
		clearTimeout(handler);
	  };
	}, [value, delay]);
  
	return debouncedValue;
  };
const UsersPage = () => {
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState(1);
	const [searchModalStatus, setSearchModalStatus] = useState(false);
	const [perPage, setPerPage] = useState(10);
	const [inputVal, setInputVal] = useState('');
	const searchTerms = useDebounce(inputVal, "500")
	const [csvData, setCsvData] = useState([]);
	const [bulkUsers, { isLoading: usersLoad, isSuccess }] = useCreateBulkUsersMutation();
	const {
		data: userData,
		isFetching,
		isLoading: userLoading,
		refetch,
	} = useGetUsersQuery({
		page: currentPage,
		limit: perPage,
		search: searchTerms,
	});

	const [deleteUser] = useUpdateUserMutation()
	useEffect(()=>{
		refetch()
	},[])
	const [filteredTableData, setFilteredTableData] = useState([]);
	const handleInputChange = (e: any) => {
		const inputVals: string = e?.target?.value;
		setInputVal(inputVals);

		if (!inputVals.trim()) {
			// Check if input is empty or contains only whitespace
			setFilteredTableData(userData?.data); // Display all customer data
			return; // Exit the function early
		}

		const filteredData: any = userData?.data?.filter(
			(item: any) =>
				item?.first_name?.toLowerCase()?.includes(inputVals?.toLowerCase()) ||
				item?.last_name?.toLowerCase()?.includes(inputVals?.toLowerCase()) ||
				item?.email?.toLowerCase()?.includes(inputVals?.toLowerCase()),
		);

		setFilteredTableData(filteredData);
	};
	useEffect(() => {
		if (userData) {
			setFilteredTableData(userData?.data);
		}
	}, [userData]);
	const { items, requestSort, getClassNamesFor } = useSortableData(filteredTableData);
	console.log(userData)
	
	const users = [
        {
            username: 'john_doe',
            firmName: 'Doe & Associates',
            email: 'john.doe@example.com',
            phone: '+1 234 567 890',
            address: '123 Main St, Apt 4B',
            city: 'New York',
            role: 'Admin',
        },
        {
            username: 'jane_smith',
            firmName: 'Smith Legal Services',
            email: 'jane.smith@example.com',
            phone: '+1 987 654 321',
            address: '456 Oak St, Suite 200',
            city: 'Los Angeles',
            role: 'User',
        },
        {
            username: 'alice_johnson',
            firmName: 'Johnson Law Firm',
            email: 'alice.johnson@example.com',
            phone: '+1 555 666 777',
            address: '789 Pine Ave, Floor 3',
            city: 'Chicago',
            role: 'Editor',
        },
    ];

	//  const handleDelete = async (orderId: number) => {
	// 	const result = await Swal.fire({
	// 	  title: "Are you sure?",
	// 	  text: "You won't be able to revert this!",
	// 	  icon: "warning",
	// 	  showCancelButton: true,
	// 	  confirmButtonColor: "#d33",
	// 	  cancelButtonColor: "#3085d6",
	// 	  confirmButtonText: "Yes, delete it!",
	// 	});
	
	// 	if (result.isConfirmed) {
	// 		const body = {
	// 			status: false
	// 		}
	// 	  try {
	// 		await deleteUser({body, id:orderId}).unwrap(); // Call RTK mutation
	// 		Swal.fire("Deleted!", "The order has been deleted.", "success");
	// 		refetch()
	// 	  } catch (error) {
	// 		Swal.fire("Error!", "Something went wrong.", "error");
	// 	  }
	// 	}
	//   };

	  const handleStatusChange = async (item: any) => {
		Swal.fire({
			title: 'Are you sure?',
			text: `Do you want to change the status to ${item.IsApproved ? 'Inactive' : 'Active'}?`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: "#d33",
				  cancelButtonColor: "#3085d6",
			confirmButtonText: 'Yes, change it!',
			cancelButtonText: 'No, cancel',
		}).then((result) => {
			if (result.isConfirmed) {
				// Trigger mutation to update status
				deleteUser({ id: item.UserID, body: { status: !item.IsApproved } })
					.unwrap()
					.then(() => {
						Swal.fire('Updated!', 'Site status has been updated.', 'success');
						refetch(); // Refetch data after successful update
					})
					.catch(() => {
						Swal.fire('Error!', 'Failed to update status. Please try again.', 'error');
					});
			}
		});
	};


	const downloadSampleCSV = () => {
		const headers = [
			'username',
			'full_name',
			'email',
			'password',
			'firm_name',
			'phone',
			'address',
			'state',
			'city',
			'zip',
			'app_acc_no',
			'role',
		];
		const sampleData = [
			[
				'john_doe',
				'John Doe',
				'john@example.com',
				'StrongP@ss1',
				'John Law Firm',
				'1234567890',
				'123 Main St',
				'CA',
				'Los Angeles',
				'90001',
				'101',
				'attorney',
			],
		];

		let csvContent = 'data:text/csv;charset=utf-8,';
		csvContent += headers.join(',') + '\n';
		csvContent += sampleData.map((row) => row.join(',')).join('\n');

		const encodedUri = encodeURI(csvContent);
		const link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', 'sample_users.csv');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			Papa.parse<any>(file, {
				header: true,
				skipEmptyLines: true,
				complete: (results: any) => {
					// Filter out empty rows
					const filteredData = results?.data?.filter((row: any) =>
						Object.values(row).some((value) => value !== null && value !== ''),
					);
					setCsvData(filteredData);
				},
				error: (error: any) => {
					console.error('Error reading CSV file:', error);
				},
			});
		}
	};
	const transformCsvToApiFormat = (): any[] => {
		return csvData;
	};
	const handleSaveData = async () => {
		const formattedData = transformCsvToApiFormat();
		const cleanedData = formattedData
			?.map((obj: any) =>
				Object?.fromEntries(Object?.entries(obj)?.filter(([_, value]) => value !== '')),
			)
			?.map((item: any) => ({
				...item,
				email: item?.email?.trim(),
			}));
		try {
			await bulkUsers({ users: cleanedData })
				.unwrap()
				?.then(() => {
					refetch();
					setCsvData([]);
					setSearchModalStatus(false);
					showNotification(
						<span className='d-flex align-items-center'>
							<Icon icon='CheckCircle' size='lg' className='me-1' />
							<span>Success!</span>
						</span>,
						'Users added successfully!',
						'success',
					);
					// }
				});
		} catch (error) {
			console.error('Error saving data:', error);
		}
	};
	const handleDelete = (email: string): void => {
		const updatedData = csvData.filter((item: any) => item?.email !== email);
		setCsvData(updatedData); // Assuming you're using state to manage csvData
	};
	
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
		<PageWrapper title='Dashboard Page'>
			<SubHeader className='mt-4'>
				<SubHeaderLeft >
					{/* <Breadcrumb list={[{ title: 'User', to: '/dashboard' }]} />
					<SubheaderSeparator />
					<span className='text-muted'>Users</span> */}
				</SubHeaderLeft>
				<SubHeaderRight>
					<CardActions className='px-4'>
						<Input
							className='w-100 py-2 my-4  bg-white'
							type='text'
							ariaLabel='search'
							id='searchCampaign'
							value={inputVal}
							onChange={handleInputChange}
							placeholder='Search...'
						/>
					</CardActions>
					<Button
						color='secondary'
						// isLight
						icon='Add'
						className='bg-gradient '
						onClick={() => navigate('/new-users')}>
						Add New
					</Button>
					{/* <Button color='info' isOutline icon='Save' >
							Save
						</Button> */}
				</SubHeaderRight>
			</SubHeader>
			<Page container='fluid'>
				<Card>
					<CardHeader>
						<CardLabel icon='People' iconColor='primary'>
							<CardTitle tag='div' className='h4 fs-3'>
								Users
							</CardTitle>
						</CardLabel>
						{/* <CardActions>
							<Button
								// onClick={() => setSearchModalStatus(true)}
								color='secondary'
								icon='CloudDownload'
								// isLight
								tag='a'
								className='bg-gradient '
								// to='/somefile.txt'
								target='_blank'
								// download
							>
								Export
							</Button>
						</CardActions> */}
						<CardActions>
							<Button
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
							</Button>
						</CardActions>
					</CardHeader>
					<CardBody className='table-responsive'>
						<table className='table table-modern '>
							<thead className=''>
								<tr>
									<th >
										ID
										
									</th>
									<th >
										Username
										
									</th>
                                    <th >
										Firm Name
										
									</th>
									<th >
										Email
										
									</th>
									
									<th>Phone</th>
									<th>Address</th>
									<th>City</th>
									<th>Role</th>
									<th>Status</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
                            {items.map((user: any, index: number) => (
                            <tr key={index}>
                                <td>{user.UserID}</td>
                                <td>{user.UserName}</td>
                                <td>{user.FirmName}</td>
                                <td>{user.Email}</td>
                                <td>{user.Phone}</td>
                                <td>{user.Address}</td>
                                <td>{user.City}</td>
                                <td>
                                    <span
                                        // className={`badge ${
                                        //     user.role === 'Admin'
                                        //         ? 'bg-primary'
                                        //         : user.role === 'Editor'
                                        //         ? 'bg-warning'
                                        //         : 'bg-secondary'
                                        // }`}
                                    >
                                        {user.Role}
                                    </span>
                                </td>
								<td>
								<td>
													{/* {item?.status ? 'Active' : 'Inactive'} */}
													<Checks
														type='switch'
														label={user?.IsApproved ? 'Active' : 'Inactive'}
														checked={user?.IsApproved}
														onChange={() => handleStatusChange(user)}
													/>
												</td>
								</td>
                                <td>
                                   {/* {user?.IsApproved &&  */}
								   <>
                                  {/* <Icon icon='Delete' size={"2x"} color='danger' className='cursor-pointer' onClick={()=>handleDelete(user?.id)} /> */}
								  <Icon
								  className='mx-2'
														onClick={() =>
															navigate(`/user/${user?.UserID}`, {
																state: user,
															})
														}
														style={{ cursor: 'pointer' }}
														icon='Edit'
														size={'2x'}
														color='dark'
													/>
													</>
													{/* } */}
                                </td>
                            </tr>
                        ))}
							</tbody>
						</table>

						{!items.length && (
															<Alert color='warning' isLight icon='Report' className='mt-3'>
																There is no User Available.
															</Alert>
														)}
					</CardBody>
					{userData?.data?.length > 0 &&
							<PaginationButtons
								data={userData?.data}
								label='items'
								setCurrentPage={setCurrentPage}
								currentPage={currentPage}
								perPage={perPage}
								setPerPage={setPerPage}
								totalPage={userData?.pagination?.totalPages}
								totalSites={userData?.pagination?.totalUsers}
							/>}
					{/* <PaginationButtons
						data={userData?.data}
						label='items'
						setCurrentPage={setCurrentPage}
						currentPage={currentPage}
						perPage={perPage}
						setPerPage={setPerPage}
						totalPage={userData?.pagination?.totalPages}
						totalSites={userData?.pagination?.totalUsers}
					/> */}
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
					<ModalHeader setIsOpen={setSearchModalStatus}>
						<ModalTitle id='bulkAddSites'>Bulk Add Users</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<>
							<div className='d-flex justify-content-end mb-4'>
								<Button
									className='d-flex align-items-center p-0' // Align items and remove padding
									onClick={downloadSampleCSV}>
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
								<div>
									<table
										style={{ maxWidth: 2400 }}
										className='table table-bordered mt-5'>
										<thead>
											<tr>
												<th>Username</th>
												<th>Full Name</th>
												<th>Email</th>
												<th>Password</th>
												<th>Firm Name</th>
												
												<th>Phone</th>
												<th>Address</th>
												<th>State</th>
												<th>City</th>
												<th>Zip</th>
												<th>App Acc No</th>
												<th>Role</th>
											</tr>
										</thead>
										<tbody>
											{csvData.map((item: any, index) => (
												<tr key={index}>
													<td>
																{item?.username || "N/A"}
													</td>
													<td>
																{item?.full_name || "N/A"}
													</td>
													<td className=''>{item?.email}</td>
													<td className=''>{item?.password}</td>
													<td >
														{item?.firm_name}
													</td>
													<td>{item?.phone}</td>
													<td>{item?.address}</td>
													<td>{item?.state}</td>
													<td>{item?.city}</td>
													<td>{item?.zip}</td>
													<td>{item?.app_acc_no}</td>
													<td>{item?.role}</td>
													<td>
														<Icon
															onClick={() =>
																handleDelete(item?.email)
															}
															icon='Delete'
															size={'2x'}
															color='danger'
															className='ms-3'
														/>
													</td>
												</tr>
											))}
										</tbody>
									</table>
									
									<div className='w-100 d-flex justify-content-end '>
										<Button
											className='my-4 '
											color='secondary'
											onClick={handleSaveData}
											isDisable={usersLoad}>
											{usersLoad ? 'Saving...' : 'Save Data'}
										</Button>
									</div>

									{isSuccess && (
										<p className='text-success mt-2'>
											Data saved successfully!
										</p>
									)}
								</div>
							)}
						</>
					</ModalBody>
					<ModalFooter>
						<></>
					</ModalFooter>
				</Modal>
			</Page>
		</PageWrapper>
	);
};

export default UsersPage;
