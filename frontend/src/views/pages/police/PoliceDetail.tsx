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
        const resp = await axios.get(
          `${baseURL}/police/police_all_data/${id}`
        );
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

  const sections = [
    {
      title: "Basic Information",
      fields: [
        { label: "Police ID", name: "police_id" },
        { label: "First Name", name: "police_name" },
        { label: "Last Name", name: "police_last_name" },
        { label: "Mobile", name: "police_mobile", type: "tel" as const },
        { label: "Wallet Amount", name: "police_wallet_amount", type: "number" as const },
        { label: "Date of Birth", name: "police_dob", type: "date" as const },
        { label: "Gender", name: "police_gender" },
        { label: "City Name", name: "city_name" },
      ],
    },
    {
      title: "Vehicle Assignment",
      fields: [
        { label: "Assigned Vehicle ID", name: "police_assigned_vehicle_id" },
        { label: "Vehicle Name", name: "v_vehicle_name" },
        { label: "Vehicle RC Number", name: "vehicle_rc_number" },
      ],
    },
    {
      title: "Partner Information",
      fields: [
        { label: "Created By", name: "police_created_by" },
        { label: "Created Partner ID", name: "police_created_partner_id" },
        { label: "Partner Full Name", name: "partner_full_name" },
        { label: "Partner Mobile", name: "partner_mobile", type: "tel" as const },
        { label: "Partner Auth Key", name: "partner_auth_key" },
      ],
    },
    {
      title: "Registration & Status",
      fields: [
        { label: "Registration Step", name: "police_registration_step" },
        { label: "OTP Verification", name: "police_otp_verification" },
        { label: "Duty Status", name: "police_duty_status" },
        { label: "Status", name: "police_status" },
        { label: "On Booking Status", name: "police_on_booking_status" },
        { label: "Auth Key", name: "police_auth_key" },
      ],
    },
    {
      title: "Statistics & Performance",
      fields: [
        { label: "Total Rides Till Today", name: "police_total_ride_till_today", type: "number" as const },
        { label: "Rating", name: "police_rating", type: "number" as const },
        {
          label: "Last Booking Notified Time",
          name: "police_last_booking_notified_time",
          type: "datetime-local" as const,
        },
      ],
    },
    {
      title: "Verification & Bonus",
      fields: [
        { label: "Verified By", name: "verify_by" },
        { label: "Verify Date", name: "police_verify_date", type: "datetime-local" as const },
        { label: "Join Bonus Status", name: "join_bonus_status" },
        { label: "Join Bonus Time", name: "join_bonus_time", type: "datetime-local" as const },
      ],
    },
    {
      title: "Technical Information",
      fields: [
        { label: "FCM Token", name: "police_fcm_token" },
        { label: "Profile Image", name: "police_profile_img" },
        { label: "Created At", name: "created_at", type: "datetime-local" as const },
        { label: "Updated At", name: "updated_at", type: "datetime-local" as const },
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
        </Card.Body>
      </Card>

      <DetailPage data={police} sections={sections} editable={false} />
    </div>
  );
};

export default PoliceDetail;