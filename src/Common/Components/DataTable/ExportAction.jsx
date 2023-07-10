import { Save } from '@mui/icons-material'
import PropTypes from 'prop-types'
import { defaultTo, isNil, isNotNil } from 'ramda'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { CSVLink } from 'react-csv'

import { DataTableContext } from './DataTableProvider'
import Loader from './Loader'
import { Dialog, DialogContent, IconButton, TextField, Alert, DialogActions, Button } from './Styled'
import { Tooltip } from './Styled'
import { getCsvValue, withEventValue } from './Utils'

const ExportAction = ({ exportApi, qs }) => {
  const { t, displayColumns, sortedData, renderContext, id } = useContext(DataTableContext)
  const [fileName, setFileName] = React.useState(`${new Date().toDateString().replace(/ /g, '-')}-${id}.csv`)
  const [isOpen, setIsOpen] = useState(false)
  const [csvData, setCsvData] = useState(null)
  const handleOpen = useCallback(() => setIsOpen(true), [setIsOpen])
  const handleClose = () => setIsOpen(false)

  useEffect(() => {
    const fn = async () => {
      if (isOpen) {
        setCsvData(null)
        const newData = []
        newData.push(displayColumns.map((c) => c.label))

        let data
        if (exportApi) {
          const res = await exportApi({
            ...qs.base,
            ...qs.qsAdditions,
            top: 10000,
          })
          data = defaultTo([], res.data?.value)
        } else {
          data = sortedData
        }

        data.forEach((record) => {
          newData.push(displayColumns.map((c) => getCsvValue(record, c, renderContext)))
        })
        setCsvData(newData)
      }
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(displayColumns), JSON.stringify(sortedData), isOpen, renderContext])

  return (
    <>
      <Tooltip title={t('common:dataTable.Export')}>
        <IconButton size="small" onClick={handleOpen}>
          <Save />
        </IconButton>
      </Tooltip>
      <Dialog onClose={handleClose} open={isOpen} maxWidth="sm">
        <DialogContent>
          <TextField
            required
            label={t('common:dataTable.FileName')}
            value={fileName}
            onChange={withEventValue(setFileName)}
          />
          {isNil(csvData) && <Loader size={20} minHeight="60px" />}
          {isNotNil(csvData) && exportApi && csvData.length >= 1e4 && (
            <Alert severity="info" sx={{ marginTop: '1rem' }}>
              {t('common:dataTable.Max10000Rows')}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('common:dataTable.Cancel')}
          </Button>
          {isNotNil(csvData) ? (
            <CSVLink data={csvData} filename={fileName} onClick={handleClose}>
              <Button disabled={isNil(csvData)}>{t('common:dataTable.Export')}</Button>
            </CSVLink>
          ) : (
            <Button disabled={isNil(csvData)}>{t('common:dataTable.Export')}</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}

ExportAction.propTypes = {
  exportApi: PropTypes.func,
  qs: PropTypes.object,
}
export default ExportAction
