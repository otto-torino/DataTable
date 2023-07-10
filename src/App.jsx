import { ThemeProvider } from '@mui/material'
import { useMemo, useState } from 'react'

import DataTable from '@Common/Components/DataTable/Client'
import Vehicles from '@Fixtures/Vehicles.json'
import getTheme from '@Theme'
import Vehicle from '@Vehicles/Models/Vehicle'
import { Delete, Edit, MoveUp } from '@mui/icons-material'
import { BULK_ACTION_TYPE, RECORD_ACTION_TYPE } from '@Common/Components/DataTable/Constants'

function App() {
  const mode = 'light'
  const theme = useMemo(() => getTheme(mode), [mode])
  const [selected, setSelected] = useState([])
  const [isVisible, setIsVisible] = useState(true)

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
    }
  ]

  const handleAction = (actionId, record) => {
    console.log(actionId, record)
  }

  return (
    <ThemeProvider theme={theme}>
      <div>
        {isVisible && (
        <DataTable
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
          fullTextSearchFields={['name', 'status']}
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
