import { Cached, Settings } from '@mui/icons-material'
import PropTypes from 'prop-types'
import { useContext } from 'react'

import { DataTableContext } from './DataTableProvider'
import Loader from './Loader'
import {
  Box,
  ToolbarActions,
  ToolbarSelection,
  ToolbarContainer,
  SelectAll,
  SelectAllLink,
  Tooltip,
  IconButton,
} from './Styled'

const Toolbar = () => {
  const {
    t,
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
  } = useContext(DataTableContext)
  return (
    <ToolbarContainer>
      {selectable && (
        <Box direction="row" align="center" gap="0">
          <ToolbarSelection>
            {selected.length} {t('common:dataTable.selected')}
          </ToolbarSelection>
          {selectable &&
            !noBulkSelection &&
            !noAllSelection &&
            selected.length === displayData.length &&
            selected.length !== data.length && (
              <SelectAll component="div">
                <SelectAllLink onClick={handleSelectAll(data)} size="small">
                  {t('common:dataTable.SelectAll')}
                </SelectAllLink>
              </SelectAll>
            )}
          {selectable && !!selected.length && (
            <SelectAll component="div">
              <SelectAllLink onClick={handleClearSelection} size="small">
                {t('common:dataTable.ClearSelection')}
              </SelectAllLink>
            </SelectAll>
          )}
        </Box>
      )}
      <ToolbarActions direction="row" align="center" gap="0">
        {isLoading && <Loader display="inline-flex" size={18} />}
        {!!onRefetch && (
          <Tooltip title={t('common:dataTable.Refresh')}>
            <IconButton size="small" onClick={onRefetch}>
              <Cached />
            </IconButton>
          </Tooltip>
        )}
        {!noSettings && (
          <Tooltip title={t('common:dataTable.Settings')}>
            <IconButton size="small" onClick={handleOpenSettings}>
              <Settings />
            </IconButton>
          </Tooltip>
        )}
      </ToolbarActions>
    </ToolbarContainer>
  )
}

Toolbar.propTypes = {}

export default Toolbar
