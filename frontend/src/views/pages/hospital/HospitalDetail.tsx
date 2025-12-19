import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DetailPage from "@/components/DetailPage";
import { Card } from "react-bootstrap";
import { ColumnSizing } from "@tanstack/react-table";

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

  const hospitalServiceStatus = () => {
    switch (hospital?.hospital_service_status) {
      case "0":
        return "Available 24/7 Service";
      case "1":
        return "Not available";
      default:
        return "Unknown";
    }
  };

  const hospitalStatus = () => {
    switch (hospital?.hospital_status) {
      case "0":
        return "Verified";
      case "1":
        return "Blocked";
      default:
        return "Unknown";
    }
  };

  const sections = [
    {
      title: "Basic Info",
      fields: [
        // { label: "Hospital ID", name: "hospital_id" },
        { label: "Logo", name: "hospital_logo" },
        { label: "Hospital Name", name: "hospital_name" },
        // { label: "User ID", name: "hospital_user_id" },
        { label: "User Name", name: "hospital_users_name" },
        { label: "User Mobile", name: "hospital_users_mobile" },
        // { label: "Name SKU", name: "hospital_name_sku" },
        // removed unsupported type "image" to satisfy FieldConfig union
      ],
    },
    {
      title: "Contact & Address",
      fields: [
        { label: "Pincode", name: "hospital_pincode", cols: 2},
        { label: "Contact No", name: "hospital_contact_no", cols: 2},
        { label: "Alt Contact No", name: "hospital_alt_contact_no", cols: 2},
        {
          label: "Service Status",
          name: "hospital_service_status",
          render: hospitalServiceStatus,
          cols: 2
        },
        { label: "City", name: "city_name", cols:2 },
        { label: "Latitude", name: "hospital_lat", cols: 2 },
        { label: "Longitude", name: "hospital_long", cols: 2 },
        {
          label: "Address",
          name: "hospital_address",
          // type: "textarea" as const,
          // rows: 3,
          cols: 6,
        },
      ],
    },
    {
      title: "Verification & Status",
      fields: [
        {
          label: "Added Timestamp",
          name: "hospital_added_timestamp",
          type: "datetime-local" as const,
          cols: 2,
        },
        { label: "Verified By", name: "verify_by", cols: 2 },
        { label: "Verify Date", name: "verify_date", type: "datetime-local" as const, cols: 2 },
        { label: "Verify Status", name: "hospital_verify_status", cols: 2 },
        {
          label: "Hospital Verify Date",
          name: "hospital_verify_date",
          type: "datetime-local" as const,
          cols: 2,
        },
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
              {hospital?.hospital_id || "N/A"}
            </strong>
          </div>
          <div className="h5 mb-0 fs-4 fw-semibold">
            {hospital?.hospital_name ?? "N/A"}
          </div>
          <div>
            <span className="h4 fw-semibold fs-4">Status:</span>{" "}
            <strong className="fs-4 text-muted">
              {hospitalStatus()}
            </strong>
          </div>
        </Card.Body>
      </Card>

      <DetailPage data={hospital} sections={sections} editable={false} />
    </div>
  );
};

export default HospitalDetail;
