import { fromSessionStorage, fromStorage, toSessionStorage, toStorage } from "./Storage";
import  { T } from "ramda"

export default {
  size: 'small',
  selectable: false,
  noBulkSelection: false,
  noAllSelection: false,
  renderContext: {},
  fromStorage,
  toStorage,
  fromSessionStorage,
  toSessionStorage,
  storePageAndSortInSession: true,
  actions: [],
  fullTextSearchFields: [],
  onExpandRowCondition: T,
}
