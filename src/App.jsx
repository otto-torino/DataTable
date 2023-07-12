import { Delete, Edit, MoveUp } from '@mui/icons-material'
import { ThemeProvider } from '@mui/material'
import { useMemo, useState } from 'react'

import DataTable from '@Common/Components/DataTable'
import { BULK_ACTION_TYPE, RECORD_ACTION_TYPE } from '@Common/Components/DataTable/Constants'
import { useRtkQuery } from '@Common/Components/DataTable/Variants/Rtk/Hooks'
import { useCampaignsQuery } from '@Core/Services/Api/Campaigns'
import Vehicles from '@Fixtures/Vehicles.json'
import getTheme from '@Theme'
import Vehicle from '@Vehicles/Models/Vehicle'
import Campaign from './Campaigns/Model/Campaign'
import { defaultTo } from 'ramda'
import { apiQueryString } from './Core/Services/Api'

function App() {
  const mode = 'light'
  const theme = useMemo(() => getTheme(mode), [mode])
  const [selected, setSelected] = useState([])
  const [selectedRtk, setSelectedRtk] = useState([])
  const [isVisible, setIsVisible] = useState(true)

  const qsAdditions = {}
  const { data, isFetching, refetch, refreshData, count } = useRtkQuery(
    'campaigns', // dataTableId
    useCampaignsQuery, // rtk endpoint
    qsAdditions, // qs additions
    { field: 'id', direction: 'asc' }, // default sorting
  )

  const actions = [
    {
      id: 'EDIT',
      label: 'Edit',
      icon: <Edit />,
      type: RECORD_ACTION_TYPE,
    },
    {
      id: 'DELETE',
      label: 'Delete',
      icon: <Delete />,
    },
    {
      id: 'MOVE',
      label: 'Move',
      icon: <MoveUp />,
      type: BULK_ACTION_TYPE,
    },
  ]

  const handleAction = (actionId, record) => {
    console.log(actionId, record)
  }

  return (
    <ThemeProvider theme={theme}>
      <div>
        {isVisible && (
          <DataTable
            variant="rtk"
            selectable
            id="campaigns"
            data={defaultTo([], data?.results)}
            count={count}
            qsAdditions={qsAdditions}
            refreshData={refreshData}
            model={Campaign}
            selected={selectedRtk}
            onSelect={setSelectedRtk}
            onRefetch={refetch}
            listDisplay={['id', 'name']}
            onFilter={() => {}}
            isFilterFormActive={false}
            fullTextSearchFields={['name']}
            isLoading={isFetching}
            exportApi={(qs) => fetch(`https://www.tazebao.email/api/v1/newsletter/campaign/${apiQueryString(qs)}`)}
          />
        )}
      </div>
      <div>
        {isVisible && (
          <DataTable
            variant="client"
            selectable
            id="vehicles"
            data={Vehicles}
            model={Vehicle}
            selected={selected}
            onSelect={setSelected}
            onRefetch={() => {}}
            storePageAndSortInSession
            listDisplay={['id', 'name', 'maxSpeed']}
            onFilter={() => {}}
            isFilterFormActive={false}
            actions={actions}
            onAction={handleAction}
            fullTextSearchFields={['name', 'status.code']}
            onExpandRow_={() => <div style={{ height: '100px', background: 'red' }}>Hello</div>}
            onExpandRowCondition={({ id }) => id % 2 === 0}
          />
        )}
      </div>
      <button onClick={() => setIsVisible(!isVisible)}>Switch</button>
    </ThemeProvider>
  )
}

export default App
