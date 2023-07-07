import { TablePagination as BaseTablePagination, Box, PageLabel, PageInput } from './Styled'
import PropTypes from 'prop-types'
import React, { useContext, useState } from 'react'
import { withEventValue } from './Utils'
import { DataTableContext } from './DataTableProvider'

const TablePagination = () => {
  const { page, data, pageSize, setPage, noPageInputField } = useContext(DataTableContext)

  const muiProps = {
    rowsPerPageOptions: [pageSize],
    component: "div",
    count: data.length,
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
    if (value > 0 && (data.length === -1 || (value - 1) * pageSize <= data.length)) {
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
