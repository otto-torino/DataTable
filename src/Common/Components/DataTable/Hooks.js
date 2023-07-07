import { always, compose, defaultTo, differenceWith, equals, ifElse, isNil, not, propEq, uniqBy } from 'ramda'
import { useCallback, useState } from 'react'

import { getFieldById, getPrimaryKey, getRawValue } from './Utils'

export const usePagination = (id, defaultPage, defaultPageSize, useSessionStorage, sessionStorageData, toSessionStorage) => {
  const [page, baseSetPage] = useState(useSessionStorage ? defaultTo(defaultPage, sessionStorageData?.page) : defaultPage)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  const paginate = (data) => data.slice(page * Math.max(1, pageSize), (page + 1) * Math.max(1, pageSize))

  const setPage = (page) => {
    if (useSessionStorage) {
      toSessionStorage(id, { ...sessionStorageData, page })
    }
    return baseSetPage(page)
  }
  const resetPageSize = () => setPageSize(defaultPageSize)

  return { page, setPage, pageSize, setPageSize, paginate, resetPageSize }
}

export const useSorting = (id, defaultSortField, defaultSortDirection, model, useSessionStorage, sessionStorageData, toSessionStorage) => {
  const [sort, baseSetSort] = useState({
    fieldId: useSessionStorage ? defaultTo(defaultSortField, sessionStorageData?.sort?.fieldId) : defaultSortField,
    direction: useSessionStorage ? defaultTo(defaultSortField, sessionStorageData?.sort?.direction) : defaultSortDirection,
  })

  const setSort = useCallback((sort) => {
    if (useSessionStorage) {
      toSessionStorage(id, { ...sessionStorageData, sort })
    }
    return baseSetSort(sort)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toSessionStorage, id, JSON.stringify(sessionStorageData), useSessionStorage])

  const handleSortChange = (fieldId) => () =>
    setSort({
      fieldId,
      direction: sort.fieldId === fieldId && sort.direction === 'asc' ? 'desc' : 'asc',
    })

  const getSortingValue = (record, fieldId) => {
    const field = getFieldById(model, fieldId)
    if (field.sortingValue) {
      return field.sortingValue(record)
    }
    return getRawValue(record, model.fields.find(propEq(fieldId, 'id')))
  }

  const sortingComparison = (a, b) => {
    const aValue = getSortingValue(a, sort.fieldId)
    const bValue = getSortingValue(b, sort.fieldId)
    return ifElse(isNil, always(1), () =>
      ifElse(isNil, always(-1), () => (bValue < aValue ? 1 : -1) * (sort.direction === 'asc' ? 1 : -1))(bValue),
    )(aValue)
  }

  const resetSort = () => {
    setSort({
      fieldId: defaultSortField,
      direction: defaultSortDirection,
    })
  }

  return { sort, setSort, handleSortChange, getSortingValue, sortingComparison, resetSort }
}

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
