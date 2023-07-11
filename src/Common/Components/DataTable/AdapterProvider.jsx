import { createContext } from 'react'
import PropTypes from 'prop-types'

export const AdapterContext = createContext({})

const AdapterProvider = ({ context, children }) => {
  return (
    <AdapterContext.Provider value={context}>
      {children}
    </AdapterContext.Provider>
  )
}

AdapterProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  context: PropTypes.object.isRequired,
}

export default AdapterProvider
