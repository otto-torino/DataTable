export const dataTablePalette = (mode) => ({
  dataTableContainer: {
    main: 'transparent',
  },
  dataTableContent: {
    main: mode === 'light' ? '#fff' : '#1F212C',
    contrastText: mode === 'light' ? '#000' : '#fff',
  },
  dataTableToolbar: {
    main: mode === 'light' ? '#FEF9EF' : '#111',
    contrastText: mode === 'light' ? '#fff' : '#fff',
  },
  dataTableToolbarIcon: {
    main: mode === 'light' ? '#227C9D' : '#111',
    contrastText: mode === 'light' ? '#fff' : '#fff',
  },
  dataTableToolbarIconActive: {
    main: mode === 'light' ? '#FE6D73' : '#111',
    contrastText: mode === 'light' ? '#fff' : '#fff',
  },
  dataTableToolbarSelected: {
    main: mode === 'light' ? '#16697A' : '#111',
  },
  dataTableToolbarSeparator: {
    main: mode === 'light' ? '#fff' : '#666',
  },
  dataTableWarning: {
    main: mode === 'light' ? '#ff9900' : '#ff9900',
    contrastText: mode === 'light' ? '#fff' : '#fff',
  },
  dataTableError: {
    main: mode === 'light' ? '#aa0000' : '#ff0000',
    contrastText: mode === 'light' ? '#fff' : '#fff',
  },
  dataTableContrastLight: {
    main: mode === 'light' ? '#e7e7e7' : '#111',
  },
  dataTableResizableHandle: {
    main: mode === 'light' ? '#e7e7e7' : '#111',
  },
  dataTableRowHover: {
    main: mode === 'light' ? '#D2FFF5' : '#111',
  },
  dataTableRowHighlighted: {
    main: mode === 'light' ? '#D2FFF5' : '#111',
  },
  dataTableSticky: {
    main: mode === 'light' ? '#fff' : '#000',
  }
})
