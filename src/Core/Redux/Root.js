import { combineReducers } from 'redux'

// reducers and epics
import { api } from '../Services/Api'

// root reducer
export const RootReducer = combineReducers({
  api: api.reducer,
})
