import { api, apiQueryString } from '../Api'

const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    campaigns: builder.query({
      query: (qs) => ({
        url: `newsletter/campaign/?${apiQueryString(qs)}`,
      }),
      providesTags: [{ type: 'Campaign' }],
    }),
  }),
  overrideExisting: false,
})

export const {
  useCampaignsQuery,
} = extendedApi
