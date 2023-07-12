import PropTypes from 'prop-types'

import CommonPropTypes from './CommonPropTypes'
import DataTableClient from './Variants/Client/DataTableClient'
import DataTableRtk from './Variants/Rtk/DataTableRtk'

const DataTable = ({ variant, ...props }) => {
  let Table = variant === 'client' ? DataTableClient : DataTableRtk
  return <Table {...props} />
}

DataTable.defaultProps = {
  type: 'client',
}

DataTable.propTypes = {
  variant: PropTypes.oneOf(['client', 'rtk']),
  ...CommonPropTypes,
}

export default DataTable
