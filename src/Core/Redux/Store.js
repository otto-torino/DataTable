import { configureStore } from '@reduxjs/toolkit'
import { RootReducer } from './Root'
import { api } from '../Services/Api'

const store = configureStore({
  reducer: RootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

export default store
