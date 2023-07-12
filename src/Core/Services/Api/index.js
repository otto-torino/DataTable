// rtk
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: "https://www.tazebao.email/api/v1/",
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = import.meta.env.VITE_API_TOKEN
    if (token) {
      headers.set('Authorization', `JWT ${token}`)
    }
    return headers
  },
})

export const apiTags = [
  "Campaign",
]

// https://redux-toolkit.js.org/rtk-query/usage/code-splitting
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: apiTags,
  endpoints: () => ({}),
})

export const apiQueryString = (qs) => {
  const { page, page_size, sort, sort_direction, ...rest } = qs
  const more = Object.keys(rest)
    .map((k) => `${k}=${encodeURIComponent(rest[k])}`)

  return (
    `page=${page}&page_size=${page_size}&sort=${sort}&sort_direction=${sort_direction}` +
    (more.length ? '&' + more.join('&') : '')
  )
}
