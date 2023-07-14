# DataTable

This is a project used to implement the datatable component.

Currently 2 kinds of datatable are implemented:
- Client: manages a whole set of data (pagination, sorting and filtering can be addressed by the table itself clientside)
- Rtk: manage a set of data retrieved through RTK query (server-side pagination sorting and filtering)

It's designed to work with MUI, but you can write your own adapter to support other design frameworks

## Dependencies

- ramda
- smooth-dnd
- react-csv
- dayjs

If using the RTK variant:

- redux
- react-redux
- @reduxjs/toolkit

If using the MUI adapter:

- styled-components
- @fontsource/roboto
- @mui/icons-material
- @mui/material
- @mui/styled-engine-sc

## Example

  ``` jsx
  import MuiAdapterContext from 'DataTable/Adapters/Mui/MuiAdapterContext.js'
  import { useTranslation } from 'react-18next'
  import DefaultDataTableContext from './DataTable/DefaultDataTableContext'
  import DataTable from 'DataTable'
  import DataProvider from 'DataTableProvider'

  const MyComponent = () => {
    // translation function
    const { t } = useTranslation()
    // the DataTable component is memoized, so pay attention to complex props!
    const vehicles = [{ id: 1, name: 'FIAT 500'}, ...]
    const LIST_DISPLAY = useMemo(() => ['id', 'name'], [])
    const onFilter = useCallback(
      (handleClose) => <Modal onClose={handleClose}>FILTERS</Modal>,
      [Modal]
    )
    const onRefetch = useCallback(() => { /* refetch data */ }, [])
    const onExpandRow = useCallback((record) => <div>Some record related stuff</div>, [])
    const actions = useMemo(() => [{ id: 'EDIT', label: 'Edit', icon: <Edit /> }, ...], [])
    const handleAction = useCallback((actionId, record, records) => { /* do something */ }, [])
    const SEARCH_FIELDS = useMemo(() => ['id', 'name'], [])

    return (
      <DataTableProvider context={{ ...MuiAdapterContext, ...DefaultDataTableContext, t }}>
        <DataTable
          variant="client"
          selectable
          id="vehicles"
          data={vehicles}
          model={Vehicle}
          selected={selected}
          onSelect={setSelected}
          onRefetch={onRefetch}
          storePageAndSortInSession
          listDisplay={LIST_DISPLAY}
          onFilter={onFilter}
          isFilterFormActive={false}
          actions={actions}
          onAction={handleAction}
          fullTextSearchFields={SEARCH_FIELDS}
          onExpandRow={onExpandRow}
        />
      </DataTableProvider>
    )
  }
  ```

## Common props

|Prop|Type|Required|Default|Description|
|:---|:---|:-------|:-------|:-----------|
|adapter|string|false|mui|ui adapter|
|variant|string|false|client|datatable variant: client \| rtk|
|id|string|true||Unique identifier of the datatable|
|size|string|false|small|Size of the table and of the fields|
|selectable|bool\|function|true|false|Whether to allow rows selection or not. If a function will be called for each record, and the checkbox is shown if it returns true|
|selected|array|false|[]|The selected records|
|onSelect|function|false||The function called when the selected rows change, receives the new selected rows as argument|
|noBulkSelection|bool|false|false|Disable bulk selection (page and all rows)|
|noAllSelection|bool|false|false|Disable all rows selection|
|selectOnRowClick|bool|false|true|If true the record can be selected clicking everywhere in the row|
!highlightSelectedRows|bool|false|true|If tre selected rows are highlighted (bg color)|
|model|object|true||The model represented by the table (see below sections)|
|data|array|true||The table data|
|onRefetch|function|false||A function which activate the refetch button and it's called when clicking it|
|isLoading|bool|false|false|If data are being fetched|
|defaultPageSize|int|false||The default page size. Page size is determined with the following priority: stored value - this prop - model defined - config (10)|
|noPageInputField|bool|false|false|Hide the page input field|
|defaultSortField|string|false||The default sorting field. Sorting field is determined with the following priority: stored value - this prop - model defined - config (`id`)|
|defaultSortDirection|string|false||The default sorting direction (`asc` \| `desc`). Sorting direction is determined with the following priority: stored value - this prop - model defined - config (`asc`)|
|noSorting|bool|false|false|Disable sorting|
|renderContext|object|false|{}|A context passed to the model render function, used to customize field value|
|noToolbar|bool|false|false|Hide the toolbar (selection info and buttons)|
|noSettings|bool|false|false|Hide the settings icon|
|storePageAndSortInSession|bool|false|true|Whether to save current page and sorting field and direction in a session storage|
|listDisplay|array|true||A list of fields that should be displayed by default (actually displayed fields may vary, depending on user stored settings)|
|noExport|bool|false|false|Hide the export to csv functionality|
|onFilter|function|false||Function which receives a cose handler and should return a modal filtering form|
|isFilterFormActive|bool|false||Whether or not some any filter is active|
|actions|array|false|[]|List of available record or bulk actions (see below sections)|
|onAction|function|false||Function called when an action is triggered, it receives an object with the action id, the record (record action) and the records (bulk action)|
|fullTextSearchFields|array|false||A list of fields which should be considered when performing full text search. If empty the functionality is disabled|
|onExpandRow|function|false||A function which returns the node displayed in the accordion. It receives the record which should be expanded|
|onExpandRowCondition|function|false|T (ramda)|A function which reeives the record and should return true if it should be expandable, false otherwise|
|noColumnsResizing|bool|false||Disable the column resizing feature: table behaves like a normal table|
|noSticky|bool|false||Disable the sticky behavior of the first field column and the actions column |


