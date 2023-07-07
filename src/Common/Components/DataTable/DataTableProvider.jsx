import { createContext } from 'react'
import PropTypes from 'prop-types'

export const DataTableContext = createContext({})

const DataTableProvider = ({ context, children }) => {
  return (
    <DataTableContext.Provider value={context}>
      {children}
    </DataTableContext.Provider>
  )
}

DataTableProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  context: PropTypes.object.isRequired,
}

export default DataTableProvider
