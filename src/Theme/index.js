import { dataTablePalette } from '@Common/Components/DataTable/Theme'
import { createTheme } from '@mui/material/styles'

const getPalette = (mode) => ({
  mode,
  ...dataTablePalette(mode),
})

const getTheme = (mode) => {
  const theme = createTheme({
    palette: getPalette(mode),
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          sizeSmall: {
            padding: '4px 8px'
          }
        }
      },
    },
  })
  return theme
}

export default getTheme
