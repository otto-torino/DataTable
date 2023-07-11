import PropTypes from 'prop-types'

import AdapterProvider from './AdapterProvider'
import MuiAdapter from './Adapters/Mui/MuiAdapter'
import DataTableClient from './Client'

const DataTable = ({ type, adapter, ...props }) => {
  let Table = type === 'client' ? DataTableClient : DataTableClient // @TODO rtk datatable
  let adapterContext = adapter === 'mui' ? MuiAdapter : null
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
  type: PropTypes.oneOf(['client']),
  adapter: PropTypes.oneOf(['mui']),
}

export default DataTable
