import PropTypes from 'prop-types'
import { BULK_ACTION_TYPE, RECORD_ACTION_TYPE } from './Constants'

export default {
  // table uniq id
  id: PropTypes.string.isRequired,
  // table and fields size: 'small' | 'medium',...
  size: PropTypes.string,
  // enable rows selection
  selectable: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func, // gets the record and returns true/false
  ]),
  // selected records
  selected: PropTypes.array,
  // callback when selection changes
  onSelect: PropTypes.func,
  // disable bulk selection
  noBulkSelection: PropTypes.bool,
  // disable all records selection
  noAllSelection: PropTypes.bool,
  // recors model
  model: PropTypes.object.isRequired,
  // data set
  data: PropTypes.array,
  // callback when refetch button is pressed
  onRefetch: PropTypes.func,
  // data is loading
  isLoading: PropTypes.bool,
  // page size is determined with the following precedence order:
  // 1. stored value
  // 2. defaultPageSize prop
  // 3. model.pageSize
  // 4. Config.defaultPageSize
  defaultPageSize: PropTypes.number,
  // disable page number input field
  noPageInputField: PropTypes.bool,
  // sort field determined with the following precedence order:
  // 1. stored value
  // 2. defaultSortField prop
  // 3. model.sort.field
  // 4. Config.defaultSortField
  defaultSortField: PropTypes.string,
  // sort direction determined with the following precedence order:
  // 1. stored value
  // 2. defaultSortDirection prop
  // 3. model.sort.direction
  // 4. Config.defaultSortDirection
  defaultSortDirection: PropTypes.string,
  // disable sorting
  noSorting: PropTypes.bool,
  // context passed to model renders methods
  renderContext: PropTypes.object,
  // disable toolbar
  noToolbar: PropTypes.bool,
  // disable settings dialog
  noSettings: PropTypes.bool,
  // translation function
  t: PropTypes.func,
  // retrieve from storage
  fromStorage: PropTypes.func,
  // save to storage
  toStorage: PropTypes.func,
  // store page and sort in session
  storePageAndSortInSession: PropTypes.bool,
  // retrieve from session storage (save current page and sorting in session)
  fromSessionStorage: PropTypes.func,
  // save to session storage
  toSessionStorage: PropTypes.func,
  // columns which should be visible
  listDisplay: PropTypes.arrayOf(PropTypes.string).isRequired,
  // disable export
  noExport: PropTypes.bool,
  // function called when filter button is pressed
  // filter button is not displayed if null or undefined
  onFilter: PropTypes.func,
  // true if data are filtered
  isFilterFormActive: PropTypes.bool,
  // single record actions
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
  // callback when action is triggered, receives object {id, record}
  onAction: PropTypes.func,
  // fields for which to enable full text search
  fullTextSearchFields: PropTypes.arrayOf(PropTypes.string),
  // display content as row accordion
  onExpandRow: PropTypes.func,
  // should display expand button for the record
  onExpandRowCondition: PropTypes.func,
  // disabl columns resizing
  noColumnsResizing: PropTypes.bool,
  // disable first and last columns sticky position
  noSticky: PropTypes.bool,
}
