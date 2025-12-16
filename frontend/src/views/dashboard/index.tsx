import {Col, Container, Row} from 'react-bootstrap'
import PoliceCounts from '@/views/dashboard/components/PoliceCounts'
import BookingCounts from '@/views/dashboard/components/BookingCounts'
import DriverCounts from '@/views/dashboard/components/DriverCounts'
import HospitalCounts from '@/views/dashboard/components/HospitalCounts'
import RequestStatistics from '@/views/dashboard/components/RequestStatistics'

const Page = () => {
    return (
        <Container fluid className='mt-3'>

            <Row className="g-3">
                <Col xxl={3} md={6}>
                    <PoliceCounts/>
                </Col>

                <Col xxl={3} md={6}>
                    <BookingCounts/>
                </Col>  

                <Col xxl={3} md={6}>
                    <DriverCounts/>
                </Col>

                <Col xxl={3} md={6}>
                    <HospitalCounts/>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col cols={12}>
                    <RequestStatistics/>
                </Col>
            </Row>

        </Container>
    )
}

export default Page
