import React, { useEffect, useState } from "react";
import { data, useParams } from "react-router-dom";
import axios from "axios";
import DetailPage from "@/components/DetailPage";
import { Card } from "react-bootstrap";
import { formatDate } from "@/components/DateFormat";

const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

const HospitalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hospital, setHospital] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchHospital = async () => {
      try {
        const resp = await axios.get(
          `${baseURL}/hospital/hospital_all_data/${id}`
        );
        // tolerant extraction of hospital object from response
        console.log("Hospital detail response:", resp.data);
        const hospitalData = resp.data?.jsonData || resp.data;
        setHospital(hospitalData);
      } catch (err) {
        console.error("Failed to load hospital detail", err);
        setHospital(null);
      } finally {
        setLoading(false);
      }
    };
    fetchHospital();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!hospital) return <div>No hospital data found</div>;

  const sections = [
    {
      title: "Basic Info",
      fields: [
        { label: "Hospital ID", name: "hospital_id" },
        { label: "User ID", name: "hospital_user_id" },
        { label: "Hospital Name", name: "hospital_name" },
        // { label: "Name SKU", name: "hospital_name_sku" },
        { label: "Logo", name: "hospital_logo", type: "image" },
      ],
    },
    {
      title: "Contact & Address",
      fields: [
        { label: "Pincode", name: "hospital_pincode" },
        { label: "Contact No", name: "hospital_contact_no" },
        { label: "Alt Contact No", name: "hospital_alt_contact_no" },
        { label: "Service Status", name: "hospital_service_status" },
        { label: "City", name: "hospital_city_name" },
        {
          label: "Address",
          name: "hospital_address",
          type: "textarea",
          rows: 3,
        },
        { label: "Latitude", name: "hospital_lat" },
        { label: "Longitude", name: "hospital_long" },
      ],
    },
    {
      title: "Timestamps & Status",
      fields: [
        {
          label: "Updated Timestamp",
          name: "hospital_updated_time_stamp",
          type: "datetime-local",
        },
        {
          label: "Added Timestamp",
          name: "hospital_added_timestamp",
          type: "datetime-local",
        },
        { label: "Status", name: "hospital_status" },
      ],
    },
    {
      title: "Verification",
      fields: [
        { label: "Verified By", name: "verify_by" },
        { label: "Verify Date", name: "verify_date", type: "datetime-local" },
        { label: "Verify Status", name: "hospital_verify_status" },
        {
          label: "Hospital Verify Date",
          name: "hospital_verify_date",
          type: "datetime-local",
        },
      ],
    },
    {
      title: "Sub-directory & DB",
      fields: [
        { label: "Sub Directory", name: "hospital_sub_directory" },
        { label: "SD DB Name", name: "hospital_sd_db_name" },
        { label: "SD DB User", name: "hospital_sd_db_user" },
        { label: "SD DB Password", name: "hospital_sd_db_password" },
        { label: "SD Admin", name: "hospital_sd_admin" },
        { label: "SD Admin Password", name: "hospital_sd_admin_password" },
      ],
    },
    {
      title: "User",
      fields: [{ label: "Hospital Users Name", name: "hospital_users_name" }],
    },
  ];

  return (
    <div>
      <Card className="mb-4 mt-2 detailPage-header">
        <Card.Body className="py-3 d-flex flex-wrap align-items-center gap-3 justify-content-center">
          <div>
            <span className="h4 fw-semibold fs-4">ID:</span>{" "}
            <strong className="fs-4 text-muted">
              {hospital?.hospital_id || "N/A"}
            </strong>
          </div>
          <div className="h5 mb-0 fs-4 fw-semibold">{hospital?.hospital_name ?? "N/A"}</div>
        </Card.Body>
      </Card>

      <DetailPage data={hospital} sections={sections} editable={false} />
    </div>
  );
};

export default HospitalDetail;
