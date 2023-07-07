import { compose, max, not, path, pipe, prop } from 'ramda'
import { useContext, useState } from 'react'

import { DataTableContext } from './DataTableProvider'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormRow,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from './Styled'

const SettingsDialog = () => {
  const {
    t,
    handleCloseSettings,
    handleResetSettings,
    handleSaveSettings,
    pageSize,
    setPageSize,
    model,
    noSorting,
    sort,
    setSort,
  } = useContext(DataTableContext)

  const handlePageSizeChange = pipe(path(['target', 'value']), (v) => parseInt(v), max(1), setPageSize)
  const handleChangeDefaultSortField = (evt) => setSort({ ...sort, fieldId: evt.target.value })
  const handleChangeDefaultSortDirection = (evt) => setSort({ ...sort, direction: evt.target.value })

  return (
    <Dialog open onClose={handleCloseSettings} maxWidth="sm" fullWidth>
      <DialogTitle>{t('common:dataTable.Settings')}</DialogTitle>
      <DialogContent>
        <FormRow>
          <FormControl fullWidth>
            <TextField
              required
              min={1}
              max={100}
              label={t('common:dataTable.RowsPerPage')}
              helperText={t('common:dataTable.Min1Max100')}
              value={pageSize}
              onChange={handlePageSizeChange}
              type="number"
              size="small"
            />
          </FormControl>
        </FormRow>
        {!noSorting && (
          <FormRow>
            <FormControl fullWidth>
              <InputLabel required>{t('common:dataTable.DefaultSortField')}</InputLabel>
              <Select
                required
                size="small"
                value={sort.fieldId}
                label={t('common:dataTable.DefaultSortField')}
                onChange={handleChangeDefaultSortField}
              >
                {model.fields.filter(compose(not, prop('disableSorting'))).map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel required>{t('common:dataTable.DefaultSortDirection')}</InputLabel>
              <Select
                required
                size="small"
                value={sort.direction}
                label={t('common:dataTable.DefaultSortDirection')}
                onChange={handleChangeDefaultSortDirection}
              >
                <MenuItem key={'asc'} value={'asc'}>
                  {t('common:dataTable.Asc')}
                </MenuItem>
                <MenuItem key={'desc'} value={'desc'}>
                  {t('common:dataTable.Desc')}
                </MenuItem>
              </Select>
            </FormControl>
          </FormRow>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleResetSettings}>{t('common:dataTable.Reset')}</Button>
        <Button onClick={handleCloseSettings}>{t('common:dataTable.Close')}</Button>
        <Button onClick={handleSaveSettings}>{t('common:dataTable.SaveAndClose')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default SettingsDialog
