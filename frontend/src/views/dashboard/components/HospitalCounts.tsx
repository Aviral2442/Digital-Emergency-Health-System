import {Card, CardBody, CardFooter, ProgressBar} from 'react-bootstrap'
import {LuUsers} from 'react-icons/lu'
import CountUp from "react-countup";
import React from 'react'
import axios from 'axios';

const ActiveUsers = () => {

    const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

    const [hospital, setHospital] = React.useState({
        hospital_total: 0,
        available_247_hospital: 0,
        unavailable_hospital: 0,
        varified_hospital: 0
    })
    const [isLoading, setIsLoading] = React.useState(true)

    const fetchHospitalCounts = async () => {
        try{
            setIsLoading(true)
            const res = await axios.get(`${baseURL}/dashboard/hospital_dashboard_counts`)
            console.log("API Response of VENDORS: ",res.data?.jsonData?.hospital_status_counts)
            setHospital(res.data?.jsonData?.hospital_status_counts || {})
        } catch (error){
            console.error("Error fetching VENDORS: ", error)
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        fetchHospitalCounts();
    }, [])

    const {  available_247_hospital, unavailable_hospital, hospital_total, varified_hospital } = hospital;

    if (isLoading) {
        return (
            <Card className="card-h-100">
                <CardBody>
                    <div className="text-center">Loading...</div>
                </CardBody>
            </Card>
        )
    }

    return (
        <Card className="card" style={{ maxHeight: '230px' }}>
            <CardBody>
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 className="text-uppercase mb-2">Hospital's</h5>
                        <h3 className="mb-0 fw-normal">
                        <span>
                          <CountUp end={Number(hospital_total) || 0} duration={2} enableScrollSpy scrollSpyOnce/>
                        </span>
                        </h3>
                        <p className="text-muted mb-2">Total</p>
                    </div>
                    <div>
                        <LuUsers className="text-muted fs-24 svg-sw-10"/>
                    </div>
                </div>

                <ProgressBar now={available_247_hospital} className="progress-lg mb-2"/>

                <div className="d-flex justify-content-between">
                    <div>
                        <span className="text-muted">24/7 Available</span>
                        <h5 className="mb-0">{available_247_hospital}</h5>
                    </div>
                    <div className="text-end">
                        <span className="text-muted">Unavailable</span>
                        <h5 className="mb-0">{unavailable_hospital}</h5>
                    </div>
                </div>
            </CardBody>
            <CardFooter className="text-muted text-center">{varified_hospital} Verified Hospitals</CardFooter>
        </Card>
    )
}

export default ActiveUsers