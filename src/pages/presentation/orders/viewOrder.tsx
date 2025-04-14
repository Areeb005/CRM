import React, { useEffect } from "react";
import dayjs from "dayjs";
import Card, { CardBody, CardHeader, CardTitle } from "../../../components/bootstrap/Card";
import { useGetSingleQuery } from "../../../features/users";
import { useParams } from "react-router-dom";
import PageWrapper from "../../../layout/PageWrapper/PageWrapper";
import Page from "../../../layout/Page/Page";
import Spinner from "../../../components/bootstrap/Spinner";


const OrderDetails = () => {
//   if (!order) return <p>Loading...</p>;
const {id} = useParams()
console.log(id)
const { data: order , isLoading ,refetch} = useGetSingleQuery({ type: 'order', id }, { skip: !id });

const handleDownloadAll = async (files: string[]) => {
    if (!files || files.length === 0) {
      alert("No files available for download.");
      return;
    }
  
    // for (const [index, fileUrl] of files.entries()) {
    //   await new Promise((resolve) => setTimeout(resolve, index * 500)); // Delay each download
  
      const link = document.createElement("a");
      link.href = files;
      link.target = "_blank"
      link.setAttribute("download", files.split("/").pop() || "file"); // Ensure filename extraction
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    // }
  };
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
      <div className="col-lg-6 ">
        <Card className="h-100 shadow-sm p-3">
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardBody>
            <h4 className="text-primary">
              <span className="text-black">Case Name: </span> {order?.CaseName || "N/A"}
            </h4>
            <p><strong>Case Type:</strong> {order?.CaseTypeID || "N/A"}</p>
            <p><strong>File Number:</strong> {order?.FileNumber || "N/A"}</p>
            <p><strong>Case Number:</strong> {order?.CaseNumber || "N/A"}</p>
            <p><strong>Status:</strong> {order?.RequestStatus}</p>
            <p><strong>Urgent:</strong> {order?.IsRush ? "Yes" : "No"}</p>
            <p><strong>Needed By:</strong> { order?.NeededBy ? dayjs(order?.NeededBy).format("MMM DD, YYYY") : "N/A"}</p>
          </CardBody>
        </Card>
      </div>

      {/* Court Information */}
      <div className="col-lg-6 ">
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
            {/* {order?.record_details ? ( */}
              <>
                <p><strong>Record Type:</strong> {order?.record_details?.RecordType}</p>
                <p><strong>First Name:</strong> {order?.record_details?.PFirstName}</p>
                <p><strong>Last Name:</strong> {order?.record_details?.PLastName}</p>
                <p><strong>AKA:</strong> {order?.record_details?.PAKA}</p>
                <p><strong>SSN:</strong> {order?.record_details?.PSSN}</p>
                <p><strong>Address:</strong> {order?.record_details?.PAddress}</p>
                <p><strong>City:</strong> {order?.record_details?.PCity}</p>
                <p><strong>State:</strong> {order?.record_details?.PState}</p>
                <p><strong>Zip Code:</strong> {order?.record_details?.PZip}</p>
                <p><strong>Date of Injury:</strong> {dayjs(order?.record_details?.date_of_injury.from).format("MMM DD, YYYY")} - {dayjs(order?.record_details?.date_of_injury.to).format("MMM DD, YYYY")}</p>
              </>
            {/* ) : (
              <p>No record details available.</p>
            )} */}
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
            {order?.tblOrderCaseParties && order?.tblOrderCaseParties.length > 0 ? (
              order?.tblOrderCaseParties.map((participant, index) => (
                <div key={index} className="border-bottom pb-2 mb-2">
                  <p><strong>Type:</strong> {participant.PartyType}</p>
                  <p><strong>Represents:</strong> {participant.RepresentID}</p>
                  <p><strong>Phone:</strong> {participant.PartyPhone}</p>
                  <p><strong>City:</strong> {participant.PartyCity}</p>
                  <p><strong>State:</strong> {participant.PartyState}</p>
                  <p><strong>Claim:</strong> {participant.InsuranceClaim}</p>
                  <p><strong>Adjuster:</strong> {participant.InsuranceAdjuster}</p>
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
            {order?.TblOrderDocLocations && order?.TblOrderDocLocations?.length > 0 ? (
              order?.TblOrderDocLocations?.map((doc, index) =>{
                const filesArray = doc?.DocFilePath ? doc.DocFilePath : "";
                return (
                <div key={index} className="border-bottom pb-2 mb-2">
                  <p><strong>Name:</strong> {doc.LocationName}</p>
                  <p><strong>Address:</strong> {doc.LocationAddress}</p>
                  <p><strong>City:</strong> {doc.LocationCity}</p>
                  <p><strong>State:</strong> {doc.LocationState}</p>
                  <p><strong>Zip Code:</strong> {doc.LocationZip}</p>
                  <p><strong>Process Type:</strong> {doc.ProcessType}</p>
                  <p><strong>Record Type:</strong> {doc.RecordType}</p>
                  <p><strong>Review Request:</strong> {doc.review_request ? "Yes" : "No"}</p>
                  {filesArray.length > 0 && (
                <button
                  onClick={() => handleDownloadAll(filesArray)}
                  className="btn btn-primary d-block mt-2"
                >
                  Download Files
                </button>
              )}
                </div>
                
              )})
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
            <p><strong>Created By:</strong> {order?.createdByUser?.full_name || "N/A"}</p>
            <p><strong>Updated By:</strong> {order?.updatedByUser?.full_name || "N/A"}</p>
            <p><strong>Created At:</strong> {dayjs(order?.createdAt).format("MMM DD, YYYY HH:mm A")}</p>
            <p><strong>Updated At:</strong> {dayjs(order?.updatedAt).format("MMM DD, YYYY HH:mm A")}</p>
          </CardBody>
        </Card>
      </div>
    </div>
    </Page>
      </PageWrapper>
  );
};

export default OrderDetails;
