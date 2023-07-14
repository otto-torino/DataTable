import { useContext, useState } from 'react'

import { CURSOR_POINTER_STYLE } from './Constants'
import { DataTableInternalContext } from './DataTableInternalProvider'
import { DataTableContext } from './DataTableProvider'
import ExportAction from './ExportAction'
import Loader from './Loader'

const Toolbar = () => {
  const {
    t,
    Box,
    ToolbarActions,
    ToolbarSelection,
    ToolbarContainer,
    SelectAll,
    Button,
    Tooltip,
    IconButton,
    Chip,
    Cached,
    FilterAlt,
    FilterAltOff,
    Settings,
  } = useContext(DataTableContext)
  const {
    noToolbar,
    selectable,
    selected,
    noBulkSelection,
    noAllSelection,
    displayData,
    data,
    isLoading,
    handleSelectAll,
    onRefetch,
    noSettings,
    handleOpenSettings,
    handleClearSelection,
    noExport,
    onFilter,
    isFilterFormActive,
  } = useContext(DataTableInternalContext)

  // filter form
  const [filterFormIsOpen, setFilterFormIsOpen] = useState(false)
  const handleOpenFilterForm = () => setFilterFormIsOpen(true)
  const handleCloseFilterForm = () => setFilterFormIsOpen(false)
  const FilterIcon = isFilterFormActive ? FilterAlt : FilterAltOff

  return noToolbar ? null : (
    <ToolbarContainer>
      {selectable && (
        <Box direction="row" align="center" gap="0">
          <ToolbarSelection direction="row" align="center" gap=".3rem">
            <Chip
              color='dataTableToolbarIcon'
              label={`${t('common:dataTable.Selected')}: ${selected.length}`}
              onDelete={selected.length ? handleClearSelection : undefined}
            />
            {!noBulkSelection &&
              !noAllSelection &&
              selected.length === displayData.length &&
              selected.length !== data.length && (
                <SelectAll component="div">
                  <Button onClick={handleSelectAll(data)} size="small" color='dataTableToolbarSelectAll'>
                    {t('common:dataTable.SelectAll')}
                  </Button>
                </SelectAll>
              )}
          </ToolbarSelection>
        </Box>
      )}
      <ToolbarActions direction="row" align="center" gap="0">
        {isLoading && <Loader color='dataTableToolbarIcon' display="inline-flex" size={18} />}
        {!!onRefetch && (
          <Tooltip title={t('common:dataTable.Refresh')}>
            <IconButton size="small" onClick={onRefetch}>
              <Cached color="dataTableToolbarIcon" />
            </IconButton>
          </Tooltip>
        )}
        {onFilter && (
          <Tooltip title={t('common:dataTable.Filter')}>
            <IconButton size="small" onClick={handleOpenFilterForm}>
              <FilterIcon style={CURSOR_POINTER_STYLE} color={isFilterFormActive ? 'dataTableToolbarIconActive' : 'dataTableToolbarIcon'} />
            </IconButton>
          </Tooltip>
        )}
        {!noExport && <ExportAction />}
        {!noSettings && (
          <Tooltip title={t('common:dataTable.Settings')}>
            <IconButton size="small" onClick={handleOpenSettings}>
              <Settings color="dataTableToolbarIcon" />
            </IconButton>
          </Tooltip>
        )}
      </ToolbarActions>
      {filterFormIsOpen && onFilter(handleCloseFilterForm)}
    </ToolbarContainer>
  )
}

Toolbar.propTypes = {}

export default Toolbar
