import { curry, propEq } from "ramda"

// model related utils
export const getPrimaryKey = curry((model, record) => {
  return record[model.primaryKey]
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


// events related utils
export const withEventValue = (fn, isCheckbox) => e => fn(isCheckbox ? e.target.checked : e.target.value)

// i18n related utils
export const defaultT = stringId => stringId.replace('common:dataTable.', '').split(/(?=[A-Z])/).join(' ')

