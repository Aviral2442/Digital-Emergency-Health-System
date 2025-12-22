import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
} from "react-bootstrap";
import {
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  Polyline,
  TileLayer,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import markerShadowImg from "@/assets/images/leaflet/marker-shadow.png";
import L, { type LatLngExpression } from "leaflet";
import axios from "axios";
import React from "react";
import pickup from "@/assets/images/leaflet/pickup_marker.png";
import drop from "@/assets/images/leaflet/drop_marker.png";
import ambulance from "@/assets/images/leaflet/map_ambulance.png";
import driver from "@/assets/images/leaflet/ambulance_marker.png"

const Page = () => {
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
  const [bookingLiveLocations, setBookingLiveLocations] = React.useState([]);
  const [driverLiveLocations, setDriverLiveLocations] = React.useState([]);
  const [policeLiveLocations, setPoliceLiveLocations] = React.useState([]);
  const [hospitalLiveLocations, setHospitalLiveLocations] = React.useState([]);

  const fetchPoliceLiveLocations = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/dashboard/map_location_dashboard_counts`
      );
      console.log("Live Locations Response:", res.data);
      setBookingLiveLocations(res.data?.jsonData?.booking_locations || []);
      setDriverLiveLocations(res.data?.jsonData?.driver_locations || []);
      setPoliceLiveLocations(res.data?.jsonData?.police_locations || []);
      setHospitalLiveLocations(res.data?.jsonData?.hospital_locations || []);
    } catch (error) {
      console.error("Error fetching live locations:", error);
    }
  };

  React.useEffect(() => {
    fetchPoliceLiveLocations();
  }, []);

  const LayerControl = () => {
    const center: LatLngExpression = [22.59, 85.96];

    // Custom icons for different categories
    const policeIcon = L.icon({
      iconUrl:
        "https://api.iconify.design/material-symbols:local-police.svg?color=blue",
      shadowUrl: markerShadowImg,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const driverFreeIcon = L.icon({
      iconUrl:driver,
      shadowUrl: markerShadowImg,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const driverBookingIcon = L.icon({
      iconUrl:ambulance,
      shadowUrl: markerShadowImg,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const hospitalIcon = L.icon({
      iconUrl: "https://api.iconify.design/fa-solid:hospital-symbol.svg?color=red",
      shadowUrl: markerShadowImg,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Pickup icon - Orange
    const pickupIcon = L.icon({
      iconUrl: pickup,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Drop icon - Purple
    const dropIcon = L.icon({
      iconUrl: drop,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Custom cluster icons
    const createClusterCustomIcon = (cluster: any, color: string) => {
      return L.divIcon({
        html: `<span style="background-color: ${color}; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; opacity: 70%; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${cluster.getChildCount()}</span>`,
        className: "custom-marker-cluster",
        iconSize: L.point(40, 40, true),
      });
    };

    // Array of colors for polylines
    const polylineColors = [
      "#ff9900", // Orange
      "#e74c3c", // Red
      "#3498db", // Blue
      "#2ecc71", // Green
      "#9b59b6", // Purple
      "#f39c12", // Yellow-Orange
      "#1abc9c", // Turquoise
      "#e67e22", // Carrot
      "#16a085", // Green Sea
      "#d35400", // Pumpkin
    ];

    // Function to get color based on booking index
    const getPolylineColor = (index: number) => {
      return polylineColors[index % polylineColors.length];
    };

    // Decode polyline function (Google Polyline Algorithm)
    const decodePolyline = (encoded: string): [number, number][] => {
      if (!encoded) return [];
      const poly: [number, number][] = [];
      let index = 0,
        len = encoded.length;
      let lat = 0,
        lng = 0;

      while (index < len) {
        let b,
          shift = 0,
          result = 0;
        do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        const dlat = result & 1 ? ~(result >> 1) : result >> 1;
        lat += dlat;

        shift = 0;
        result = 0;
        do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        const dlng = result & 1 ? ~(result >> 1) : result >> 1;
        lng += dlng;

        poly.push([lat / 1e5, lng / 1e5]);
      }
      return poly;
    };

    return (
      <Card>
        <CardHeader className="d-block">
          <CardTitle as="h5" className="">
            Live Location Tracker
          </CardTitle>
          <div className="d-flex justify-content-between"> 
            <p className="text-muted mb-0">
            Live location tracking for drivers, police, hospitals, and booking
            routes. <br />
            driver = green | police = blue | hospital = red | booking pickup =
            orange | booking drop = purple
          </p>
          <div className="">
            <span className="border px-3 py-1 rounded">
              {bookingLiveLocations.length} Bookings
            </span>
            <span className="border px-3 py-1 rounded mx-2">
              {driverLiveLocations.length} Drivers
            </span>
            <span className="border px-3 py-1 rounded me-2">
                {policeLiveLocations.length} Police
            </span>
            <span className="border px-3 py-1 rounded">
                {hospitalLiveLocations.length} Hospitals
            </span>
          </div>
          </div>
        </CardHeader>
        <CardBody>
          <MapContainer
            center={center}
            zoom={5}
            scrollWheelZoom={true}
            style={{ height: "800px" }}
          >
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="Street">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              </LayersControl.BaseLayer>

              <LayersControl.BaseLayer name="CartoDB Dark">
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
              </LayersControl.BaseLayer>

              {/* Police Markers with Blue Clustering */}
              <LayersControl.Overlay checked name="Police">
                <MarkerClusterGroup
                  iconCreateFunction={(cluster: any) =>
                    createClusterCustomIcon(cluster, "#0066ff")
                  }
                  chunkedLoading
                >
                  {policeLiveLocations.map((police: any) => {
                    const lat = parseFloat(police.police_live_location_lat);
                    const lng = parseFloat(police.police_live_location_long);
                    if (!isNaN(lat) && !isNaN(lng)) {
                      return (
                        <Marker
                          key={police.police_id}
                          position={[lat, lng]}
                          icon={policeIcon}
                        >
                          <Popup>
                            <div>
                              <strong>Police Officer</strong>
                              <br />
                              {police.police_name || ""} ({police.police_mobile || ""})
                            </div>
                          </Popup>
                        </Marker>
                      );
                    }
                    return null;
                  })}
                </MarkerClusterGroup>
              </LayersControl.Overlay>

              {/* Driver Markers with Green Clustering */}
              <LayersControl.Overlay checked name="Drivers">
                <MarkerClusterGroup
                  iconCreateFunction={(cluster: any) =>
                    createClusterCustomIcon(cluster, "#00cc66")
                  }
                  chunkedLoading
                >
                  {driverLiveLocations.map((driver: any) => {
                    const lat = parseFloat(driver.driver_live_location_lat);
                    const lng = parseFloat(driver.driver_live_location_long);
                    if (!isNaN(lat) && !isNaN(lng)) {
                      // Determine icon based on booking status
                      const driverIcon = driver.driver_on_booking_status === "1" 
                        ? driverBookingIcon 
                        : driverFreeIcon;
                      
                      return (
                        <Marker
                          key={driver.driver_id}
                          position={[lat, lng]}
                          icon={driverIcon}
                        >
                          <Popup>
                            <div>
                              <strong>Driver</strong>
                              <br />
                              {driver.driver_name || ""} ({driver.driver_mobile || ""})                              
                              <br />
                              <strong>Status:</strong>{" "}
                              {driver.driver_on_booking_status === "1" ? "On Booking" : "Free"}
                            </div>
                          </Popup>
                        </Marker>
                      );
                    }
                    return null;
                  })}
                </MarkerClusterGroup>
              </LayersControl.Overlay>

              {/* Hospital Markers with Red Clustering */}
              <LayersControl.Overlay checked name="Hospitals">
                <MarkerClusterGroup
                  iconCreateFunction={(cluster: any) =>
                    createClusterCustomIcon(cluster, "#ff0000")
                  }
                  chunkedLoading
                >
                  {hospitalLiveLocations.map((hospital: any) => {
                    const lat = parseFloat(hospital.hospital_lat);
                    const lng = parseFloat(hospital.hospital_long);
                    if (!isNaN(lat) && !isNaN(lng)) {
                      return (
                        <Marker
                          key={hospital.hospital_id}
                          position={[lat, lng]}
                          icon={hospitalIcon}
                        >
                          <Popup>
                            <div>
                              <strong>Hospital</strong>
                              <br />
                              {hospital.hospital_name || ""}
                            </div>
                          </Popup>
                        </Marker>
                      );
                    }
                    return null;
                  })}
                </MarkerClusterGroup>
              </LayersControl.Overlay>

              {/* Booking Routes with Polylines and Orange/Purple Markers with Clustering */}
              <LayersControl.Overlay checked name="Booking Pickups">
                <MarkerClusterGroup
                  iconCreateFunction={(cluster: any) =>
                    createClusterCustomIcon(cluster, "#ff9900")
                  }
                  chunkedLoading
                >
                  {bookingLiveLocations.map((booking: any) => {
                    const pickLat = parseFloat(booking.booking_pick_lat);
                    const pickLng = parseFloat(booking.booking_pick_long);

                    if (!isNaN(pickLat) && !isNaN(pickLng)) {
                      return (
                        <Marker
                          key={`pickup-${booking.booking_id}`}
                          position={[pickLat, pickLng]}
                          icon={pickupIcon}
                        >
                          <Popup>
                            <div>
                              <strong style={{ color: "#ff9900" }}>
                                📍 Pickup Location
                              </strong>
                              <br />
                              <strong>Pickup:</strong>{" "}
                              {booking.booking_pickup || ""}
                            </div>
                          </Popup>
                        </Marker>
                      );
                    }
                    return null;
                  })}
                </MarkerClusterGroup>
              </LayersControl.Overlay>

              {/* Booking Drop Locations with Purple Clustering */}
              <LayersControl.Overlay checked name="Booking Drops">
                <MarkerClusterGroup
                  iconCreateFunction={(cluster: any) =>
                    createClusterCustomIcon(cluster, "#9933ff")
                  }
                  chunkedLoading
                >
                  {bookingLiveLocations.map((booking: any) => {
                    const dropLat = parseFloat(booking.booking_drop_lat);
                    const dropLng = parseFloat(booking.booking_drop_long);

                    if (!isNaN(dropLat) && !isNaN(dropLng)) {
                      return (
                        <Marker
                          key={`drop-${booking.booking_id}`}
                          position={[dropLat, dropLng]}
                          icon={dropIcon}
                        >
                          <Popup>
                            <div>
                              <strong style={{ color: "#9933ff" }}>
                                🏁 Drop Location
                              </strong>
                              <br />
                              <strong>Drop:</strong>{" "}
                              {booking.booking_drop || "N/A"}
                            </div>
                          </Popup>
                        </Marker>
                      );
                    }
                    return null;
                  })}
                </MarkerClusterGroup>
              </LayersControl.Overlay>

              {/* Booking Polylines Routes */}
              <LayersControl.Overlay checked name="Booking Routes">
                <LayerGroup>
                  {bookingLiveLocations.map((booking: any, index: number) => {
                    const polyline = booking.booking_polyline;
                    const routeColor = getPolylineColor(index);

                    if (polyline) {
                      const decodedPath = decodePolyline(polyline);
                      if (decodedPath.length > 0) {
                        return (
                          <Polyline
                            key={`polyline-${booking.booking_id}`}
                            positions={decodedPath}
                            color={routeColor}
                            weight={4}
                            opacity={0.7}
                          >
                            <Popup>
                              <div>
                                <strong>Booking Route</strong>
                                <br />
                                <strong>From:</strong>{" "}
                                {booking.booking_pickup || "N/A"}
                                <br />
                                <strong>To:</strong>{" "}
                                {booking.booking_drop || "N/A"}
                              </div>
                            </Popup>
                          </Polyline>
                        );
                      }
                    }
                    return null;
                  })}
                </LayerGroup>
              </LayersControl.Overlay>
            </LayersControl>
          </MapContainer>
        </CardBody>
      </Card>
    );
  };

  return (
    <Row>
      <Col xl={12}>
        <LayerControl />
      </Col>
    </Row>
  );
};

export default Page;
