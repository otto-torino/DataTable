import PropTypes from 'prop-types'
import { propEq } from 'ramda'
import { memo, useEffect, useMemo, useRef, useState } from 'react'

import CommonDefaultProps from '../../CommonDefaultProps'
import CommonPropTypes from '../../CommonPropTypes'
import Config from '../../Config'
import DataTableBase from '../../DataTableBase'
import DataTableInternalProvider from '../../DataTableInternalProvider'
import { useDebounce, useResizableColumns, useSelection, useSettingsDialog, useStorageData } from '../../Hooks'
import {
  getResizing,
} from '../../Storage'
import { getRecordActions } from '../../Utils'
import { usePagination, useSorting } from './Hooks'

const DataTableRtk = memo((props) => {
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
    fromStorage,
    toStorage,
    storePageAndSortInSession,
    fromSessionStorage,
    toSessionStorage,
    listDisplay,
    actions,
    onExpandRow,
    noColumnsResizing,
    qsAdditions,
    refreshData,
    count,
  } = props

  // session storage data
  const sessionStorageData = fromSessionStorage(id, {})

  // pagination
  const { page, setPage, pageSize, setPageSize, resetPageSize } = usePagination(
    id,
    0,
    defaultPageSize || model.pageSize || Config.defaultPageSize,
    storePageAndSortInSession,
    sessionStorageData,
    toSessionStorage,
  )

  // sorting
  const { sort, setSort, handleSortChange, resetSort } = useSorting(
    id,
    defaultSortField || model.sort?.field || Config.defaultSortField,
    defaultSortDirection || model.sort?.direction || Config.defaultSortDirection,
    storePageAndSortInSession,
    sessionStorageData,
    toSessionStorage,
  )

  // full text search
  const [fullTextSearch, setFullTextSearch] = useState('')
  const debouncedFullTextSearch = useDebounce(fullTextSearch)

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
  const displayData = data
  const colSpan = displayColumns.length + (selectable ? 1 : 1) + ((actions && actions.length) || onExpandRow ? 1 : 0)

  // data refreshing
  // reset page when changing filtering
  const prevQsAdditions = useRef(JSON.stringify(qsAdditions))
  useEffect(() => {
    if (prevQsAdditions.current && prevQsAdditions.current !== JSON.stringify(qsAdditions)) {
      setPage(0)
    }
    prevQsAdditions.current = JSON.stringify(qsAdditions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(qsAdditions)])

  // data refreshing
  useEffect(() => {
    refreshData({
      base: {
        pageSize: Math.max(1, pageSize),
        page,
        orderBy: sort.field,
        orderType: sort.direction,
      },
      qsAdditions: { ...qsAdditions, ...(debouncedFullTextSearch ? { search: debouncedFullTextSearch } : {}) },
    })

    if (onExpandRow) {
      setExpandedRow(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(qsAdditions), page, sort, pageSize, refreshData, onExpandRow, debouncedFullTextSearch])

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
        count,
      }}
    >
      <DataTableBase />
    </DataTableInternalProvider>
  )
})
DataTableRtk.displayName = 'DataTableRtk'

DataTableRtk.defaultProps = {
  ...CommonDefaultProps,
  qsAdditions: {},
  count: -1,
}

DataTableRtk.propTypes = {
  ...CommonPropTypes,
  // portion if query string other than pagination and sorting
  qsAdditions: PropTypes.object,
  // refresh data
  refreshData: PropTypes.func,
  // total data length
  count: PropTypes.number,
}

export default DataTableRtk
