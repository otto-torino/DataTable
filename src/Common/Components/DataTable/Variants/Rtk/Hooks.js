import { defaultTo } from 'ramda'
import { useState } from 'react'
import { PAGE_SIZE } from '../../Defaults'
import { fromStorage as defaultFromStorage, getSettingPageSize, getSettingSort } from '../../Storage'

const defaultAdapter = (pageSize, page, sort) => ({
  top: pageSize,
  skip: (page - 1) * pageSize,
  orderby: sort.field,
  ordertype: sort.direction,
})

export const useRtkQuery = (dataTableId, endpoint, qsAdditions, defaultSort, opts) => {
  const fromStorage = opts?.fromStorage || defaultFromStorage
  const storageData = fromStorage(dataTableId, {})
  const pageSize = defaultTo(PAGE_SIZE, getSettingPageSize(storageData))
  const dftSort = defaultTo(defaultSort, getSettingSort(storageData))
  const adapter = opts?.adapter || defaultAdapter

  const [qs, setQs] = useState({
    base: adapter(pageSize, 1, dftSort),
    qsAdditions,
  })
  const refreshData = setQs
  const { data, orData, isFetching, refetch } = endpoint({ ...qs.base, ...qs.qsAdditions })

  const count = orData?.data['count'] || -1

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
