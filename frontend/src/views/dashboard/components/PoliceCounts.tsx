import { Card, CardBody, CardFooter, ProgressBar } from 'react-bootstrap'
import { LuUsers } from 'react-icons/lu'
import CountUp from "react-countup";
import React from 'react'
import axios from 'axios';

const ActiveUsers = () => {

    const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

    const [policeCounts, setPoliceCounts] = React.useState({
        police_total: 0,
        onDuty_police: 0,
        offDuty_police: 0,
        active_police: 0
    })

    const [isLoading, setIsLoading] = React.useState(true)

    const fetchVendorCounts = async () => {
        try {
            setIsLoading(true)
            const res = await axios.get(`${baseURL}/dashboard/police_dashboard_counts`)
            // console.log("API Response of Police: ", res.data?.jsonData?.police_status_counts)
            setPoliceCounts(res.data?.jsonData?.police_status_counts || {})
        } catch (error) {
            console.error("Error fetching POLICE COUNTS: ", error)
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        fetchVendorCounts();
    }, []);

    const {
        police_total,
        onDuty_police,
        offDuty_police,
        active_police
    } = policeCounts;

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
                        <h5 className="text-uppercase fs-5 mb-2">Police's</h5>
                        <h3 className="mb-0 fw-normal">
                            <span>
                                <CountUp end={Number(police_total) || 0} duration={2} enableScrollSpy scrollSpyOnce />
                            </span>
                        </h3>
                        <p className="text-muted mb-2">Total</p>
                    </div>
                    <div>
                        <LuUsers className="text-muted fs-24 svg-sw-10" />
                    </div>
                </div>

                <ProgressBar now={onDuty_police} className="progress-lg mb-2" />

                <div className="d-flex justify-content-between">
                    <div>
                        <span className="text-muted">On Duty</span>
                        <h5 className="mb-0">{onDuty_police}</h5>
                    </div>
                    <div className="text-end">
                        <span className="text-muted">Off Duty</span>
                        <h5 className="mb-0">{offDuty_police}</h5>
                    </div>
                </div>
            </CardBody>
            <CardFooter className="text-muted text-center">{active_police} Active Police</CardFooter>
        </Card>
    )
}

export default ActiveUsers