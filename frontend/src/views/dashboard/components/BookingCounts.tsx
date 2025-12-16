import {Card, CardBody, CardFooter, ProgressBar} from 'react-bootstrap'
import {LuUsers} from 'react-icons/lu'
import CountUp from "react-countup";
import React from 'react'
// import axios from 'axios';

const ActiveUsers = () => {

    // const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

    const [vendors, _setVendors] = React.useState({
        today_new_vendors: 5,
        active_vendors: 5,
        other_status_vendors: 25,
        total_vendors: 30
    })
    const [isLoading, setIsLoading] = React.useState(true)

    const fetchVendorCounst = async () => {
        try{
            setIsLoading(true)
            // const res = await axios.get(`${baseURL}/dashboard/get_total_active_other_status_vendor_counts`)
            // console.log("API Response of VENDORS: ",res.data?.jsonData?.vendorCounts)
            // setVendors(res.data?.jsonData?.vendorCounts || {})
        } catch (error){
            console.error("Error fetching VENDORS: ", error)
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        fetchVendorCounst();
    }, [])

    const { active_vendors, other_status_vendors, total_vendors } = vendors;

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
                        <h5 className="text-uppercase fs-5 mb-2">Booking's</h5>
                        <h3 className="mb-0 fw-normal">
                        <span>
                          <CountUp end={Number(total_vendors) || 0} duration={2} enableScrollSpy scrollSpyOnce/>
                        </span>
                        </h3>
                        <p className="text-muted mb-2">Total</p>
                    </div>
                    <div>
                        <LuUsers className="text-muted fs-24 svg-sw-10"/>
                    </div>
                </div>

                <ProgressBar now={active_vendors} className="progress-lg mb-2"/>

                <div className="d-flex justify-content-between">
                    <div>
                        <span className="text-muted">On going</span>
                        <h5 className="mb-0">{active_vendors}</h5>
                    </div>
                    <div className="text-end">
                        <span className="text-muted">New</span>
                        <h5 className="mb-0">{other_status_vendors}</h5>
                    </div>
                </div>
            </CardBody>
            <CardFooter className="text-muted text-center">{8} Active Data Currently We Have</CardFooter>
        </Card>
    )
}

export default ActiveUsers