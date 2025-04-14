import React from 'react';

import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';
import Popovers from '../../../components/bootstrap/Popovers';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardSubTitle, CardTitle } from '../../../components/bootstrap/Card';
import useDarkMode from '../../../hooks/useDarkMode';
import Icon from '../../../components/icon/Icon';
import { priceFormat } from '../../../helpers/helpers';
import dayjs from 'dayjs';
import Chart from '../../../components/extras/Chart';
import { ApexOptions } from 'apexcharts';
import Timeline, { TimelineItem } from '../../../components/extras/Timeline';
import { useGetOverviewQuery } from '../../../features/users';
import Spinner from '../../../components/bootstrap/Spinner';


type StatCardProps = {
	icon: string;
	value: string | number;
	label: string;
	color: string;
  };
  
  const StatCard = ({ icon, value, label, color }: StatCardProps) => {
	const { darkModeStatus } = useDarkMode();
	return (
	  <div className={`col-xl-3`}>
		<div className={`d-flex align-items-center bg-l${darkModeStatus ? 'o25' : '10'}-${color} rounded-2 p-3`}>
		  <div className="flex-shrink-0">
			<Icon icon={icon} size="3x" color={color} />
		  </div>
		  <div className="flex-grow-1 ms-3">
			<div className="fw-bold fs-3 mb-0">{value}</div>
			<div className="text-muted mt-n2 truncate-line-1">{label}</div>
		  </div>
		</div>
	  </div>
	);
  };
