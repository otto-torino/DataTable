import { defaultTo } from 'ramda'
import { useCallback, useState } from 'react'

import Config from '../../Config'
import {
  fromStorage as defaultFromStorage,
  fromSessionStorage as defaultFromSessionStorage,
  getSettingPageSize,
  getSettingSort,
} from '../../Storage'

export const useRtkQuery = (dataTableId, endpoint, qsAdditions, defaultSort, opts) => {
  const fromStorage = opts?.fromStorage || defaultFromStorage
  const fromSessionStorage = opts?.fromSessionStorage || defaultFromSessionStorage
  const storageData = fromStorage(dataTableId, {})
  const sessionStorageData = fromSessionStorage(dataTableId, {})
  const pageSize = defaultTo(Config.defaultPageSize, getSettingPageSize(storageData))
  const dftSort = defaultTo(defaultTo(defaultSort, getSettingSort(storageData)), sessionStorageData?.sort)
  const getCount = opts?.getCount || ((data) => data?.count || -1)

  const [qs, setQs] = useState({
    base: {
      page: defaultTo(0, sessionStorageData?.page),
      pageSize,
      orderBy: dftSort.field,
      orderType: dftSort.direction,
    },
    qsAdditions,
  })
  const refreshData = setQs
  const { data, isFetching, refetch } = endpoint({ ...qs.base, ...qs.qsAdditions })

  const count = getCount(data)

  return {
    qs,
    isFetching,
    data,
    count,
    refetch,
    refreshData,
    dftSortField: dftSort.field,
    dftSortDirection: dftSort.direction,
  }
}

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

  const setPage = (page) => {
    if (useSessionStorage) {
      toSessionStorage(id, { ...sessionStorageData, page })
    }
    return baseSetPage(page)
  }
  const resetPageSize = () => setPageSize(defaultPageSize)

  return { page, setPage, pageSize, setPageSize, resetPageSize }
}

export const useSorting = (
  id,
  defaultSortField,
  defaultSortDirection,
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

  const resetSort = () => {
    setSort({
      field: defaultSortField,
      direction: defaultSortDirection,
    })
  }

  return { sort, setSort, handleSortChange, resetSort }
}
