import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Alert, Image } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import ComponentCard from "@/components/ComponentCard";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "@/global.css";

const policeValidationSchema = Yup.object({
  police_name: Yup.string().required("First name is required"),
  police_last_name: Yup.string().required("Last name is required"),
  police_mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  police_dob: Yup.date().required("Date of birth is required"),
  police_gender: Yup.string().required("Gender is required"),
  police_state: Yup.string().required("State is required"),
  police_city_id: Yup.string().required("City is required"),
});

const AddPolice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partners, setPartners] = useState<Array<{ partner_id: number; partner_f_name: string, partner_l_name: string, partner_mobile: string }>>([]);
  const [states, setStates] = useState<Array<{ state_id: number; state_name: string }>>([]);
  const [cities, setCities] = useState<Array<{ city_id: number; city_name: string }>>([]);

  const [initialValues, setInitialValues] = useState({
    police_profile_img: null as File | null,
    police_name: "",
    police_last_name: "",
    police_mobile: "",
    police_dob: "",
    police_gender: "",
    police_state: "",
    police_city_id: "",
    police_created_by: "",
    police_created_partner_id: "",
  });

  useEffect(() => {
    if (isEditMode) {
      fetchPoliceDetails();
    }
  }, [id]);

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${baseURL}/get_states`);
      setStates(response.data?.jsonData?.state_list || []);
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
    }
  };

  const fetchCitiesByState = async (stateId: string) => {
    if (!stateId) {
      setCities([]);
      return;
    }
    try {
      const response = await axios.get(`${baseURL}/get_cities/${stateId}`);
      setCities(response.data?.jsonData?.city_list || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    }
  };

  const fetchPartners = async () => {
    try {
      const response = await axios.get(`${baseURL}/get_partners_list`);
      setPartners(response.data?.jsonData?.partners || []);
    } catch (error) {
      console.error("Error fetching partners:", error);
      setPartners([]);
    }
  };

  React.useEffect(() => {
    fetchStates();
    fetchPartners();
  }, []);

  const fetchPoliceDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/police/fetch_police/${id}`
      );
      const police = response.data?.jsonData?.police;
      console.log("Fetched police details:", police);
      
      const dobDate = police.police_dob
        ? new Date(police.police_dob * 1000).toISOString().split("T")[0]
        : "";

      // Fetch state ID from city ID
      let stateId = "";
      if (police.police_city_id) {
        try {
          const stateResponse = await axios.get(`${baseURL}/get_state_id/${police.police_city_id}`);
          stateId = stateResponse.data?.jsonData?.state_id?.toString() || "";
          
          if (stateId) {
            await fetchCitiesByState(stateId);
          }
        } catch (error) {
          console.error("Error fetching state from city:", error);
        }
      }

      setInitialValues({
        police_profile_img: null,
        police_name: police.police_name || "",
        police_last_name: police.police_last_name || "",
        police_mobile: police.police_mobile?.toString() || "",
        police_dob: dobDate,
        police_gender: police.police_gender || "",
        police_state: stateId,
        police_city_id: police.police_city_id?.toString() || "",
        police_created_by: police.police_created_by?.toString() || "",
        police_created_partner_id: police.police_created_partner_id?.toString() || "",
      });

      if (police.police_profile_img) {
        setPreviewImage(`${baseURL}/${police.police_profile_img}`);
      }
    } catch (err: any) {
      console.error("Error fetching police details:", err);
      setError(err.response?.data?.message || "Failed to fetch police details");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFieldValue("police_profile_img", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>, setFieldValue: any) => {
    const stateId = e.target.value;
    setFieldValue("police_state", stateId);
    setFieldValue("police_city_id", ""); // Reset city when state changes
    await fetchCitiesByState(stateId);
  };

  const handleSubmit = async (values: typeof initialValues) => {
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();

      if (values.police_profile_img) {
        formData.append("police_profile_img", values.police_profile_img);
      }

      formData.append("police_name", values.police_name);
      formData.append("police_last_name", values.police_last_name);
      formData.append("police_mobile", values.police_mobile);
      formData.append("police_dob", values.police_dob);
      formData.append("police_gender", values.police_gender);
      // Note: Not appending police_state - only city_id is sent to backend
      formData.append("police_city_id", values.police_city_id);
      formData.append("police_created_by", values.police_created_by);
      formData.append("police_created_partner_id", values.police_created_partner_id);

      let response;
      if (isEditMode) {
        response = await axios.put(
          `${baseURL}/police/update_police/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(
          `${baseURL}/police/add_police`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      console.log("Police saved successfully:", response.data);
      if (response.data.status === 201 || response.data.status === 200) {
        navigate("/police");
      }
    } catch (err: any) {
      console.error(
        `Error ${isEditMode ? "updating" : "adding"} police:`,
        err
      );
      setError(
        err.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} police`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ComponentCard
        title={isEditMode ? "Edit Police" : "Add New Police"}
        className="m-2"
      >
        <div className="text-center py-4">Loading police details...</div>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard
      title={isEditMode ? "Edit Police" : "Add New Police"}
      className="m-2"
    >
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={policeValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              {/* Profile Image */}
              <Col lg={10}>
                <Card className="border">
                  <Card.Body>
                    <Form.Group>
                      <Form.Label className="fs-6 fw-semibold">
                        Profile Image{" "}
                        {!isEditMode && <span className="text-danger">*</span>}
                      </Form.Label>
                      <Form.Control
                        type="file"
                        name="police_profile_img"
                        accept="image/*"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleImageChange(e, setFieldValue)
                        }
                        onBlur={handleBlur}
                      />
                      {isEditMode && (
                        <Form.Text className="text-muted">
                          Leave empty to keep current image
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={2}>
                {previewImage && (
                  <div className="">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      thumbnail
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                  </div>
                )}
              </Col>

              {/* Basic Information */}
              <Col lg={12}>
                <Card className="border">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">Basic Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            First Name <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="police_name"
                            value={values.police_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.police_name && !!errors.police_name
                            }
                            placeholder="Enter first name"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.police_name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={3}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Last Name <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="police_last_name"
                            value={values.police_last_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.police_last_name && !!errors.police_last_name
                            }
                            placeholder="Enter last name"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.police_last_name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={3}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Mobile Number <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="police_mobile"
                            value={values.police_mobile}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.police_mobile && !!errors.police_mobile
                            }
                            placeholder="Enter 10 digit mobile number"
                            maxLength={10}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.police_mobile}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={3}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Date of Birth <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="police_dob"
                            value={values.police_dob}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.police_dob && !!errors.police_dob
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.police_dob}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Gender <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            name="police_gender"
                            value={values.police_gender}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.police_gender && !!errors.police_gender
                            }
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.police_gender}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            State <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            name="police_state"
                            value={values.police_state}
                            onChange={(e) => handleStateChange(e, setFieldValue)}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.police_state && !!errors.police_state
                            }
                          >
                            <option value="">Select State</option>
                            {states.map((state) => (
                              <option key={state.state_id} value={state.state_id}>
                                {state.state_name}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.police_state}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            City <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            name="police_city_id"
                            value={values.police_city_id}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.police_city_id && !!errors.police_city_id
                            }
                            disabled={!values.police_state}
                          >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                              <option key={city.city_id} value={city.city_id}>
                                {city.city_name}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.police_city_id}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {/* Administrative Information */}
              <Col lg={12}>
                <Card className="border">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">Administrative Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Created By <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            name="police_created_by"
                            value={values.police_created_by}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.police_created_by && !!errors.police_created_by
                            }
                          >
                            <option value="">Select Creator</option>
                            <option value="0">Self</option>
                            <option value="1">Partner</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.police_created_by}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      {values.police_created_by === "1" && (
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fs-6 fw-semibold">
                              Partner ID <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                              name="police_created_partner_id"
                              value={values.police_created_partner_id}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={
                                touched.police_created_partner_id && !!errors.police_created_partner_id
                              }
                            >
                              <option value="">Select Partner</option>
                              {partners.map((partner) => (
                                <option key={partner.partner_id} value={partner.partner_id}>
                                  {partner.partner_f_name} {partner.partner_l_name} ({partner.partner_mobile})
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              {errors.police_created_partner_id}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      )}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {/* Action Buttons */}
              <Col lg={12}>
                <div className="d-flex gap-2 justify-content-end">
                  <button
                    type="button"
                    className="px-3 rounded text-black"
                    onClick={() => navigate("/police")}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting
                      ? isEditMode
                        ? "Updating..."
                        : "Saving..."
                      : isEditMode
                      ? "Update Police"
                      : "Save Police"}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </ComponentCard>
  );
};

export default AddPolice;
