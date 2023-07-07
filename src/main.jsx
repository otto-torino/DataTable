import isPropValid from '@emotion/is-prop-valid'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { StyleSheetManager } from 'styled-components'

import App from './App.jsx'

const isValidProp = prop => {
  return isPropValid(prop) || prop === 'active' || prop === 'fullWidth'
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StyleSheetManager shouldForwardProp={isValidProp} disableVendorPrefixes={false}>
      <App />
    </StyleSheetManager>
  </React.StrictMode>,
)
