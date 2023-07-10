import { always, defaultTo, identity, ifElse, isNil, path, propOr } from 'ramda'

const app = 'DATA_TABLE'

// default functions

export const fromStorage = (key, defaultValue = null) => {
  let val = null
  try {
    val = JSON.parse(localStorage.getItem(`${app}_${key}`))
  } catch (e) {
    console.warn('Get from local storage error: ', e)
  }
  return ifElse(isNil, always(defaultValue), identity)(val)
}

export const toStorage = (key, value, onQuotaError) => {
  try {
    return localStorage.setItem(`${app}_${key}`, JSON.stringify(value))
  } catch (err) {
    if (/quota/.test(err.message) || /size/.test(err.message)) {
      onQuotaError('localStorageQuotaExceeded')
    }
    console.error('Local storage save item error', err)
    return false
  }
}

export const fromSessionStorage = (key, defaultValue = null) => {
  let val = null
  try {
    val = JSON.parse(sessionStorage.getItem(`${app}_${key}`))
  } catch (e) {
    console.warn('Get from local storage error: ', e)
  }
  return ifElse(isNil, always(defaultValue), identity)(val)
}

export const toSessionStorage = (key, value, onQuotaError) => {
  try {
    return sessionStorage.setItem(`${app}_${key}`, JSON.stringify(value))
  } catch (err) {
    if (/quota/.test(err.message) || /size/.test(err.message)) {
      onQuotaError('localStorageQuotaExceeded')
    }
    console.error('Local storage save item error', err)
    return false
  }
}

// retrieve data
export const getSettings = defaultTo({}, path(['settings']))
export const getSettingPageSize = defaultTo(null, path(['settings', 'pageSize']))
export const getSettingSort = defaultTo(null, path(['settings', 'sort']))
export const getSettingColumns = defaultTo([], path(['settings', 'columns']))
export const getResizing = defaultTo(null, path(['resizing']))
