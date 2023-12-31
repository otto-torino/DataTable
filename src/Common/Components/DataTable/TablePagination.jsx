import PropTypes from 'prop-types'
import React, { useContext, useState } from 'react'

import { DataTableInternalContext } from './DataTableInternalProvider'
import { DataTableContext } from './DataTableProvider'
import { withEventValue } from './Utils'

const TablePagination = () => {
  const { TablePagination: BaseTablePagination, Box, PageLabel, PageInput } = useContext(DataTableContext)
  const { page, data, pageSize, setPage, noPageInputField, count } = useContext(DataTableInternalContext)

  const muiProps = {
    rowsPerPageOptions: [pageSize],
    component: 'div',
    count,
    rowsPerPage: pageSize,
    page,
    onPageChange: (_, page) => setPage(page),
  }

  const [value, setValue] = useState(page + 1)
  const [warning, setWarning] = useState(false)

  React.useEffect(() => {
    setValue(page + 1)
  }, [page])

  React.useEffect(() => {
    if (value > 0 && (count === -1 || (value - 1) * pageSize <= count)) {
      setWarning(false)
      setPage(value - 1)
    } else {
      setWarning(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, data.length, pageSize])

  return noPageInputField ? (
    <BaseTablePagination {...muiProps} />
  ) : (
    <Box direction="row" align="center" justify="flex-end" width="100%">
      <Box direction="row" margin="1rem -.8rem 1rem auto" align="center">
        <PageLabel>Page</PageLabel>
        <PageInput value={value} onChange={withEventValue(setValue)} type="number" warning={warning} />
        <PageLabel>Rows</PageLabel>
      </Box>
      <BaseTablePagination {...muiProps} style={{ width: 'auto' }} />
    </Box>
  )
}

TablePagination.propTypes = {
  rowsPerPageOptions: PropTypes.array,
  component: PropTypes.string,
  count: PropTypes.number,
  rowsPerPage: PropTypes.number,
  page: PropTypes.number,
  onPageChange: PropTypes.func,
  showFirstButton: PropTypes.bool,
  showLastButton: PropTypes.bool,
  noPageInputField: PropTypes.bool,
}

export default TablePagination
