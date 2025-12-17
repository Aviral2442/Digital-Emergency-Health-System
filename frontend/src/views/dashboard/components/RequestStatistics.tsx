import { Card, CardBody, CardHeader, CardTitle, Col, Row } from "react-bootstrap"
import { LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import marketImg from '@/assets/images/leaflet/marker-icon.png'
import markerShadowImg from '@/assets/images/leaflet/marker-shadow.png'
import L, { type LatLngExpression } from 'leaflet'


const LayerControl = () => {
    const center: LatLngExpression = [22.59, 85.96]

    const customIcon = L.icon({
        iconUrl: marketImg,
        shadowUrl: markerShadowImg,
    })

    return (
        <Card>
            <CardHeader className="d-block">
                <CardTitle as="h5" className="mb-1">
                    Live Location Tracker
                </CardTitle>
                <p className="text-muted mb-0">Live location tracking for drivers, police, hospitals, and booking routes.</p>
            </CardHeader>
            <CardBody>
                <MapContainer center={center} zoom={5} scrollWheelZoom={false} style={{ height: '750px' }}>
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

                        <LayersControl.Overlay checked name="Cities">
                            <LayerGroup>
                                <Marker position={[26.8, 80.9]} icon={customIcon}>
                                    <Popup>This is Littleton, CO.</Popup>
                                </Marker>
                                <Marker position={[28.7, 77.10]} icon={customIcon}>
                                    <Popup>This is Denver, CO.</Popup>
                                </Marker>
                                <Marker position={[18.9, 72.8]} icon={customIcon}>
                                    <Popup>This is Aurora, CO.</Popup>
                                </Marker>
                                <Marker position={[23.25, 77.41]} icon={customIcon}>
                                    <Popup>This is Golden, CO.</Popup>
                                </Marker>
                            </LayerGroup>
                        </LayersControl.Overlay>
                    </LayersControl>
                </MapContainer>
            </CardBody>
        </Card>
    )
}

const Page = () => {
    return (
        <Row>
            <Col xl={12}>
                <LayerControl />
            </Col>
        </Row>
    )
}

export default Page