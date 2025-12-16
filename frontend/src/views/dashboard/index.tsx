import {Col, Container, Row} from 'react-bootstrap'
import PoliceCounts from '@/views/dashboard/components/PoliceCounts'
import BookingCounts from '@/views/dashboard/components/BookingCounts'
import DriverCounts from '@/views/dashboard/components/DriverCounts'
import HospitalCounts from '@/views/dashboard/components/HospitalCounts'
import RequestStatistics from '@/views/dashboard/components/RequestStatistics'

const Page = () => {
    return (
        <Container fluid className='mt-3'>

            <Row className="row-cols-xxl-4 row-cols-md-2 row-cols-1">
                <Col>
                    <PoliceCounts/>
                </Col>

                <Col>
                    <BookingCounts/>
                </Col>  

                <Col>
                    <DriverCounts/>
                </Col>

                <Col>
                    <HospitalCounts/>
                </Col>
            </Row>

            <Row>
                <Col cols={12}>
                    <RequestStatistics/>
                </Col>
            </Row>

        </Container>
    )
}

export default Page
