import { compose, curry, either, filter, isNil, prop, propEq } from "ramda"
import { BULK_ACTION_TYPE, RECORD_ACTION_TYPE } from "./Constants"

// model related utils
export const getPrimaryKey = curry((model, record) => {
  return model.primaryKey
    .split(',')
    .map((f) =>
      f.split('.').reduce((acc, curr) => (acc ? acc[curr] : null), record),
    )
    .join('-')
})

// @TODO types
export const getRawValue = (record, field) => {
    const raw = field.id
      .split('.')
      .reduce((acc, curr) => (acc ? acc[curr] : null), record)

    switch (field.type) {
        case 'string':
            return raw?.toString() || raw
        case 'int':
            return parseInt(raw)
        case 'float':
            return parseFloat(raw)
        case 'boolean':
            return raw
        default:
            return raw
            
    }
}

export const getValue = (record, field, renderContext) => {
    if (field.render) {
        return field.render(record, renderContext)
    }
    return getRawValue(record, field)
}

export const getCsvValue = (record, field, renderContext) => {
    if (field.csvValue) {
        return field.csvValue(record, renderContext)
    }
    return getRawValue(record, field)
}

export const getFieldById = (model, fieldId) => model.fields.find(propEq(fieldId, 'id'))

export const createColumnsPropsWithStorage = (
  columns,
  listDisplay,
  storedColumns,
) =>
  columns
    .map((column) => ({
      id: column.id,
      visible: storedColumns && storedColumns.length
        ? storedColumns?.find(propEq(column.id, 'id'))?.visible
        : listDisplay.indexOf(column.id) !== -1,
    }))
    .sort((a, b) => {
      if (storedColumns && storedColumns.length) {
        return storedColumns.findIndex(propEq(a.id, 'id')) >
          storedColumns.findIndex(propEq(b.id, 'id'))
          ? 1
          : -1
      } else {
        if (
          listDisplay.indexOf(a.id) !== -1 &&
          listDisplay.indexOf(b.id) !== -1
        ) {
          return listDisplay.indexOf(a.id) - listDisplay.indexOf(b.id)
        } else if (listDisplay.indexOf(a.id) !== -1) {
          return -1
        } else {
          return 1
        }
      }
    })

// data related utils
export const applyFullTextSearchFilter = (model, fullTextSearchFields, fullTextSearch) => (record) => {
  if (!fullTextSearch) {
    return true
  }
  return fullTextSearchFields.some((field) => {
    const value = getRawValue(record, field)
    return value && value.toString().toLowerCase().indexOf(fullTextSearch.toLowerCase()) !== -1
  })
}

// events related utils
export const withEventValue = (fn, isCheckbox) => e => fn(isCheckbox ? e.target.checked : e.target.value)
export const withStopPropagation = (fn, ...args) => (e) => {
  e.stopPropagation()
  fn(...args)
}

// i18n related utils
export const defaultT = stringId => stringId.replace('common:dataTable.', '').split(/(?=[A-Z])/).join(' ')

// actions utils
export const getRecordActions = filter(either(compose(isNil, prop('type')), propEq(RECORD_ACTION_TYPE, 'type')))
export const getBulkActions = filter(either(compose(isNil, prop('type')), propEq(BULK_ACTION_TYPE, 'type')))

// resize
export const createResizableColumn = function (col, resizer, table, dataId, idx, handleSave) {
  // Track the current position of mouse
  let x = 0
  let w = 0

  const mouseDownHandler = function (e) {
    // Get the current mouse position
    x = e.pageX

    // Calculate the current width of column
    const styles = window.getComputedStyle(col)
    w = parseInt(styles.width, 10)

    // Attach listeners for document's events
    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
  }

  const mouseMoveHandler = function (e) {
    // Determine how far the mouse has been moved
    const dx = e.pageX - x

    // Update the width of th cell
    if (w + dx > 30) {
      col.style.width = `${w + dx}px`
      col.style.minWidth = `${w + dx}px`
      col.style.maxWidth = `${w + dx}px`

      // Update the with of all column tds
      const rows = table.querySelectorAll(':scope > tbody > tr')
      ;[].forEach.call(rows, function (row) {
        const cells = row.querySelectorAll(':scope > td')
        if (cells.length && cells.length > 1) { // expand rows
          cells[idx].style.width = `${w + dx}px`
          cells[idx].style.minWidth = `${w + dx}px`
          cells[idx].style.maxWidth = `${w + dx}px`
        }
      })

      handleSave(dataId, w + dx)
    }
  }

  // When user releases the mouse, remove the existing event listeners
  const mouseUpHandler = function () {
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }

  resizer.addEventListener('mousedown', mouseDownHandler)
}