const DashboardPage = () => {
	const {data: dashboardData, isLoading} = useGetOverviewQuery({})
	console.log(dashboardData)
	const statsData = [
		{ label: "Total Orders", value: dashboardData?.totalOrders ?? 0, icon: "ShoppingCart", color: "warning" },
		{ label: "Active Orders", value: dashboardData?.activeOrders ?? 0, icon: "PendingActions", color: "info" },
		{ label: "Pending Orders", value: dashboardData?.pendingOrders ?? 0, icon: "HourglassEmpty", color: "info" },
		{ label: "Urgent Orders", value: dashboardData?.urgentOrders ?? 0, icon: "PriorityHigh", color: "danger" },
		{ label: "Missed Deadline", value: dashboardData?.missedDeadlines ?? 0, icon: "CancelScheduleSend", color: "primary" },
		{ label: "Cancelled Order", value: dashboardData?.cancelledOrders ?? 0, icon: "DoNotDisturb", color: "secondary" },
		{ label: "Orders On Time", value: `${dashboardData?.ordersOnTime ?? 0}`, icon: "Timer", color: "success" },
		{ label: "Total Documents", value: `${dashboardData?.documentLocationCount ?? 0} `, icon: "DocumentScanner", color: "warning" },
		
	  ];
	//   const orderTrendsData = [
	// 	{ date: "2024-02-01", placed: 50, uploaded: 40, completed: 30 },
	// 	{ date: "2024-02-02", placed: 60, uploaded: 50, completed: 35 },
	// 	{ date: "2024-02-03", placed: 80, uploaded: 70, completed: 50 },
	// 	{ date: "2024-02-04", placed: 90, uploaded: 75, completed: 65 },
	// 	{ date: "2024-02-05", placed: 120, uploaded: 100, completed: 85 },
	// 	{ date: "2024-02-06", placed: 150, uploaded: 130, completed: 110 },
	//   ];
	  const ordersNearingDeadlineData = [
		{ date: "2024-02-01", total: 70 },
		{ date: "2024-02-02", total: 90 },
		{ date: "2024-02-03", total: 82 },
		{ date: "2024-02-04", total: 101 },
		{ date: "2024-02-05", total: 110 },
		{ date: "2024-02-06", total: 122 },
		{ date: "2024-02-07", total: 133 },
	  ];
	  const chartOptions: ApexOptions = {
		chart: {
		  type: "bar",
		  height: 350,
		  toolbar: { show: false },
		},
		plotOptions: {
		  bar: {
			horizontal: false, // Vertical bars
			columnWidth: "30%",
		  },
		},
		colors: ["#1b6eca", "#EA703E", "#24A19C"], // Custom colors
		xaxis: {
		  categories: ["Order Placed", "Document Uploaded", "Order Completed"],
		},
		tooltip: {
		  shared: true,
		  intersect: false,
		  y: {
			formatter: (value, { seriesIndex }) => {
			  const dates = [
				dashboardData?.orderTrends?.orderPlaced?.[0]?.date || "N/A",
				dashboardData?.orderTrends?.documentUploaded?.[0]?.date || "N/A",
				dashboardData?.orderTrends?.orderCompleted?.[0]?.date || "N/A",
			  ];
			  return `${value} orders (Date: ${dates[seriesIndex]})`;
			},
		  },
		},
		legend: { position: "top" },
	  };
	  
	  const chartSeries = [
		{
		  name: "Count",
		  data: [
			dashboardData?.orderTrends?.orderPlaced?.[0]?.count || 0,
			dashboardData?.orderTrends?.documentUploaded?.[0]?.count || 0,
			dashboardData?.orderTrends?.orderCompleted?.[0]?.count || 0,
		  ],
		},
	  ];
	  
	  

  const chartOptionsNearing: ApexOptions = {
    chart: { type: "bar", height: 350, toolbar: { show: false } },
    colors: ["#1b6eca"], // Use a single color (Red) for urgency
    xaxis: { categories: dashboardData?.ordersNearingDeadline?.map(d => d.date), title: { text: "Date" } },
    // yaxis: { title: { text: "Number of Orders" } },
    tooltip: { shared: true, intersect: false },
    legend: { show: false }, // No need for multiple categories
    plotOptions: { bar: { columnWidth: "30%" } }
  };

  const chartSeriesNearing = [
    { name: "Orders Nearing Deadline", data: dashboardData?.ordersNearingDeadline?.map(d => d.count) }
];
  const orderCompletionData = [
	{ label: "Completed on Time", value: 75 },
	{ label: "Missed Deadline", value: 25 },
  ];
  


// Extract labels and series data


// Define chart options dynamically
const filteredStatusData = dashboardData?.orderStatuses?.filter((item: any) => item.RequestStatus === "Active" || item.RequestStatus === "Completed");
const chartLabelsStatus = filteredStatusData?.map((item: any) => item.RequestStatus);
const chartSeriesStatus = filteredStatusData?.map((item: any) => item.count);
// Extract labels and series data

// Define chart options dynamically
const chartOptionsStatus: ApexOptions = {
    chart: {
        type: "donut",
    },
    labels: chartLabelsStatus, // Use filtered labels dynamically
    colors: ["#1b6eca", "#28a745"], // Active (blue), Completed (green)
    legend: {
        position: "bottom",
    },
};

const filteredCompletionData = dashboardData?.orderStatuses?.filter((item: any) => 
    item.RequestStatus === "Active" || item.RequestStatus === "Cancelled"
);

// Extract labels and series data dynamically
const chartLabelsCompletion = filteredCompletionData?.map((item: any) => item.RequestStatus);
const chartSeriesCompletion = filteredCompletionData?.map((item: any) => item.count);

const chartOptionsCompletion: ApexOptions = {
    chart: {
        type: "donut",
    },
    labels: chartLabelsCompletion, // Use filtered labels dynamically
    colors: ["#1b6eca", "#FFB74D"], // Active (blue), Cancelled (orange)
    legend: {
        position: "bottom",
    },
    dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(1)}`, // Shows percentage inside chart
    },
    tooltip: {
        enabled: true,
        y: {
            formatter: (val: number) => `${val}%`, // Tooltip shows percentage
        },
    },
};
  const urgentOrders = dashboardData?.recentOrders?.slice(0, 10)?.map((order: any) => ({
    orderCode: order.OrderCode, // Using `id` as the order code
    clientName: order.orderByUser?.username || "N/A", // Extract client name
    caseName: order.CaseName,
    caseNumber: order.CaseNumber,
    deadline: order.NeededBy
      ? dayjs(order.NeededBy).format("MMM DD, YYYY") // Format deadline date
      : "No Deadline",
  }));


  
  const getColor = (actionType: string) => {
	switch (actionType) {
	  case "user_registered":
		return "success";
	  case "order_placed":
		return "primary";
	  case "order_approved":
		return "info";
	  case "order_delayed":
		return "danger";
	  default:
		return "secondary";
	}
  };
  
  const highlightEmails = (text: string) => {
	return text.split(/(\{.*?\})/).map((part, index) =>
	  part.match(/^\{.*?\}$/) ? (
		<span key={index} style={{ color: "#98248E", fontWeight: "bold" }}>
		  {part.replace(/\{|\}/g, "")}
		</span>
	  ) : (
		part
	  )
	);
  };

  if (isLoading) {
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
			
			<Page container="fluid">
				<div className='row'>
					<div className='col-12 mb-3'>
					<Card>
  <CardHeader>
    <CardLabel icon="StackedLineChart">
      <CardTitle tag="div" className="h5">{`Order Statistics (${dayjs().format('MMM')})`}</CardTitle>
    </CardLabel>
    <CardActions>
      Showing data for <strong>{dayjs().format('MMM')}</strong>.
    </CardActions>
  </CardHeader>
  <CardBody>
    <div className="row g-4 align-items-center">
      {statsData?.map((item, index) => (
        <StatCard key={index} {...item} />
      ))}
    </div>
  </CardBody>
</Card>
					</div>

					<div className='col-lg-6 mb-3 col-md-12'>
					<Card >
  <CardHeader>
    <CardLabel icon="TrendingUp">
      <CardTitle tag="div" className="h5">Order Trends</CardTitle>
    </CardLabel>
  </CardHeader>
  <CardBody>
  <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
  </CardBody>
</Card>
					</div>
					<div className='col-lg-6 mb-3 col-md-12'>
					<Card>
      <CardHeader>
        <CardLabel icon="AccessTime"> {/* ⏳ Deadline Icon */}
          <CardTitle tag="div" className="h5">Orders Nearing Deadline</CardTitle>
        </CardLabel>
      </CardHeader>
      <CardBody>
        <Chart options={chartOptionsNearing} series={chartSeriesNearing} type="bar" height={350} />
      </CardBody>
    </Card>
					</div>
					<div className='col-lg-6 mb-3 col-md-12'>
					<Card>
      <CardHeader>
        <CardLabel icon="DoneAll"> {/* ⏳ Deadline Icon */}
          <CardTitle tag="div" className="h5">Order Completion Status</CardTitle>
        </CardLabel>
      </CardHeader>
      <CardBody>
        <Chart options={chartOptionsStatus} series={chartSeriesStatus} type="donut" height={350} />
      </CardBody>
    </Card>
					</div>
					<div className='col-lg-6 mb-3 col-md-12'>
					<Card>
      <CardHeader>
        <CardLabel icon="PieChart"> 
          <CardTitle tag="div" className="h5">Order Completion Status</CardTitle>
        </CardLabel>
      </CardHeader>
      <CardBody>
        <Chart options={chartOptionsCompletion} series={chartSeriesCompletion} type="donut" height={350} />
      </CardBody>
    </Card>
					</div>
				
					<div className='col-lg-8 mb-3 col-md-12'>
					<Card stretch>
			<CardHeader>
				<CardLabel icon='AlertTriangle'  iconColor='primary'>
					<CardTitle tag='div' className='h5'>
						Top 10 Urgent Orders
					</CardTitle>
				</CardLabel>
			</CardHeader>
			<CardBody className='table-responsive'>
				<table className='table table-modern '>
					<thead className=''>
					<tr>
							<th >
							
							Order Code
								 
								
							</th>
							{/* <th >
							Client Name
								
							</th> */}
							<th >
							Case Name			
							</th>
							<th >
							Case Number						
							</th>
							<th >
							Deadline					
							</th>
						</tr>
					</thead>
					<tbody>
            {urgentOrders?.map((order, index) => (
              <tr key={index}>
                <td>{order.orderCode}</td>
                {/* <td>{order.clientName}</td> */}
                <td>{order.caseName}</td>
                <td>{order.caseNumber}</td>
                <td>{order.deadline}</td>
              </tr>
            ))}
          </tbody>
				</table>
			</CardBody>
			{/* <PaginationButtons
				data={sitesData?.data}
				label='items'
				setCurrentPage={setCurrentPage}
				currentPage={currentPage}
				perPage={perPage}
				setPerPage={setPerPage}
				totalPage={sitesData?.pagination?.totalPages}
				totalSites={sitesData?.pagination?.totalSites}
			/> */}

		</Card>
					</div>
					{/* <div className='col-lg-4 mb-3 col-md-12'>
					<Card stretch>
  <CardHeader>
    <CardLabel icon="NotificationsActive" iconColor="primary">
      <CardTitle tag="div" className="h5">Recent Activities</CardTitle>
      <CardSubTitle tag="div" className="h6">Last 2 Weeks</CardSubTitle>
    </CardLabel>
  </CardHeader>
  <CardBody isScrollable>
    <Timeline>
      <TimelineItem label={dayjs().add(-1, "hours").format("LT")} color="primary">
        <b>New Order Placed:</b> Case #12345 for John Doe.
      </TimelineItem>

      <TimelineItem label={dayjs().add(-3, "hours").format("LT")} color="success">
        <b>Order Approved:</b> Order Code <b>ORD-98765</b> has been verified.
      </TimelineItem>

      <TimelineItem label={dayjs().add(-7, "hours").format("LT")} color="warning">
        <b>Order Deadline Approaching:</b> Case #54321 due in <b>2 days</b>.
      </TimelineItem>

      <TimelineItem label={dayjs().add(-1, "day").fromNow()} color="info">
        <b>New Client Added:</b> <span className="fw-bold">XYZ Law Firm</span>.
      </TimelineItem>

      <TimelineItem label={dayjs().add(-2, "day").fromNow()} color="danger">
        <b>Order Delayed:</b> Case #67890 requires additional documents.
      </TimelineItem>

      <TimelineItem label={dayjs().add(-4, "day").fromNow()} color="primary">
        <b>Case Resolved:</b> File #AB123 completed successfully.
      </TimelineItem>

      <TimelineItem label={dayjs().add(-5, "day").fromNow()} color="secondary">
        <b>Order Payment Received:</b> Invoice for Case #56789 confirmed.
      </TimelineItem>

      <TimelineItem label={dayjs().add(-7, "day").fromNow()} color="primary">
        <b>New Case Created:</b> Case #99887 added to the system.
      </TimelineItem>
    </Timeline>
  </CardBody>
</Card>

					</div> */}
					<div className="col-lg-4 mb-3 col-md-12">
  <Card style={{height:"550px"}}>
    <CardHeader>
      <CardLabel icon="NotificationsActive" iconColor="primary">
        <CardTitle tag="div" className="h5">Recent Activities</CardTitle>
        <CardSubTitle tag="div" className="h6">Last 2 Weeks</CardSubTitle>
      </CardLabel>
    </CardHeader>
    <CardBody isScrollable>
      <Timeline>
        {dashboardData?.recentActivities?.map((activity) => (
          <TimelineItem
            key={activity.id}
            label={dayjs(activity.timestamp).fromNow()} // Format timestamp
            color={getColor(activity.action_type)} // Dynamic color
          >
            <b>{activity.action_type.replace("_", " ")}:</b>{" "}
            {highlightEmails(activity.description)}
          </TimelineItem>
        ))}
      </Timeline>
    </CardBody>
  </Card>
</div>

				</div>
			</Page>
		</PageWrapper>
	);
};

export default DashboardPage;
