import {Card, CardBody, CardFooter, ProgressBar} from 'react-bootstrap'
import {LuUsers} from 'react-icons/lu'
import CountUp from "react-countup";
import React from 'react'
import axios from 'axios';

const ActiveUsers = () => {

    const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

    const [driver, setDriver] = React.useState({
        driver_total: 0,
        onDuty_driver: 0,
        offDuty_driver: 0,
        active_driver: 0
    })
    const [isLoading, setIsLoading] = React.useState(true)

    const fetchDriverCounts = async () => {
        try{
            setIsLoading(true)
            const res = await axios.get(`${baseURL}/dashboard/driver_dashboard_counts`)
            console.log("API Response of Driver: ",res.data?.jsonData?.driver_status_counts)
            setDriver(res.data?.jsonData?.driver_status_counts || {})
        } catch (error){
            console.error("Error fetching Driver: ", error)
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        fetchDriverCounts();
    }, [])

    const { active_driver, offDuty_driver, driver_total, onDuty_driver } = driver;

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
                        <h5 className="text-uppercase mb-2">Driver's</h5>
                        <h3 className="mb-0 fw-normal">
                        <span>
                          <CountUp end={Number(driver_total) || 0} duration={2} enableScrollSpy scrollSpyOnce/>
                        </span>
                        </h3>
                        <p className="text-muted mb-2">Total</p>
                    </div>
                    <div>
                        <LuUsers className="text-muted fs-24 svg-sw-10"/>
                    </div>
                </div>

                <ProgressBar now={onDuty_driver} className="progress-lg mb-2"/>

                <div className="d-flex justify-content-between">
                    <div>
                        <span className="text-muted">On Duty</span>
                        <h5 className="mb-0">{onDuty_driver}</h5>
                    </div>
                    <div className="text-end">
                        <span className="text-muted">Off Duty</span>
                        <h5 className="mb-0">{offDuty_driver}</h5>
                    </div>
                </div>
            </CardBody>
            <CardFooter className="text-muted text-center">{active_driver} Active Drivers</CardFooter>
        </Card>
    )
}

export default ActiveUsers