## RTK props

|Prop|Type|Required|Default|Description|
|:---|:---|:-------|:-------|:-----------|
|qsAdditions|object|false|{}|Querystring parameters other than pagination and sorting stuff|
|refreshData|function|true||Function used to trigger a data refresh, it receives the new query string in the form `{ base: { page, pageSize, orderBy, orderType}, qsAdditions }`|
|count|int|false|-1|The total number of table data, -1 means that total number is unknown|

## Context, Adapters & Customization

DataTable uses many UI components. It comes with a MUI adapter. You can write your own adapters, or override the default one in some parts, but make sure to export all the components exported in `Adapters/Mui/MuiAdapterContext`.

Example:

``` jsx
// import MuiAdapterContext from 'DataTable/Adapters/Mui/MuiAdapterContext'
// import DefaultDataTableContext from 'DataTable/DefaultDataTableContext'
// import styled from 'styled-components'

const NewTableRow = styled.tr`background: #eee;`

<DataTableProvider context={{ ...MuiAdapterContext, TableRow: NewTableRow, ...DefaultDataTableContext, t: (stringId) => stringId }}>
  <DataTable .../>
</DataTableProvider>
```

Also DataTable uses a translation function for strings, it has a simple default one, but you can use your preferred one (i.e. react-i18next), just pass it to the DataTableProvider context.

In the same way, you can inject your custom storage functions. Datatable uses two different storages:
- one is used to store table settings and column widhts. It's managed through two functions: `fromStorage` and `toStorage`. Both can be async. By default two functions are provided which use the browser localStorage.
- the other is used to store current page and sorting info. It's managed through two functions: `fromSessionStorage` and `toSessionStorage`. Both must be sync. By default two functions are provided which use the sessionStorage.

## Config

Some functionality can be configured changing the `Config` values.

## RTK utils

You can use an utility hook to avoid too much boilerplate code:

``` javascript
const { qs, data, isFetching, refetch, refreshData, count } = useRtkQuery(
  'campaigns', // dataTableId
  useCampaignsQuery, // rtk endpoint
  qsAdditions, // qs additions
  { field: 'id', direction: 'asc' }, // default sorting
)
```

## Model

Example:

``` javascript
export default {
  primaryKey: 'id,name', // can be a field or a comma separated list of fields
  sort: {
    field: 'id', // default sort field
    direction: 'asc', // default sort direction
  },
  fields: [
    {
      id: 'id', // field unique identifier
      label: 'ID', // field label
      type: 'int', // field type
    },
    {
      id: 'name',
      label: 'Name',
      type: 'string',
    },
    {
      id: 'maxSpeed',
      label: 'Max Speed',
      type: 'int',
      disableSorting: true, // disable sorting by this column
    },
    {
      id: 'status',
      label: 'Status',
      type: 'string',
      render: (record, renderContext) => { // custom value rendering
        return (
          <div>
            <span style={{ color: 'blue' }}>{record.status}</span>
          </div>
        )
      },
      sortingValue: record => record.status, // value used for sorting purposes
      csvValue: record => 'cippa' // CSV value (export)
    },
  ],
}
```

## Actions

``` javascript
actions: PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.node,
    permission: PropTypes.func,
    condition: PropTypes.func,
    type: PropTypes.oneOf([RECORD_ACTION_TYPE, BULK_ACTION_TYPE]), // if undefined both types are allowed
  }),
),
```

The `onAction` callback receives the following argument:

``` javascript
{
  id: 'action id',
  record, // if record action, the record
  records, // if bulk action, the list of records
}
```
## Development

```
yarn dev
```
