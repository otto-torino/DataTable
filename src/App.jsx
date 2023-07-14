import { Delete, Edit, MoveUp } from '@mui/icons-material'
import { ThemeProvider } from '@mui/material'
import { defaultTo } from 'ramda'
import { useCallback, useMemo, useState } from 'react'

import DataTable from '@Common/Components/DataTable'
import { BULK_ACTION_TYPE, RECORD_ACTION_TYPE } from '@Common/Components/DataTable/Constants'
import { useRtkQuery } from '@Common/Components/DataTable/Variants/Rtk/Hooks'
import { useCampaignsQuery } from '@Core/Services/Api/Campaigns'
import Vehicles from '@Fixtures/Vehicles.json'
import getTheme from '@Theme'
import Vehicle from '@Vehicles/Models/Vehicle'

import Campaign from './Campaigns/Model/Campaign'
import { apiQueryString } from './Core/Services/Api'

const LIST_DISPLAY = ['id', 'name', 'maxSpeed']
const SEARCH_FIELDS = ['name', 'status.code']

const LIST_DISPLAY_RTK = ['id', 'name', 'insertion_datetime', 'view_online', 'subject']
const SEARCH_FIELDS_RTK = ['name']

function App() {
  const mode = 'light'
  const theme = useMemo(() => getTheme(mode), [mode])
  const [counter, setCounter] = useState(0)
  const [selected, setSelected] = useState([])
  const [selectedRtk, setSelectedRtk] = useState([])
  const [isVisible, setIsVisible] = useState(true)

  const qsAdditions = useMemo(() => ({}), [])
  const { data, isFetching, refetch, refreshData, count } = useRtkQuery(
    'campaigns', // dataTableId
    useCampaignsQuery, // rtk endpoint
    qsAdditions, // qs additions
    { field: 'id', direction: 'asc' }, // default sorting
  )

  const actions = useMemo(() => [
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
  ], [])

  const handleAction = useCallback((actionId, record) => {
    console.log(actionId, record)
  }, [])
  const onFilter = useCallback(() => {
    console.log('FILTER')
  }, [])
  const onExpandRow = useCallback(() => {
    return <div style={{ height: '100px', background: 'red' }}>Hello</div>
  }, [])
  const onExpandRowCondition = useCallback(({ id }) => id % 2 === 0, [])

  const handleExportApi = useCallback((qs) => fetch(`https://www.tazebao.email/api/v1/newsletter/campaign/${apiQueryString(qs)}`), [])

  const dataRtk = useMemo(() => defaultTo([], data?.results), [data?.results])

  return (
    <ThemeProvider theme={theme}>
      <div>
        {isVisible && (
          <DataTable
            variant="rtk"
            selectable
            id="campaigns"
            data={dataRtk}
            count={count}
            qsAdditions={qsAdditions}
            refreshData={refreshData}
            model={Campaign}
            selected={selectedRtk}
            onSelect={setSelectedRtk}
            onRefetch={refetch}
            listDisplay={LIST_DISPLAY_RTK}
            onFilter={onFilter}
            isFilterFormActive={false}
            fullTextSearchFields={SEARCH_FIELDS_RTK}
            isLoading={isFetching}
            exportApi={handleExportApi}
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
            storePageAndSortInSession
            listDisplay={LIST_DISPLAY}
            onFilter={onFilter}
            isFilterFormActive={false}
            actions={actions}
            onAction={handleAction}
            fullTextSearchFields={SEARCH_FIELDS}
            onExpandRow={onExpandRow}
            onExpandRowCondition={onExpandRowCondition}
          />
        )}
      </div>
      <button onClick={() => setIsVisible(!isVisible)}>Switch</button>
      <button onClick={() => setCounter(counter + 1)}>{counter}</button>
    </ThemeProvider>
  )
}

export default App
