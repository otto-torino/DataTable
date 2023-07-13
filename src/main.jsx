import './wdyr'
import isPropValid from '@emotion/is-prop-valid'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { StyleSheetManager } from 'styled-components'

import MuiAdapterContext from '@Common/Components/DataTable/Adapters/Mui/MuiAdapterContext.js'
import DataTableProvider from '@Common/Components/DataTable/DataTableProvider.jsx'

import App from './App.jsx'
import store from './Core/Redux/Store'
import DefaultDataTableContext from '@Common/Components/DataTable/DefaultDataTableContext.js'

const isValidProp = (prop) => {
  return isPropValid(prop) || prop === 'active' || prop === 'fullWidth'
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <StyleSheetManager shouldForwardProp={isValidProp} disableVendorPrefixes={false}>
    <Provider store={store}>
      <DataTableProvider context={{ ...MuiAdapterContext, ...DefaultDataTableContext }}>
        <App />
      </DataTableProvider>
    </Provider>
  </StyleSheetManager>,
)
