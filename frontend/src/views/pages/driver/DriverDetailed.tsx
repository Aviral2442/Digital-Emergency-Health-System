import React, { useEffect, useState } from "react";
import { Container, Nav, Spinner} from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import DriverDetails from "@/components/driver/DriverDetails";

const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

const DriverDetailed: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [activeTab, setActiveTab] = useState<number>(1);

  // Driver state
  const [loading, setLoading] = useState<boolean>(true);
  const [driverData, setDriverData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch driver detail
  const fetchDriver = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.post(`${baseURL}/driver/driver_detail/${id}`);
      const driver = resp.data?.jsonData?.driver;
      if (!driver) {
        setError("Driver not found");
        setDriverData(null);
      } else {
        setDriverData(driver);
      }
    } catch (err: any) {
      console.error("Failed to fetch driver:", err);
      setError(err?.message || "Failed to fetch driver details");
      setDriverData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 1 && !driverData && !loading) {
      fetchDriver();
    }
  }, [activeTab, id]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchDriver();
    }
  }, [id]);

  const tabs = [
    { eventKey: 1, title: "Driver" },
  ];

  return (
    <Container fluid className="p-0">
      {loading && activeTab === 1 ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading driver details...</p>
        </div>
      ) : (
        <div className="m-3 ms-0">
          <Nav variant="tabs" className="mb-3">
            {tabs.map((tab) => (
              <Nav.Item key={tab.eventKey}>
                <Nav.Link
                  active={activeTab === tab.eventKey}
                  onClick={() => setActiveTab(tab.eventKey)}
                  style={{ cursor: "pointer" }}
                >
                  {tab.title}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          <div className="tab-content">
            {activeTab === 1 && (
              <div>
                <DriverDetails data={driverData} loading={loading} error={error} />
              </div>
            )}
          </div>
        </div>
      )}
    </Container>
  );
};

export default DriverDetailed;