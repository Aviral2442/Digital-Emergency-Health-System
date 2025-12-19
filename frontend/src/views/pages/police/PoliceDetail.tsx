import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DetailPage from "@/components/DetailPage";
import { Card } from "react-bootstrap";

const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

const PoliceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [police, setPolice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPolice = async () => {
      try {
        const resp = await axios.get(`${baseURL}/police/police_all_data/${id}`);
        console.log("Police detail response:", resp.data);
        const policeData = resp.data?.jsonData?.police || resp.data;
        setPolice(policeData);
      } catch (err) {
        console.error("Failed to load police detail", err);
        setPolice(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPolice();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!police) return <div>No police data found</div>;

  const PoliceCreatedBy = [
    { value: "0", label: "Self" },
    { value: "1", label: "Partner" },
  ];

  const OTPVerification = [
    { value: "0", label: "Verified" },
    { value: "1", label: "Un-Verified" },
  ];

  const PoliceStatus = [
    { value: "0", label: "New Police" },
    { value: "1", label: "Active Police" },
    { value: "2", label: "Inactive Police" },
    { value: "3", label: "Deleted Police" },
    { value: "4", label: "Applied for Verification" },
  ];

  const BookingStatus = [
    { value: "0", label: "Free" },
    { value: "1", label: "In Booking" },
  ];

  const sections = [
    {
      title: "Basic Information",
      fields: [
        {
          label: "Profile Image",
          name: "police_profile_img",
          cols: 3,
          render: () => {
            if (!police?.police_profile_img) return "No Image";
            return `<img src="${baseURL}/${police.police_profile_img}" alt="Profile" class="img-thumbnail" style="max-width: 100px; max-height: 100px;" />`;
          },
        },
        { label: "First Name", name: "police_name", cols: 3 },
        { label: "Last Name", name: "police_last_name", cols: 3 },
        {
          label: "Mobile",
          name: "police_mobile",
          type: "tel" as const,
          cols: 3,
        },
        {
          label: "Wallet Amount",
          name: "police_wallet_amount",
          type: "number" as const,
          cols: 3,
        },
        {
          label: "Date of Birth",
          name: "police_dob",
          type: "date" as const,
          cols: 3,
        },
        { label: "Gender", name: "police_gender", cols: 3 },
        { label: "City Name", name: "city_name", cols: 3 },
        {
          label: "Created By",
          name: "police_created_by",
          type: "select" as const,
          options: PoliceCreatedBy,
          cols: 3,
        },
        {
          label: "Status",
          name: "police_status",
          type: "select" as const,
          options: PoliceStatus,
          cols: 3,
        },
        {
          label: "Created At",
          name: "created_at",
          type: "datetime-local" as const,
          cols: 3,
        },
      ],
    },
    {
      title: "Vehicle and Partner Details",
      fields: [
        // { label: "Assigned Vehicle ID", name: "police_assigned_vehicle_id" },
        { label: "Vehicle Name", name: "v_vehicle_name", cols: 3 },
        { label: "Vehicle RC Number", name: "vehicle_rc_number", cols: 3 },
        { label: "Partner Full Name", name: "partner_full_name", cols: 3 },
        {
          label: "Partner Mobile",
          name: "partner_mobile",
          type: "tel" as const,
          cols: 3,
        },
      ],
    },
    {
      title: "Registration & Status",
      fields: [
        // { label: "Registration Step", name: "police_registration_step" },
        {
          label: "OTP Verification",
          name: "police_otp_verification",
          type: "select" as const,
          options: OTPVerification,
        },
        {
          label: "On Booking Status",
          name: "police_on_booking_status",
          type: "select" as const,
          options: BookingStatus,
        },
        // { label: "Auth Key", name: "police_auth_key" },
      ],
    },
  ];

  return (
    <div>
      <Card className="mb-4 mt-2 detailPage-header">
        <Card.Body className="py-3 d-flex flex-wrap align-items-center gap-3 justify-content-center">
          <div>
            <span className="h4 fw-semibold fs-4">ID:</span>{" "}
            <strong className="fs-4 text-muted">
              {police?.police_id || "N/A"}
            </strong>
          </div>
          <div className="h5 mb-0 fs-4 fw-semibold">
            {police?.police_name || ""} {police?.police_last_name || ""}
          </div>
          <div>
            <span className="h4 fw-semibold fs-4">Duty:</span>{" "}
            <strong className="fs-4 text-muted">
              {police?.police_duty_status || "N/A"}
            </strong>
          </div>
        </Card.Body>
      </Card>

      <DetailPage data={police} sections={sections} editable={false} />
    </div>
  );
};

export default PoliceDetail;
