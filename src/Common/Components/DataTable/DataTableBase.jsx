import { useContext } from "react"
import { AdapterContext } from "./AdapterProvider"
import BulkActionsFullTextSearchBar from "./BulkActionsFullTextSearchBar"
import DataTableBody from "./DataTableBody"
import DataTableHead from "./DataTableHead"
import { DataTableContext } from "./DataTableProvider"
import Loader from "./Loader"
import SettingsDialog from "./SettingsDialog"
import TablePagination from "./TablePagination"
import Toolbar from "./Toolbar"

const DataTableBase = () => {
  const { TableContainer, Table } = useContext(AdapterContext)
  const { size, id, displayData, isLoading, pageSize, settingsDialogIsOpen, noColumnsResizing } = useContext(DataTableContext)
  return (
    <>
      <BulkActionsFullTextSearchBar />
      <Toolbar />
      <TableContainer id={`datatable-container-${id}`}>
        <Table size={size} id={`datatable-${id}`} className={noColumnsResizing ? '' : 'resizable-active'}>
          <DataTableHead />
          <DataTableBody />
        </Table>
        {!displayData.length && isLoading && <Loader minHeight="100px" skeleton={pageSize} />}
      </TableContainer>
      <TablePagination />
      {settingsDialogIsOpen && <SettingsDialog />}
    </>
  )
}

export default DataTableBase
