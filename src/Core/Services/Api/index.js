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

]

// https://redux-toolkit.js.org/rtk-query/usage/code-splitting
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: apiTags,
  endpoints: () => ({}),
})
