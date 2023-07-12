import PropTypes from 'prop-types'

import AdapterProvider from './AdapterProvider'
import MuiAdapter from './Adapters/Mui/MuiAdapter'
import DataTableClient from './Client/DataTableClient'
import DataTableRtk from './Rtk/DataTableRtk'

const DataTable = ({ type, adapter, ...props }) => {
  let Table = type === 'client' ? DataTableClient : DataTableRtk
  let adapterContext = adapter === 'mui' ? MuiAdapter : MuiAdapter // @TODO other adapters
  return adapter ? (
    <AdapterProvider context={adapterContext}>
      <Table {...props} />
    </AdapterProvider>
  ) : (
    <Table {...props} />
  )
}

DataTable.defaultProps = {
  type: 'client', 
  adapter: 'mui',
}

DataTable.propTypes = {
  type: PropTypes.oneOf(['client', 'rtk']),
  adapter: PropTypes.oneOf(['mui']),
}

export default DataTable
