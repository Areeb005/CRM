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
import { useGetUsersQuery, useUpdateUserMutation } from '../../../features/users';
import Alert from '../../../components/bootstrap/Alert';
import useSortableData from '../../../hooks/useSortableData';
import PaginationButtons from '../../../components/PaginationButtons';
import Spinner from '../../../components/bootstrap/Spinner';
import Swal from 'sweetalert2';

const UsersPage = () => {
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [inputVal, setInputVal] = useState('');
	const {
		data: userData,
		isFetching,
		isLoading: userLoading,
		refetch,
	} = useGetUsersQuery({});

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
			text: `Do you want to change the status to ${item.status ? 'Inactive' : 'Active'}?`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: "#d33",
				  cancelButtonColor: "#3085d6",
			confirmButtonText: 'Yes, change it!',
			cancelButtonText: 'No, cancel',
		}).then((result) => {
			if (result.isConfirmed) {
				// Trigger mutation to update status
				deleteUser({ id: item.id, body: { status: !item.status } })
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
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.firm_name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.address}</td>
                                <td>{user.city}</td>
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
                                        {user.role}
                                    </span>
                                </td>
								<td>
								<td>
													{/* {item?.status ? 'Active' : 'Inactive'} */}
													<Checks
														type='switch'
														label={user?.status ? 'Active' : 'Inactive'}
														checked={user?.status}
														onChange={() => handleStatusChange(user)}
													/>
												</td>
								</td>
                                <td>
                                   {user?.status && 
								   <>
                                  {/* <Icon icon='Delete' size={"2x"} color='danger' className='cursor-pointer' onClick={()=>handleDelete(user?.id)} /> */}
								  <Icon
								  className='mx-2'
														onClick={() =>
															navigate(`/user/${user?.id}`, {
																state: user,
															})
														}
														style={{ cursor: 'pointer' }}
														icon='Edit'
														size={'2x'}
														color='dark'
													/>
													</>
													}
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
					{items.length > 0 &&
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
			</Page>
		</PageWrapper>
	);
};

export default UsersPage;
