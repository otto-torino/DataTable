import PropTypes from 'prop-types'

export const VehicleType = PropTypes.shape({})

export default {
  primaryKey: 'id,name', // can be also be a comma separated list of fields
  sort: {
    field: 'id',
    direction: 'asc',
  },
  fields: [
    {
      id: 'id',
      label: 'ID',
      type: 'int',
    },
    {
      id: 'name',
      label: 'Name',
      type: 'string',
    },
    {
      id: 'maxSpeed',
      label: 'Max Speed',
      type: 'int',
      disableSorting: true,
    },
    {
      id: 'status.code',
      label: 'Status',
      type: 'string',
      render: (record) => {
        return (
          <div>
            <span style={{ color: 'blue' }}>{record.status.code}</span>
          </div>
        )
      },
      csvValue: record => record.status.id,
    },
  ],
}
