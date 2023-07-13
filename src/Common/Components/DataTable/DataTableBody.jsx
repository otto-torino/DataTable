import { assoc, compose, pick } from 'ramda'
import React from 'react'
import { useContext } from 'react'

import ActionsButton from './ActionsButton'
import { DataTableInternalContext } from './DataTableInternalProvider'
import { DataTableContext } from './DataTableProvider'
import { getPrimaryKey, getValue, withStopPropagation } from './Utils'

const DataTableBody = () => {
  const { TableBody, TableRow, TableCell, Checkbox, Box, IconButton, KeyboardArrowUp, KeyboardArrowDown, Collapse } =
    useContext(DataTableContext)
  const {
    selectable,
    isRecordSelected,
    handleSelectRecord,
    displayData,
    displayColumns,
    recordActions,
    onExpandRow,
    noColumnsResizing,
    noSticky,
    model,
    renderContext,
    onExpandRowCondition,
    expandedRow,
    setExpandedRow,
    size,
    onAction,
    colSpan,
    selectOnRowClick,
  } = useContext(DataTableInternalContext)
  return (
    <TableBody>
      {displayData.map((record) => {
        const enableSelection = selectable === true || (typeof selectable === 'function' && selectable(record))
        const pk = getPrimaryKey(model, record)
        const isSelected = isRecordSelected(pk)
        const allowedActions = recordActions.filter(
          (a) => (!a.permission || a.permission(record)) && (!a.condition || a.condition(record)),
        )
        return (
          <React.Fragment key={pk}>
            <TableRow
              key={pk}
              onClick={
                selectOnRowClick ? () => handleSelectRecord(record)({ target: { checked: !isSelected } }) : undefined
              }
            >
              {enableSelection && (
                <TableCell padding="checkbox" checkbox>
                  <Checkbox checked={isSelected} onChange={handleSelectRecord(record)} />
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
                      <IconButton size={size} onClick={withStopPropagation(setExpandedRow, expandedRow === pk ? null : pk)}>
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
              {recordActions.length == 0 && !onExpandRow && !noColumnsResizing && <TableCell />}
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
  )
}

export default DataTableBody
