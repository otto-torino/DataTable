import { dataTablePalette } from '@Common/Components/DataTable/Theme'
import { createTheme } from '@mui/material/styles'

const getPalette = (mode) => ({
  mode,
  ...dataTablePalette(mode),
})

const getTheme = (mode) => {
  const theme = createTheme({
    palette: getPalette(mode),
  })
  return theme
}

export default getTheme
