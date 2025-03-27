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
  
    for (const [index, fileUrl] of files.entries()) {
      await new Promise((resolve) => setTimeout(resolve, index * 500)); // Delay each download
  
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", fileUrl.split("/").pop() || "file"); // Ensure filename extraction
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
              <span className="text-black">Case Name: </span> {order?.case_name || "N/A"}
            </h4>
            <p><strong>Case Type:</strong> {order?.case_type || "N/A"}</p>
            <p><strong>File Number:</strong> {order?.file_number || "N/A"}</p>
            <p><strong>Case Number:</strong> {order?.case_number || "N/A"}</p>
            <p><strong>Status:</strong> {order?.status}</p>
            <p><strong>Urgent:</strong> {order?.urgent ? "Yes" : "No"}</p>
            <p><strong>Needed By:</strong> {dayjs(order?.needed_by).format("MMM DD, YYYY")}</p>
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
            <p><strong>Court Name:</strong> {order?.court_name || "N/A"}</p>
            <p><strong>Address:</strong> {order?.court_address || "N/A"}</p>
            <p><strong>City:</strong> {order?.court_city || "N/A"}</p>
            <p><strong>State:</strong> {order?.court_state || "N/A"}</p>
            <p><strong>Zip Code:</strong> {order?.court_zip || "N/A"}</p>
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
            {order?.record_details ? (
              <>
                <p><strong>Record Type:</strong> {JSON.parse(order?.record_details).record_type}</p>
                <p><strong>First Name:</strong> {JSON.parse(order?.record_details).first_name}</p>
                <p><strong>Last Name:</strong> {JSON.parse(order?.record_details).last_name}</p>
                <p><strong>AKA:</strong> {JSON.parse(order?.record_details).aka}</p>
                <p><strong>SSN:</strong> {JSON.parse(order?.record_details).ssn}</p>
                <p><strong>Address:</strong> {JSON.parse(order?.record_details).record_address}</p>
                <p><strong>City:</strong> {JSON.parse(order?.record_details).record_city}</p>
                <p><strong>State:</strong> {JSON.parse(order?.record_details).record_state}</p>
                <p><strong>Zip Code:</strong> {JSON.parse(order?.record_details).record_zip}</p>
                <p><strong>Date of Injury:</strong> {dayjs(JSON.parse(order?.record_details).date_of_injury.from).format("MMM DD, YYYY")} - {dayjs(JSON.parse(order?.record_details).date_of_injury.to).format("MMM DD, YYYY")}</p>
              </>
            ) : (
              <p>No record details available.</p>
            )}
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
            {order?.Participants && order?.Participants.length > 0 ? (
              order?.Participants.map((participant, index) => (
                <div key={index} className="border-bottom pb-2 mb-2">
                  <p><strong>Type:</strong> {participant.type}</p>
                  <p><strong>Represents:</strong> {participant.represents}</p>
                  <p><strong>Phone:</strong> {participant.phone}</p>
                  <p><strong>City:</strong> {participant.city}</p>
                  <p><strong>State:</strong> {participant.state}</p>
                  <p><strong>Claim:</strong> {participant.claim}</p>
                  <p><strong>Adjuster:</strong> {participant.adjuster}</p>
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
            {order?.DocumentLocations && order?.DocumentLocations?.length > 0 ? (
              order?.DocumentLocations?.map((doc, index) =>{
                const filesArray = doc?.files ? doc.files : [];
                return (
                <div key={index} className="border-bottom pb-2 mb-2">
                  <p><strong>Name:</strong> {doc.name}</p>
                  <p><strong>Address:</strong> {doc.address}</p>
                  <p><strong>City:</strong> {doc.city}</p>
                  <p><strong>State:</strong> {doc.state}</p>
                  <p><strong>Zip Code:</strong> {doc.zip}</p>
                  <p><strong>Process Type:</strong> {doc.process_type}</p>
                  <p><strong>Record Type:</strong> {doc.record_type}</p>
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
