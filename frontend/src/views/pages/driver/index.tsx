import React from 'react'
import { Container } from 'react-bootstrap'
import ExportDataWithButtons from '@/views/tables/data-tables/driver'

const Page: React.FC = () => {

  const [refreshFlag, _setRefreshFlag] = React.useState(0);



  return (
    <Container fluid className="p-0">
        <ExportDataWithButtons  
        tabKey={1}
        refreshFlag={refreshFlag}
      />
    </Container>
  )
}

export default Page