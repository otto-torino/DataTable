import { createContext } from 'react'
import PropTypes from 'prop-types'

export const DataTableInternalContext = createContext({})

const DataTableInternalProvider = ({ context, children }) => {
  return (
    <DataTableInternalContext.Provider value={context}>
      {children}
    </DataTableInternalContext.Provider>
  )
}

DataTableInternalProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  context: PropTypes.object.isRequired,
}

export default DataTableInternalProvider
