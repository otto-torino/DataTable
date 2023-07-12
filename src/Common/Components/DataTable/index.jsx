import PropTypes from 'prop-types'

import AdapterProvider from './AdapterProvider'
import MuiAdapter from './Adapters/Mui/MuiAdapter'
import CommonPropTypes from './CommonPropTypes'
import DataTableClient from './Variants/Client/DataTableClient'
import DataTableRtk from './Variants/Rtk/DataTableRtk'

const DataTable = ({ variant, adapter, ...props }) => {
  let Table = variant === 'client' ? DataTableClient : DataTableRtk
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
  variant: PropTypes.oneOf(['client', 'rtk']),
  adapter: PropTypes.oneOf(['mui']),
  ...CommonPropTypes,
}

export default DataTable
