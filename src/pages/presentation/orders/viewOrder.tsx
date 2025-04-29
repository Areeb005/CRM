import React, { useEffect } from "react";
import dayjs from "dayjs";
import Card, { CardBody, CardHeader, CardTitle } from "../../../components/bootstrap/Card";
import { useGetSingleQuery } from "../../../features/users";
import { useParams } from "react-router-dom";
import PageWrapper from "../../../layout/PageWrapper/PageWrapper";
import Page from "../../../layout/Page/Page";
import Spinner from "../../../components/bootstrap/Spinner";
import getAuthTokenFromLocalStorage from "../../../utils";


// Returns Bootstrap color class based on status
function getStatusColor(status) {
  switch(status?.toLowerCase()) {
    case 'fulfilled': return 'success';
    case 'unfulfilled': return 'warning';
    case 'cancelled': return 'danger';
    default: return 'secondary';
  }
}

// Calculates time between status updates
function calculateTimeDifference(newerDate, olderDate) {
  const diff = dayjs(newerDate).diff(dayjs(olderDate));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} later`;
  if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''} later`;
  return 'Just now';
}
const OrderDetails = () => {
//   if (!order) return <p>Loading...</p>;
const {id} = useParams()
console.log(id)
const { data: order , isLoading ,refetch} = useGetSingleQuery({ type: 'order', id }, { skip: !id });

const handleDownloadAll = async (file: string) => {
  try {
    // 1. First fetch the file metadata/URL from your endpoint
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/files/${file}?location=writeable`,
      {
        method: 'GET',
        headers: {
          // Add any required headers (auth tokens etc)
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthTokenFromLocalStorage()}`
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // 2. Get the actual file URL from the response
    // (Adjust this based on your API response structure)
    const fileData = await response.blob();
    const fileUrl = window.URL.createObjectURL(fileData);
    // const fileUrl = fileData // Modify according to your API response
    console.log(fileUrl, "fileUrl")

    // 3. Create and trigger download link
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', file || 'download');
    link.target = '_blank'; // Open in new tab
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
      window.URL.revokeObjectURL(fileUrl);

  } catch (error) {
    console.error('Download failed:', error);
    alert(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
// const handleDownloadAll = async (files: string[]) => {
//     if (!files || files.length === 0) {
//       alert("No files available for download.");
//       return;
//     }
  
//     // for (const [index, fileUrl] of files.entries()) {
//     //   await new Promise((resolve) => setTimeout(resolve, index * 500)); // Delay each download
  
//       const link = document.createElement("a");
//       link.href = `${import.meta.env.VITE_BASE_URL}/files/${files}?location=writeable`;
//       link.target = "_blank"
//       link.setAttribute("download", files.split("/").pop() || "file"); // Ensure filename extraction
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     // }
//   };
  useEffect(()=>{
    refetch()
  },[])
  
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
			<Spinner isGrow />
			<Spinner isGrow />
			<Spinner isGrow />
		</div>
	);
}

  return (
    <PageWrapper title='Dashboard Page'>
    <Page container='fluid'>
      <div className="row">
        {/* General Information */}
        <div className="col-lg-6">
          <Card className="h-100 shadow-sm p-3">
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardBody>
              <h4 className="text-primary">
                <span className="text-black">Case Name: </span> {order?.CaseName || "N/A"}
              </h4>
              <p><strong>Order ID:</strong> {order?.OrderID || "N/A"}</p>
              <p><strong>Order Code:</strong> {order?.OrderCode || "N/A"}</p>
              <p><strong>File Number:</strong> {order?.FileNumber || "N/A"}</p>
              <p><strong>Case Number:</strong> {order?.CaseNumber || "N/A"}</p>
              <p><strong>Claim Number:</strong> {order?.ClaimNo || "N/A"}</p>
              <p><strong>Status:</strong> {order?.RequestStatus || "N/A"}</p>
              <p><strong>Urgent:</strong> {order?.IsRush ? "Yes" : "No"}</p>
              <p><strong>Needed By:</strong> {order?.NeededBy ? dayjs(order?.NeededBy).format("MMM DD, YYYY") : "N/A"}</p>
              <p><strong>Date of Birth:</strong> {order?.DOB ? dayjs(order?.DOB).format("MMM DD, YYYY") : "N/A"}</p>
              <p><strong>Representing:</strong> {order?.Represent?.name || "N/A"}</p>
            </CardBody>
          </Card>
        </div>
  
        {/* Court Information */}
        <div className="col-lg-6">
          <Card className="h-100 shadow-sm p-3">
            <CardHeader>
              <CardTitle>Court Details</CardTitle>
            </CardHeader>
            <CardBody>
              <p><strong>Court Name:</strong> {order?.CourtName || "N/A"}</p>
              <p><strong>Address:</strong> {order?.CourtAddress || "N/A"}</p>
              <p><strong>City:</strong> {order?.CourtCity || "N/A"}</p>
              <p><strong>State:</strong> {order?.CourtState || "N/A"}</p>
              <p><strong>Zip Code:</strong> {order?.CourtZip || "N/A"}</p>
              <p><strong>Court Room:</strong> {order?.CourtRoomNo || "N/A"}</p>
              <p><strong>Court Department:</strong> {order?.CourtDepartment || "N/A"}</p>
              <p><strong>Filing District:</strong> {order?.FilingDistrict || "N/A"}</p>
            </CardBody>
          </Card>
        </div>
  
        {/* Record Details */}
        <div className="col-lg-6 mt-3">
          <Card className="h-100 shadow-sm p-3">
            <CardHeader>
              <CardTitle>Record Details</CardTitle>
            </CardHeader>
            <CardBody>
              <p><strong>Record Type:</strong> {order?.record_details?.RecordType || "N/A"}</p>
              <p><strong>First Name:</strong> {order?.record_details?.PFirstName || "N/A"}</p>
              <p><strong>Last Name:</strong> {order?.record_details?.PLastName || "N/A"}</p>
              <p><strong>AKA:</strong> {order?.record_details?.PAKA || "N/A"}</p>
              <p><strong>SSN:</strong> {order?.record_details?.PSSN || "N/A"}</p>
              <p><strong>Address:</strong> {order?.record_details?.PAddress || "N/A"}</p>
              <p><strong>City:</strong> {order?.record_details?.PCity || "N/A"}</p>
              <p><strong>State:</strong> {order?.record_details?.PState || "N/A"}</p>
              <p><strong>Zip Code:</strong> {order?.record_details?.PZip || "N/A"}</p>
              <p><strong>Continuous Trauma:</strong> {order?.record_details?.continuous_trauma ? "Yes" : "No"}</p>
              <p><strong>Date of Injury:</strong> 
                {order?.record_details?.date_of_injury ? 
                  `${dayjs(order?.record_details?.date_of_injury.from).format("MMM DD, YYYY")} - ${dayjs(order?.record_details?.date_of_injury.to).format("MMM DD, YYYY")}` : 
                  "N/A"}
              </p>
            </CardBody>
          </Card>
        </div>
  
        {/* Participants */}
        <div className="col-lg-6 mt-3">
          <Card className="h-100 shadow-sm p-3">
            <CardHeader>
              <CardTitle>Participants</CardTitle>
            </CardHeader>
            <CardBody>
              {order?.tblOrderCaseParties?.length > 0 ? (
                order?.tblOrderCaseParties.map((participant, index) => (
                  <div key={index} className="border-bottom pb-2 mb-2">
                    <p><strong>Party Name:</strong> {participant.PartyName || "N/A"}</p>
                    <p><strong>Type:</strong> {participant.PartyType || "N/A"}</p>
                    <p><strong>Represents:</strong> {participant.RepresentID || "N/A"}</p>
                    <p><strong>Phone:</strong> {participant.PartyPhone || "N/A"}</p>
                    <p><strong>Address:</strong> {participant.PartyAddress || "N/A"}</p>
                    <p><strong>City:</strong> {participant.PartyCity || "N/A"}</p>
                    <p><strong>State:</strong> {participant.PartyState || "N/A"}</p>
                    <p><strong>Zip Code:</strong> {participant.PartyZip || "N/A"}</p>
                    <p><strong>Opposing Attorney:</strong> {participant.OpposingAttorney || "N/A"}</p>
                    <p><strong>Insurance Claim:</strong> {participant.InsuranceClaim || "N/A"}</p>
                    <p><strong>Insurance Adjuster:</strong> {participant.InsuranceAdjuster || "N/A"}</p>
                    <p><strong>Note:</strong> {participant.Note || "N/A"}</p>
                  </div>
                ))
              ) : (
                <p>No participants available.</p>
              )}
            </CardBody>
          </Card>
        </div>
  
        {/* Document Locations */}
        <div className="col-lg-6 mt-3">
          <Card className="h-100 shadow-sm p-3">
            <CardHeader>
              <CardTitle>Document Locations</CardTitle>
            </CardHeader>
            <CardBody>
              {order?.TblOrderDocLocations?.length > 0 ? (
                order?.TblOrderDocLocations.map((doc, index) => {
                  const filesArray = doc?.DocFilePath ? doc.DocFilePath : "";
                  const sortedLogs = doc?.statusLogs 
            ? [...doc.statusLogs].sort((a, b) => new Date(b.StatDate) - new Date(a.StatDate))
            : [];
                  console.log(doc, "doc.Proctype?.procname")
                  return (
                    <div key={index} className="border-bottom pb-2 mb-2">
                      <p><strong>WO:</strong> {doc.wo || "N/A"}</p>
                      <p><strong>Location Name:</strong> {doc.LocationName || "N/A"}</p>
                      <p><strong>Address:</strong> {doc.LocationAddress || "N/A"}</p>
                      <p><strong>City:</strong> {doc.LocationCity || "N/A"}</p>
                      <p><strong>State:</strong> {doc.LocationState || "N/A"}</p>
                      <p><strong>Zip Code:</strong> {doc.LocationZip || "N/A"}</p>
                      <p><strong>Process Type:</strong> {doc.Proctype?.procname || "N/A"}</p>
                      <p><strong>Action:</strong> {doc.ProcAction?.Action || "N/A"}</p>
                      <p><strong>Record Type:</strong> {doc.Supword?.Word_Name || "N/A"}</p>
                      <p><strong>Copy For Review:</strong> {doc.CopyForReview ? "Yes" : "No"}</p>
                      <p><strong>Location Source:</strong> {doc.locationSource || "N/A"}</p>
                      <p><strong>Status:</strong> {doc.DocRequestStatus || "N/A"}</p>
                      {sortedLogs.length > 0 && (
                <div className="mt-4">
                  <h6 className="mb-3 fw-bold">Status History</h6>
                  <div className="ps-3 border-start">
                    {sortedLogs.map((log, logIndex) => (
                      <div key={logIndex} className="mb-3 position-relative">
                        <div  className="position-absolute  start-0 translate-middle rounded-circle bg-primary" 
                             style={{width: '10px', height: '10px', top: "10px"}}></div>
                        <div className="ms-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-semibold">{log.AStatus}</span>
                            <small className="text-muted">
                              {dayjs(log.StatDate).format("MMM DD, YYYY h:mm A")}
                            </small>
                          </div>
                          {logIndex < sortedLogs.length - 1 && (
                            <div className="text-muted small mt-1">
                              {calculateTimeDifference(
                                log.StatDate, 
                                sortedLogs[logIndex + 1].StatDate
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
                      {filesArray.length > 0 && (
                        <button
                          onClick={() => handleDownloadAll(filesArray)}
                          className="btn btn-primary d-block mt-2"
                        >
                          Download Files
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>No document locations available.</p>
              )}
            </CardBody>
          </Card>
        </div>
  
        {/* Order Metadata */}
        <div className="col-lg-6 mt-3">
          <Card className="h-100 shadow-sm p-3">
            <CardHeader>
              <CardTitle>Order Metadata</CardTitle>
            </CardHeader>
            <CardBody>
              <p><strong>Created By:</strong> {order?.createdByUser?.FullName || "N/A"} ({order?.createdByUser?.Email})</p>
              <p><strong>Order By:</strong> {order?.orderByUser?.FullName || "N/A"} ({order?.orderByUser?.Email})</p>
              <p><strong>Created Date:</strong> {order?.CreatedDate ? dayjs(order?.CreatedDate).format("MMM DD, YYYY HH:mm A") : "N/A"}</p>
              <p><strong>Completed Date:</strong> {order?.CompletedDate ? dayjs(order?.CompletedDate).format("MMM DD, YYYY HH:mm A") : "N/A"}</p>
              <p><strong>Bill To:</strong> {order?.BillTo || "N/A"}</p>
              <p><strong>Firm Name:</strong> {order?.orderByUser?.FirmName || "N/A"}</p>
              <p><strong>Firm Phone:</strong> {order?.orderByUser?.Phone || "N/A"}</p>
              <p><strong>Firm Address:</strong> {order?.orderByUser?.Address || "N/A"}</p>
              <p><strong>Firm City:</strong> {order?.orderByUser?.City || "N/A"}</p>
              <p><strong>Firm State:</strong> {order?.orderByUser?.State || "N/A"}</p>
              <p><strong>Firm Zip:</strong> {order?.orderByUser?.Zip || "N/A"}</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </Page>
  </PageWrapper>
  );
};

export default OrderDetails;
