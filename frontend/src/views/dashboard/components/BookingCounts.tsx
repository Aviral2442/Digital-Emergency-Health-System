import {Card, CardBody, CardFooter, ProgressBar} from 'react-bootstrap'
import {LuUsers} from 'react-icons/lu'
import CountUp from "react-countup";
import React from 'react'
import axios from 'axios';

const ActiveUsers = () => {

    const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

    const [bookings, setBookings] = React.useState({
        total_bookings: 0,
        completed_bookings: 0,
        ongoing_bookings: 0,
        new_bookings: 0
    })
    const [isLoading, setIsLoading] = React.useState(true)

    const fetchBookingCounts = async () => {
        try{
            setIsLoading(true)
            const res = await axios.get(`${baseURL}/dashboard/booking_dashboard_counts`)
            // console.log("API Response of Booking: ",res.data?.jsonData?.completed_ongoing_cancelled_counts)
            setBookings(res.data?.jsonData?.completed_ongoing_cancelled_counts || {})
        } catch (error){
            console.error("Error fetching BOOKINGS: ", error)
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        fetchBookingCounts();
    }, [])

    const { completed_bookings, ongoing_bookings, new_bookings, total_bookings } = bookings;

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
                          <CountUp end={Number(total_bookings) || 0} duration={2} enableScrollSpy scrollSpyOnce/>
                        </span>
                        </h3>
                        <p className="text-muted mb-2">Total</p>
                    </div>
                    <div>
                        <LuUsers className="text-muted fs-24 svg-sw-10"/>
                    </div>
                </div>

                <ProgressBar now={ongoing_bookings} className="progress-lg mb-2"/>

                <div className="d-flex justify-content-between">
                    <div>
                        <span className="text-muted">On going</span>
                        <h5 className="mb-0">{ongoing_bookings}</h5>
                    </div>
                    <div className="text-end">
                        <span className="text-muted">New</span>
                        <h5 className="mb-0">{completed_bookings}</h5>
                    </div>
                </div>
            </CardBody>
            <CardFooter className="text-muted text-center">{new_bookings} New Bookings</CardFooter>
        </Card>
    )
}

export default ActiveUsers