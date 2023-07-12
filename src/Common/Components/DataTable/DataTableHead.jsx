import { useContext } from "react"
import { AdapterContext } from "./AdapterProvider"
import { DataTableContext } from "./DataTableProvider"

const DataTableHead = () => {
  const { TableHead, TableRow, TableCell, TableSortLabel, Checkbox } = useContext(AdapterContext)
  const { selectable, selected, displayData, displayColumns, sort, recordActions, onExpandRow, noSorting, noBulkSelection, noColumnsResizing, resizingColumnsData, noSticky, isPageSelected, handleSelectPage, handleSortChange } = useContext(DataTableContext)
  return (
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
          if (!noColumnsResizing && resizingColumnsData?.[column.id]) {
            const v = resizingColumnsData[column.id]
            widthStyles = { ...widthStyles, width: v, minWidth: v, maxWidth: v }
          }

          return (
            <TableCell
              style={{ ...widthStyles }}
              stickyLeft={idx === 0 && !noSticky}
              key={column.id}
              data-id={column.id}
              className={`th-col-name`}
            >
              {!noSorting && !column.disableSorting ? (
                <TableSortLabel
                  active={sort.field === column.id}
                  direction={sort.field === column.id ? sort.direction : 'asc'}
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
        {(recordActions.length > 0 || onExpandRow || !noColumnsResizing) && <TableCell className="resizable-fix" />}
      </TableRow>
    </TableHead>
  )
}

export default DataTableHead
