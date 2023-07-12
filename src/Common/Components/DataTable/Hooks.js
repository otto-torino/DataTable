import { compose, defaultTo, differenceWith, equals, not, uniqBy } from 'ramda'
import { useEffect } from 'react'
import { getResizing } from './Storage'

import { createResizableColumn, getPrimaryKey } from './Utils'


export const useSelection = (selected, onSelect, model) => {
  const handleSelectRecord = (record) => (event) => {
    const checked = event.target.checked
    const primaryKeyValue = getPrimaryKey(model, record)
    onSelect(
      checked ? [...selected, record] : selected.filter(compose(not, equals(primaryKeyValue), getPrimaryKey(model))),
    )
  }

  const handleSelectPage = (displayData) => (event) => {
    const checked = event.target.checked
    onSelect(checked ? uniqBy(getPrimaryKey(model), [...selected, ...displayData]) : differenceWith(equals, selected, displayData))
  }
  const isRecordSelected = (pk) => selected.some(compose(equals(pk), getPrimaryKey(model)))
  const isPageSelected = (displayData) => {
    return (
      displayData.length !== 0 &&
      displayData.every((record) => selected.some(compose(equals(getPrimaryKey(model, record)), getPrimaryKey(model))))
    )
  }

  const handleSelectAll = (data) => () => onSelect(data)
  const handleClearSelection = () => onSelect([])

  return { handleSelectRecord, handleSelectPage, handleSelectAll, handleClearSelection, isRecordSelected, isPageSelected }
}


export const useResizableColumns = (
  id,
  data,
  displayColumns,
  isLoading,
  fromStorage,
  toStorage,
  { disabled },
) => {
  useEffect(() => {
    const run = async () => {
      if (!isLoading && !disabled) {
        const table = document.getElementById(`datatable-${id}`)
        const storageData = await fromStorage(id, {})
        const resizingSettings = getResizing(storageData)

        setTimeout(async () => {
          if (table) {
            // Query all headers
            try {
              const cols = table.querySelectorAll(':scope > thead > tr > *')
              const handleSave = async (dataId, w) => {
                const storageData = await fromStorage(id, {})
                const data = defaultTo({}, storageData.resizing)
                data[dataId] = w
                await toStorage(id, { ...storageData, resizing: data })
              }

              let index = 0
              for (const col of cols) {
                if (!col.classList.contains('resizable-fix')) {
                  const dataId = col.getAttribute('data-id')
                  // set initial column width
                  let w
                  if (!resizingSettings || !resizingSettings[dataId]) {
                    // calculate on the fly the first time
                    const styles = window.getComputedStyle(col)
                    w = parseFloat(styles.width)
                    await handleSave(dataId, w)
                  } else {
                    // use cached values
                    w = resizingSettings[dataId]
                  }
                  col.style.width = `${w}px`
                  col.style.minWidth = `${w}px`
                  col.style.maxWidth = `${w}px`

                  // Update the with of all column tds
                  const rows = table.querySelectorAll(':scope > tbody > tr')
                  ;[].forEach.call(rows, function (row) {
                    const cells = row.querySelectorAll(':scope > td')
                    if (cells.length && cells.length > 1) { // expand rows
                      cells[index].style.width = `${w}px`
                      cells[index].style.minWidth = `${w}px`
                      cells[index].style.maxWidth = `${w}px`
                    }
                  })

                  // Create a resizer element
                  const resizer = document.createElement('div')
                  resizer.classList.add('resizer')

                  // Add a resizer element to the column
                  col.querySelector('.resizer')?.remove()
                  col.appendChild(resizer)
                  createResizableColumn(col, resizer, table, dataId, index, handleSave)
                }
                index++
              }
            } catch (e) {
              console.warn('Datatable table useResizing hook error', id, e)
            }
          }
        }, 0)
      }
    }
    run()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, displayColumns, isLoading])
}
