import { always, defaultTo, ifElse, isNil, propEq } from 'ramda'
import { useCallback, useState } from 'react'

import { getFieldById, getRawValue } from '../../Utils'

export const usePagination = (
  id,
  defaultPage,
  defaultPageSize,
  useSessionStorage,
  sessionStorageData,
  toSessionStorage,
) => {
  const [page, baseSetPage] = useState(
    useSessionStorage ? defaultTo(defaultPage, sessionStorageData?.page) : defaultPage,
  )
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

export const useSorting = (
  id,
  defaultSortField,
  defaultSortDirection,
  model,
  useSessionStorage,
  sessionStorageData,
  toSessionStorage,
) => {
  const [sort, baseSetSort] = useState({
    field: useSessionStorage ? defaultTo(defaultSortField, sessionStorageData?.sort?.field) : defaultSortField,
    direction: useSessionStorage
      ? defaultTo(defaultSortField, sessionStorageData?.sort?.direction)
      : defaultSortDirection,
  })

  const setSort = useCallback(
    (sort) => {
      if (useSessionStorage) {
        toSessionStorage(id, { ...sessionStorageData, sort })
      }
      return baseSetSort(sort)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toSessionStorage, id, JSON.stringify(sessionStorageData), useSessionStorage],
  )

  const handleSortChange = (field) => () =>
    setSort({
      field,
      direction: sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc',
    })

  const getSortingValue = (record, field) => {
    const modelField = getFieldById(model, field)
    console.log('MODEL VALUE', model, modelField) // eslint-disable-line
    if (modelField.sortingValue) {
      return modelField.sortingValue(record)
    }
    return getRawValue(record, modelField)
  }

  const sortingComparison = (a, b) => {
    const aValue = getSortingValue(a, sort.field)
    const bValue = getSortingValue(b, sort.field)

    return ifElse(isNil, always(1), () =>
      ifElse(isNil, always(-1), () => (bValue < aValue ? 1 : -1) * (sort.direction === 'asc' ? 1 : -1))(bValue),
    )(aValue)
  }

  const resetSort = () => {
    setSort({
      field: defaultSortField,
      direction: defaultSortDirection,
    })
  }

  return { sort, setSort, handleSortChange, getSortingValue, sortingComparison, resetSort }
}
