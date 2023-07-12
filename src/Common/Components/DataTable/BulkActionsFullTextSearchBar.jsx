import { Help } from '@mui/icons-material'
import { toLower } from 'ramda'
import { useContext, useState } from 'react'

import { AdapterContext } from './AdapterProvider'
import { DataTableContext } from './DataTableProvider'
import { getBulkActions, withEventValue } from './Utils'

const BulkActionsFullTextSearchBar = () => {
  const {
    Box,
    Button,
    FormControl,
    InputAdornment,
    InputLabel,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Tooltip,
  } = useContext(AdapterContext)
  const { t, size, actions, onAction, fullTextSearchFields, selected, fullTextSearch, setFullTextSearch } =
    useContext(DataTableContext)
  const [selectedAction, setSelectedAction] = useState('')

  const bulkActions = getBulkActions(actions)

  const handleAction = () => {
    onAction({ id: selectedAction, record: null, records: selected })
  }

  return bulkActions.length === 0 && fullTextSearchFields.length === 0 ? null : (
    <Box margin="1rem 0" direction="row" align="center" justify="space-between">
      {bulkActions.length > 0 && (
        <Box direction="row" gap=".5rem">
          <FormControl style={{ width: '300px' }}>
            <InputLabel size={size}>{t('common:dataTable.Actions')}</InputLabel>
            <Select
              size={size}
              value={selectedAction}
              label={t('common:dataTable.Actions')}
              onChange={withEventValue(setSelectedAction)}
              renderValue={(value) => <Box direction="row">{value}</Box>}
            >
              <MenuItem key={'empty'} value={''}>
                <ListItemText>{'--'}</ListItemText>
              </MenuItem>
              {bulkActions.map((action) => (
                <MenuItem key={action.id} value={action.id}>
                  {action.icon && <ListItemIcon>{action.icon}</ListItemIcon>}
                  <ListItemText>{action.label}</ListItemText>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={handleAction} disabled={!selected.length || !selectedAction}>
            {t('common:dataTable.Go')}
          </Button>
        </Box>
      )}
      {fullTextSearchFields.length > 0 && (
        <Box direction="row" gap=".5rem" margin="0 0 0 auto">
          <TextField
            label={t('common:dataTable.Filter')}
            value={fullTextSearch}
            onChange={withEventValue(setFullTextSearch)}
            size={size}
            InputProps={{
              endAdornment: (
                <Tooltip title={t('common:dataTable.FilterBy') + ' ' + fullTextSearchFields.map(toLower).join(', ')}>
                  <InputAdornment position="end">
                    <Help color="info" style={{ cursor: 'help' }} />
                  </InputAdornment>
                </Tooltip>
              ),
            }}
          />
        </Box>
      )}
    </Box>
  )
}

BulkActionsFullTextSearchBar.propTypes = {}

export default BulkActionsFullTextSearchBar
