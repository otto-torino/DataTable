import { ThemeProvider } from '@mui/material'
import { useMemo, useState } from 'react'

import DataTable from '@Common/Components/DataTable/Client'
import Vehicles from '@Fixtures/Vehicles.json'
import getTheme from '@Theme'
import Vehicle from '@Vehicles/Models/Vehicle'

function App() {
  const mode = 'light'
  const theme = useMemo(() => getTheme(mode), [mode])
  const [selected, setSelected] = useState([])
  const [isVisible, setIsVisible] = useState(true)
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
        />
        )}
      </div>
      <button onClick={() => setIsVisible(!isVisible)}>Switch</button>
    </ThemeProvider>
  )
}

export default App
