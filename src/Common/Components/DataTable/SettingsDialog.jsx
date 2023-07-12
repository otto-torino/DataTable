import { always, compose, equals, ifElse, isNil, max, not, path, pipe, prop, propEq } from 'ramda'
import { useContext } from 'react'
import { DataTableInternalContext } from './DataTableInternalProvider'

import { DataTableContext } from './DataTableProvider'
import { Container, Draggable } from './Lib/DragAndDrop'

const SettingsDialog = () => {
  const {
    t,
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
    DragHandle,
  } = useContext(DataTableContext)
  const {
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
    setColumnsSettings,
    columnsSettings,
    size,
  } = useContext(DataTableInternalContext)
  const selected = columnsSettings.filter(prop('visible')).map(prop('id'))
  const handlePageSizeChange = pipe(path(['target', 'value']), (v) => parseInt(v), max(1), setPageSize)
  const handleChangeDefaultSortField = (evt) => setSort({ ...sort, field: evt.target.value })
  const handleChangeDefaultSortDirection = (evt) => setSort({ ...sort, direction: evt.target.value })

  const handleSelectColumn = (id) => (event) => {
    setColumnsSettings(
      columnsSettings.map((column) =>
        ifElse(equals(id), always({ ...column, visible: prop('checked')(event.target) }), always(column))(column.id),
      ),
    )
  }

  const handleDrop = ({ removedIndex, addedIndex }) => {
    const copy = [...columnsSettings]
    setColumnsSettings(
      ifElse(
        isNil,
        always(columns),
        compose(always(copy), always(copy.splice(addedIndex, 0, copy.splice(removedIndex, 1)[0]))),
        always(columns),
      )(removedIndex),
    )
  }

  const sortedColumns = columnsSettings
    .sort((a, b) => {
      if (a.visible && !b.visible) {
        return -1
      } else if (b.visible && !a.visible) {
        return 1
      } else {
        return 0
      }
    })
    .map(({ id }) => columns.find(propEq(id, 'id')))

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
              size={size}
            />
          </FormControl>
        </FormRow>
        {!noSorting && (
          <FormRow>
            <FormControl fullWidth>
              <InputLabel size={size} required>
                {t('common:dataTable.DefaultSortField')}
              </InputLabel>
              <Select
                required
                size="small"
                value={sort.field}
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
              <InputLabel size={size} required>
                {t('common:dataTable.DefaultSortDirection')}
              </InputLabel>
              <Select
                required
                size={size}
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
        <p>{t('common:dataTable.ColumnsSettings')}</p>
        <Container onDrop={handleDrop}>
          {sortedColumns.map((column, idx) => {
            return (
              <Draggable key={`row-${column.id}`}>
                <DraggableRow direction="row" align="center" justify="space-between" first={idx === 0}>
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
