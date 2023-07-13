import { propEq } from 'ramda'
import { memo, useContext, useMemo, useState } from 'react'

import CommonDefaultProps from '../../CommonDefaultProps'
import CommonPropTypes from '../../CommonPropTypes'
import Config from '../../Config'
import DataTableBase from '../../DataTableBase'
import DataTableInternalProvider from '../../DataTableInternalProvider'
import { DataTableContext } from '../../DataTableProvider'
import { useResizableColumns, useSelection, useSettingsDialog, useStorageData } from '../../Hooks'
import { getResizing } from '../../Storage'
import { applyFullTextSearchFilter, getRecordActions } from '../../Utils'
import { usePagination, useSorting } from './Hooks'

const DataTableClient = memo((props) => {
  const {
    id,
    selectable,
    selected,
    onSelect,
    model,
    isLoading,
    data,
    defaultPageSize,
    defaultSortField,
    defaultSortDirection,
    storePageAndSortInSession,
    listDisplay,
    actions,
    fullTextSearchFields,
    onExpandRow,
    noColumnsResizing,
  } = props

  // storage
  const { fromStorage, toStorage, fromSessionStorage, toSessionStorage } = useContext(DataTableContext)

  // session storage data
  const sessionStorageData = fromSessionStorage(id, {})

  // pagination
  const { page, setPage, pageSize, setPageSize, paginate, resetPageSize } = usePagination(
    id,
    0,
    defaultPageSize || model.pageSize || Config.defaultPageSize,
    storePageAndSortInSession,
    sessionStorageData,
    toSessionStorage,
  )

  // sorting
  const { sort, setSort, handleSortChange, sortingComparison, resetSort } = useSorting(
    id,
    defaultSortField || model.sort?.field || Config.defaultSortField,
    defaultSortDirection || model.sort?.direction || Config.defaultSortDirection,
    model,
    storePageAndSortInSession,
    sessionStorageData,
    toSessionStorage,
  )

  // full text search
  const [fullTextSearch, setFullTextSearch] = useState('')

  // row expanding
  const [expandedRow, setExpandedRow] = useState(null)

  // columns
  const [columnsSettings, setColumnsSettings] = useState([])
  const columns = useMemo(() => model.fields, [model.fields])

  // storage data (support async initing)
  // this storageData does not update, its value is the one when the component is mounted
  const { isIniting, storageData } = useStorageData({
    id,
    columns,
    listDisplay,
    fromStorage,
    setPageSize,
    setSort,
    setColumnsSettings,
    sessionStorageData,
  })

  // settings dialog
  const { settingsDialogIsOpen, handleOpenSettings, handleCloseSettings, handleResetSettings, handleSaveSettings } =
    useSettingsDialog({
      id,
      pageSize,
      resetPageSize,
      sort,
      resetSort,
      columnsSettings,
      setColumnsSettings,
      columns,
      listDisplay,
      fromStorage,
      toStorage,
    })

  // prepare columns
  const displayColumns = columnsSettings.filter(propEq(true, 'visible')).map(({ id }) => columns.find(propEq(id, 'id')))

  // prepare data
  const filteredData = data.filter(
    applyFullTextSearchFilter(
      model,
      fullTextSearchFields.map((f) => model.fields.find(propEq(f, 'id'))),
      fullTextSearch,
    ),
  )
  const sortedData = filteredData.sort(sortingComparison)
  const displayData = paginate(sortedData)
  const colSpan = displayColumns.length + (selectable ? 1 : 1) + ((actions && actions.length) || onExpandRow ? 1 : 0)

  // selection
  const {
    handleSelectRecord,
    handleSelectPage,
    handleSelectAll,
    handleClearSelection,
    isRecordSelected,
    isPageSelected,
  } = useSelection(selected, onSelect, model)

  // actions
  const recordActions = getRecordActions(actions)

  // resizable columns
  const resizingColumnsData = getResizing(storageData)
  useResizableColumns(id, data, displayColumns, isLoading, fromStorage, toStorage, {
    disabled: noColumnsResizing,
  })

  return isIniting ? null : (
    <DataTableInternalProvider
      context={{
        ...props,
        page,
        setPage,
        pageSize,
        setPageSize,
        isPageSelected,
        handleSelectPage,
        sort,
        setSort,
        handleSortChange,
        selected,
        onSelect,
        isRecordSelected,
        handleSelectRecord,
        recordActions,
        sortedData,
        displayData,
        handleSelectAll,
        handleClearSelection,
        settingsDialogIsOpen,
        handleOpenSettings,
        handleCloseSettings,
        storageData,
        toStorage,
        sessionStorageData,
        handleResetSettings,
        handleSaveSettings,
        columns,
        displayColumns,
        setColumnsSettings,
        columnsSettings,
        fullTextSearch,
        setFullTextSearch,
        expandedRow,
        setExpandedRow,
        colSpan,
        resizingColumnsData,
        count: data.length,
      }}
    >
      <DataTableBase />
    </DataTableInternalProvider>
  )
})
DataTableClient.displayName = 'DataTableClient'

DataTableClient.defaultProps = {
  ...CommonDefaultProps,
}

DataTableClient.propTypes = {
  ...CommonPropTypes,
}

export default DataTableClient
