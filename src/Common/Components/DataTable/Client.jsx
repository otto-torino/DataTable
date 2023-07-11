import PropTypes from 'prop-types'
import { assoc, compose, isEmpty, isNil, isNotNil, not, or, pick, propEq, T } from 'ramda'
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import ActionsButton from './ActionsButton'
import { AdapterContext } from './AdapterProvider'
import BulkActionsFullTextSearchBar from './BulkActionsFullTextSearchBar'
import { BULK_ACTION_TYPE, RECORD_ACTION_TYPE } from './Constants'
import DataTableProvider from './DataTableProvider'
import { PAGE_SIZE, SORT_DIRECTION, SORT_FIELD } from './Defaults'
import { usePagination, useResizableColumns, useSelection, useSorting } from './Hooks'
import SettingsDialog from './SettingsDialog'
import {
  fromStorage as defaultFromStorage,
  getSettingPageSize,
  getSettingSort,
  toStorage as defaultToStorage,
  fromSessionStorage as defaultFromSessionStorage,
  toSessionStorage as defaultToSessionStorage,
  getSettingColumns,
  getResizing,
} from './Storage'
import TablePagination from './TablePagination'
import Toolbar from './Toolbar'
import {
  applyFullTextSearchFilter,
  createColumnsPropsWithStorage,
  defaultT,
  getPrimaryKey,
  getRecordActions,
  getValue,
} from './Utils'

const DataTableClient = memo((props) => {
  const {
    id,
    size,
    selectable,
    selected,
    onSelect,
    noBulkSelection,
    model,
    isLoading,
    data,
    defaultPageSize,
    defaultSortField,
    defaultSortDirection,
    noSorting,
    renderContext,
    fromStorage,
    toStorage,
    storePageAndSortInSession,
    fromSessionStorage,
    toSessionStorage,
    listDisplay,
    actions,
    onAction,
    fullTextSearchFields,
    onExpandRow,
    onExpandRowCondition,
    noColumnsResizing,
    noSticky,
  } = props

  // ui components
  const {
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Checkbox,
    Collapse,
    KeyboardArrowDown,
    KeyboardArrowUp,
  } = useContext(AdapterContext)

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

  // full text search
  const [fullTextSearch, setFullTextSearch] = useState('')

  // row expanding
  const [expandedRow, setExpandedRow] = useState(null)

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
  const resizingColumnsData = getResizing(storageData)

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
  const filteredData = data.filter(
    applyFullTextSearchFilter(
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
  useResizableColumns(id, data, displayColumns, isLoading, fromStorage, toStorage, {
    disabled: noColumnsResizing,
  })

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
        fullTextSearch,
        setFullTextSearch,
      }}
    >
      <BulkActionsFullTextSearchBar />
      <Toolbar />
      <TableContainer id={`datatable-container-${id}`}>
        <Table size={size} id={`datatable-${id}`} className={noColumnsResizing ? '' : 'resizable-active'}>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox" checkbox className="resizable-fix">
                  {!noBulkSelection && (
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < displayData.count}
                      checked={isPageSelected(displayData)}
                      onChange={handleSelectPage(displayData)}
                    />
                  )}
                </TableCell>
              )}
              {displayColumns.map((column, idx) => {
                let widthStyles = {}
                if (!noColumnsResizing && resizingColumnsData[column.id]) {
                  const v = resizingColumnsData[column.id]
                  widthStyles = { ...widthStyles, width: v, minWidth: v, maxWidth: v }
                }

                return (
                  <TableCell
                    style={{ ...widthStyles }}
                    stickyLeft={idx === 0 && !noSticky}
                    key={column.id}
                    data-id={column.id}
                    className={`th-col-name${
                      idx === displayColumns.length - 1 && !recordActions.length && !onExpandRow ? ' resizable-fix' : ''
                    }`}
                  >
                    {!noSorting && !column.disableSorting ? (
                      <TableSortLabel
                        active={sort.fieldId === column.id}
                        direction={sort.fieldId === column.id ? sort.direction : 'asc'}
                        onClick={handleSortChange(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                )
              })}
              {(recordActions.length > 0 || onExpandRow) && (
                <TableCell stickyRight={!noSticky} className="resizable-fix" />
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayData.map((record) => {
              const enableSelection = selectable === true || (typeof selectable === 'function' && selectable(record))
              const pk = getPrimaryKey(model, record)
              const allowedActions = recordActions.filter(
                (a) => (!a.permission || a.permission(record)) && (!a.condition || a.condition(record)),
              )
              return (
                <React.Fragment key={pk}>
                  <TableRow key={pk}>
                    {enableSelection && (
                      <TableCell padding="checkbox" checkbox>
                        <Checkbox checked={isRecordSelected(pk)} onChange={handleSelectRecord(record)} />
                      </TableCell>
                    )}
                    {displayColumns.map((column, idx) => {
                      return (
                        <TableCell stickyLeft={idx === 0 && !noSticky} key={column.id}>
                          {getValue(record, column, renderContext)}
                        </TableCell>
                      )
                    })}
                    {(recordActions.length > 0 || onExpandRow) && (
                      <TableCell stickyRight={!noSticky}>
                        <Box direction="row" gap=".5rem" justify="flex-end">
                          {onExpandRow && onExpandRowCondition(record) && (
                            <IconButton size={size} onClick={() => setExpandedRow(expandedRow === pk ? null : pk)}>
                              {expandedRow === pk ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                          )}
                          {allowedActions.length > 0 && (
                            <ActionsButton
                              actions={allowedActions}
                              onAction={compose(onAction, assoc('record', record), pick(['id']))}
                            />
                          )}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                  {onExpandRow && (
                    <TableRow key={`expanded-${pk}`}>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0, border: '0px solid' }} colSpan={colSpan}>
                        <Collapse in={expandedRow === pk} timeout="auto" unmountOnExit>
                          {onExpandRow(record)}
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination />
      {settingsDialogIsOpen && <SettingsDialog />}
    </DataTableProvider>
  )
})
DataTableClient.displayName = 'DataTableClient'

DataTableClient.defaultProps = {
  size: 'small',
  selectable: false,
  noBulkSelection: false,
  noAllSelection: false,
  renderContext: {},
  t: defaultT,
  fromStorage: defaultFromStorage,
  toStorage: defaultToStorage,
  fromSessionStorage: defaultFromSessionStorage,
  toSessionStorage: defaultToSessionStorage,
  storePageAndSortInSession: true,
  actions: [],
  fullTextSearchFields: [],
  onExpandRowCondition: T,
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
      type: PropTypes.oneOf([RECORD_ACTION_TYPE, BULK_ACTION_TYPE]), // if undefined both types are allowed
    }),
  ),
  // callback when action is triggered, receives object {id, record}
  onAction: PropTypes.func,
  // fields for which to enable full text search
  fullTextSearchFields: PropTypes.arrayOf(PropTypes.string),
  // display content as row accordion
  onExpandRow: PropTypes.func,
  // should display expand button for the record
  onExpandRowCondition: PropTypes.func,
  // disabl columns resizing
  noColumnsResizing: PropTypes.bool,
  // disable first and last columns sticky position
  noSticky: PropTypes.bool,
}

export default DataTableClient
