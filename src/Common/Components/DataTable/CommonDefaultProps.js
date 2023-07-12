import { fromSessionStorage, fromStorage, toSessionStorage, toStorage } from "./Storage";
import { defaultT } from "./Utils";
import  { T } from "ramda"

export default {
  size: 'small',
  selectable: false,
  noBulkSelection: false,
  noAllSelection: false,
  renderContext: {},
  t: defaultT,
  fromStorage,
  toStorage,
  fromSessionStorage,
  toSessionStorage,
  storePageAndSortInSession: true,
  actions: [],
  fullTextSearchFields: [],
  onExpandRowCondition: T,
}
