import { DragHandle } from '@mui/icons-material'
import { always, compose, equals, ifElse, isNil, max, not, path, pipe, prop } from 'ramda'
import { useContext } from 'react'

import { DataTableContext } from './DataTableProvider'
import { Container, Draggable } from './DragAndDrop'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DraggableRow,
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
    columns,
    size,
    setColumnsSettings,
    columnsSettings,
  } = useContext(DataTableContext)
  const selected = columnsSettings.filter(prop('visible')).map(prop('id'))
  const handlePageSizeChange = pipe(path(['target', 'value']), (v) => parseInt(v), max(1), setPageSize)
  const handleChangeDefaultSortField = (evt) => setSort({ ...sort, fieldId: evt.target.value })
  const handleChangeDefaultSortDirection = (evt) => setSort({ ...sort, direction: evt.target.value })

  console.log('COLUMNS SETTINGS', columnsSettings) // eslint-disable-line

  const handleSelectColumn = (id) => (event) => {
    setColumnsSettings(
      columnsSettings.map((column) =>
        ifElse(
          equals(id),
          always({ ...column, visible: prop('checked')(event.target) }),
          always(column),
        )(column.id),
      ),
    )
  }

  const handleDrop = ({ removedIndex, addedIndex }) => {
    const copy = [...columnsSettings]
    setColumnsSettings(
      ifElse(
        isNil,
        always(columns),
        compose(
          always(copy),
          always(copy.splice(addedIndex, 0, copy.splice(removedIndex, 1)[0])),
        ),
        always(columns),
      )(removedIndex),
    )
  }


  const sortedColumns = columns.sort((a, b) => {
    if (a.visible && !b.visible) {
      return -1
    } else if (b.visible && !a.visible) {
      return 1
    } else {
      return 0
    }
  })

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
        <p>
          {t('common:dataTable.ColumnsSettings')}
        </p>
        <Container onDrop={handleDrop}>
          {sortedColumns.map((column, idx) => {
            return (
              <Draggable key={`row-${column.id}`}>
                <DraggableRow direction='row' align='center' justify='space-between' first={idx === 0}>
                  <div>
                    <Checkbox
                      checked={selected.indexOf(column.id) !== -1}
                      onChange={handleSelectColumn(column.id)}
                      size={size}
                    />
                    <span>{column.label}</span>
                  </div>
                  <DragHandle sx={{ cursor: 'move' }} />
                </DraggableRow>
              </Draggable>
            )
          })}
        </Container>
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
