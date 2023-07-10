import { Checkbox } from '@mui/material'
import PropTypes from 'prop-types'
import { assoc, compose, defaultTo, isEmpty, isNil, isNotNil, not, or, pick, pipe, propEq, tap } from 'ramda'
import { useCallback, useEffect, useMemo, useState } from 'react'

import ActionsButton from './ActionsButton'
import DataTableProvider from './DataTableProvider'
import { PAGE_SIZE, SORT_DIRECTION, SORT_FIELD } from './Defaults'
import { usePagination, useSelection, useSorting } from './Hooks'
import SettingsDialog from './SettingsDialog'
import {
  fromStorage as defaultFromStorage,
  getSettingPageSize,
  getSettingSort,
  toStorage as defaultToStorage,
  fromSessionStorage as defaultFromSessionStorage,
  toSessionStorage as defaultToSessionStorage,
  getSettingColumns,
} from './Storage'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from './Styled'
import TablePagination from './TablePagination'
import Toolbar from './Toolbar'
import { createColumnsPropsWithStorage, defaultT, getPrimaryKey, getValue } from './Utils'

const DataTableClient = (props) => {
  const {
    id,
    size,
    selectable,
    selected,
    onSelect,
    noBulkSelection,
    model,
    data,
    defaultPageSize,
    defaultSortField,
    defaultSortDirection,
    noSorting,
    renderContext,
    noToolbar,
    fromStorage,
    toStorage,
    storePageAndSortInSession,
    fromSessionStorage,
    toSessionStorage,
    listDisplay,
    actions,
    onAction,
  } = props

  // session storage data
  const sessionStorageData = fromSessionStorage(id, {})

  // pagination
  const { page, setPage, pageSize, setPageSize, paginate, resetPageSize } = usePagination(
    id,
    0,
    defaultPageSize || model.pageSize || PAGE_SIZE,
    storePageAndSortInSession,
    sessionStorageData,
    toSessionStorage,
  )

  // sorting
  const { sort, setSort, handleSortChange, sortingComparison, resetSort } = useSorting(
    id,
    defaultSortField || model.sort?.field || SORT_FIELD,
    defaultSortDirection || model.sort?.direction || SORT_DIRECTION,
    model,
    storePageAndSortInSession,
    sessionStorageData,
    toSessionStorage,
  )

  // columns
  const [columnsSettings, setColumnsSettings] = useState([])
  useEffect(() => {
    setColumnsSettings(createColumnsPropsWithStorage(columns, listDisplay, getSettingColumns(storageData)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, listDisplay])
  const columns = useMemo(() => model.fields, [model.fields])

  // storage data (support async initing)
  const [isIniting, setIsIniting] = useState(true)
  const [storageData, setStorageData] = useState({})
  useEffect(() => {
    const getData = async () => {
      const data = await fromStorage(id, {})
      setStorageData(data)
      const pageSize = getSettingPageSize(data)
      const sort = getSettingSort(data)
      const columns = getSettingColumns(data)
      not(isNil(pageSize)) && setPageSize(pageSize)
      isNotNil(sort) && isNil(sessionStorageData?.sort) && setSort(sort)
      not(or(isNil(columns), isEmpty(columns))) && setColumnsSettings(columns)
      setIsIniting(false)
    }
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // settings dialog
  const [settingsDialogIsOpen, setSettingsDialogIsOpen] = useState(false)
  const handleOpenSettings = useCallback(() => setSettingsDialogIsOpen(true), [setSettingsDialogIsOpen])
  const handleCloseSettings = useCallback(() => setSettingsDialogIsOpen(false), [setSettingsDialogIsOpen])
  const handleResetSettings = useCallback(() => {
    resetPageSize()
    resetSort()
    setColumnsSettings(createColumnsPropsWithStorage(columns, listDisplay, []))
    toStorage(id, { ...storageData, settings: {} })
    handleCloseSettings()
  }, [toStorage, storageData, id, resetPageSize, resetSort, columns, listDisplay, handleCloseSettings])
  const handleSaveSettings = useCallback(() => {
    toStorage(id, { ...storageData, settings: { pageSize, sort, columns: columnsSettings } })
    handleCloseSettings()
  }, [toStorage, storageData, handleCloseSettings, id, pageSize, sort, columnsSettings])

  // prepare columns
  const displayColumns = columnsSettings.filter(propEq(true, 'visible')).map(({ id }) => columns.find(propEq(id, 'id')))

  // prepare data
  const sortedData = [...data].sort(sortingComparison)
  const displayData = paginate(sortedData)

  // selection
  const {
    handleSelectRecord,
    handleSelectPage,
    handleSelectAll,
    handleClearSelection,
    isRecordSelected,
    isPageSelected,
  } = useSelection(selected, onSelect, model)

  return isIniting ? null : (
    <DataTableProvider
      context={{
        ...props,
        page,
        setPage,
        pageSize,
        setPageSize,
        sort,
        setSort,
        selected,
        onSelect,
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
      }}
    >
      {!noToolbar && <Toolbar />}
      <TableContainer id={`datatable-${id}`}>
        <Table size={size}>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell checkbox>
                  {!noBulkSelection && (
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < displayData.count}
                      checked={isPageSelected(displayData)}
                      onChange={handleSelectPage(displayData)}
                      size={size}
                    />
                  )}
                </TableCell>
              )}
              {displayColumns.map((column) => {
                return (
                  <TableCell key={column.id}>
                    {!noSorting && !column.disableSorting ? (
                      <TableSortLabel
                        active={sort.fieldId === column.id}
                        direction={sort.fieldId === column.id ? sort.direction : 'asc'}
                        onClick={handleSortChange(column.id)}
                      >
                        {column.label} AA
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                )
              })}
              {actions && actions.length > 0 && <TableCell actions />}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayData.map((record) => {
              const enableSelection = selectable === true || (typeof selectable === 'function' && selectable(record))
              const pk = getPrimaryKey(model, record)
              const allowedActions = defaultTo(
                [],
                actions?.filter(
                  (a) => (!a.permission || a.permission(record)) && (!a.condition || a.condition(record)),
                ),
              )

              return (
                <TableRow key={pk}>
                  {enableSelection && (
                    <TableCell>
                      <Checkbox size={size} checked={isRecordSelected(pk)} onChange={handleSelectRecord(record)} />
                    </TableCell>
                  )}
                  {displayColumns.map((column) => {
                    return <TableCell key={column.id}>{getValue(record, column, renderContext)}</TableCell>
                  })}
                  {actions && actions.length > 0 && (
                    <TableCell>
                      {allowedActions.length > 0 && (
                        <ActionsButton
                          actions={allowedActions}
                          onAction={compose(onAction, assoc('record', record), pick(['id']))}
                        />
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination />
      {settingsDialogIsOpen && <SettingsDialog />}
    </DataTableProvider>
  )
}

DataTableClient.defaultProps = {
  size: 'small',
  renderContext: {},
  t: defaultT,
  fromStorage: defaultFromStorage,
  toStorage: defaultToStorage,
  fromSessionStorage: defaultFromSessionStorage,
  toSessionStorage: defaultToSessionStorage,
}

DataTableClient.propTypes = {
  // table uniq id
  id: PropTypes.string.isRequired,
  // table and fields size: 'small' | 'medium',...
  size: PropTypes.string,
  // enable rows selection
  selectable: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func, // gets the record and returns true/false
  ]),
  // selected records
  selected: PropTypes.array,
  // callback when selection changes
  onSelect: PropTypes.func,
  // disable bulk selection
  noBulkSelection: PropTypes.bool,
  // disable all records selection
  noAllSelection: PropTypes.bool,
  // recors model
  model: PropTypes.object.isRequired,
  // data set
  data: PropTypes.array,
  // callback when refetch button is pressed
  onRefetch: PropTypes.func,
  // data is loading
  isLoading: PropTypes.bool,
  // page size is determined with the following precedence order:
  // 1. stored value
  // 2. defaultPageSize prop
  // 3. model.pageSize
  // 4. PAGE_SIZE constant
  defaultPageSize: PropTypes.number,
  // disable page number input field
  noPageInputField: PropTypes.bool,
  // sort field determined with the following precedence order:
  // 1. stored value
  // 2. defaultSortField prop
  // 3. model.sort.field
  // 4. SORT_FIELD constant
  defaultSortField: PropTypes.string,
  // sort direction determined with the following precedence order:
  // 1. stored value
  // 2. defaultSortDirection prop
  // 3. model.sort.direction
  // 4. SORT_DIRECTION constant
  defaultSortDirection: PropTypes.string,
  // disable sorting
  noSorting: PropTypes.bool,
  // context passed to model renders methods
  renderContext: PropTypes.object,
  // disable toolbar
  noToolbar: PropTypes.bool,
  // disable settings dialog
  noSettings: PropTypes.bool,
  // translation function
  t: PropTypes.func,
  // retrieve from storage
  fromStorage: PropTypes.func,
  // save to storage
  toStorage: PropTypes.func,
  // store page and sort in session
  storePageAndSortInSession: PropTypes.bool,
  // retrieve from session storage (save current page and sorting in session)
  fromSessionStorage: PropTypes.func,
  // save to session storage
  toSessionStorage: PropTypes.func,
  // columns which should be visible
  listDisplay: PropTypes.arrayOf(PropTypes.string).isRequired,
  // disable export
  noExport: PropTypes.bool,
  // function called when filter button is pressed
  // filter button is not displayed if null or undefined
  onFilter: PropTypes.func,
  // true if data are filtered
  isFilterFormActive: PropTypes.bool,
  // single record actions
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      permission: PropTypes.func,
      condition: PropTypes.func,
    }),
  ),
}

export default DataTableClient
