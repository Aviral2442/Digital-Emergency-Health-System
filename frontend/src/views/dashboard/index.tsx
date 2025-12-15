import {Col, Container, Row} from 'react-bootstrap'
import TotalActiveOtherStatusVendor from '@/views/dashboard/components/TotalActiveOtherStatusVendorCounts'
import RequestStatistics from '@/views/dashboard/components/RequestStatistics'

const Page = () => {
    return (
        <Container fluid className='mt-3'>

            <Row className="row-cols-xxl-4 row-cols-md-2 row-cols-1">
                <Col>
                    <TotalActiveOtherStatusVendor/>
                </Col>

                <Col>
                    <TotalActiveOtherStatusVendor/>
                </Col>  

                <Col>
                    <TotalActiveOtherStatusVendor/>
                </Col>

                <Col>
                    <TotalActiveOtherStatusVendor/>
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
