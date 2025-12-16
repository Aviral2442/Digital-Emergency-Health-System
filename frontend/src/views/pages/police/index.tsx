import React from 'react'
import { Container } from 'react-bootstrap'
import ExportDataWithButtons from '@/views/tables/data-tables/police/'
import { useNavigate } from 'react-router-dom'

const Page: React.FC = () => {

  const navigate = useNavigate();
  const [refreshFlag, _setRefreshFlag] = React.useState(0);


  const handleAddNew = () => {
    navigate('/police/add')
  }



  return (
    <Container fluid className="p-0">
        <ExportDataWithButtons  
        tabKey={1}
        refreshFlag={refreshFlag}
        onAddNew={handleAddNew}

      />
    </Container>
  )
}

export default Page