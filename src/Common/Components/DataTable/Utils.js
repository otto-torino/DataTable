import { curry, propEq } from "ramda"

// model related utils
export const getPrimaryKey = curry((model, record) => {
  return record[model.primaryKey] // @TODO combined primary key
})

export const getRawValue = (record, field) => {
    switch (field.type) {
        case 'string':
            return record[field.id]
        case 'int':
            return parseInt(record[field.id])
        case 'float':
            return parseFloat(record[field.id])
        case 'boolean':
            return record[field.id]
        default:
            return record[field.id]
            
    }
}

export const getValue = (record, field, renderContext) => {
    if (field.render) {
        return field.render(record, renderContext)
    }
    return getRawValue(record, field)
}

export const getFieldById = (model, fieldId) => model.fields.find(propEq(fieldId, 'id'))

export const createColumnsPropsWithStorage = (
  columns,
  listDisplay,
  storedColumns,
) =>
  columns
    .map((column) => ({
      id: column.id,
      visible: storedColumns
        ? storedColumns?.find(propEq(column.id, 'id'))?.visible
        : listDisplay.indexOf(column.id) !== -1,
    }))
    .sort((a, b) => {
      if (storedColumns) {
        return storedColumns.findIndex(propEq(a.id, 'id')) >
          storedColumns.findIndex(propEq(b.id, 'id'))
          ? 1
          : -1
      } else {
        if (
          listDisplay.indexOf(a.id) !== -1 &&
          listDisplay.indexOf(b.id) !== -1
        ) {
          return listDisplay.indexOf(a.id) - listDisplay.indexOf(b.id)
        } else if (listDisplay.indexOf(a.id) !== -1) {
          return -1
        } else {
          return 1
        }
      }
    })


// events related utils
export const withEventValue = (fn, isCheckbox) => e => fn(isCheckbox ? e.target.checked : e.target.value)

// i18n related utils
export const defaultT = stringId => stringId.replace('common:dataTable.', '').split(/(?=[A-Z])/).join(' ')

