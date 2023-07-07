import PropTypes from 'prop-types'

export const VehicleType = PropTypes.shape({})

export default {
  primaryKey: 'id', // can be also a list of keys
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
      disableSorting: true,
    },
    {
      id: 'maxSpeed',
      label: 'Max Speed',
      type: 'int',
    },
    {
      id: 'status',
      label: 'Status',
      type: 'string',
      render: (record) => {
        return (
          <div>
            <span style={{ color: 'blue' }}>{record.status}</span>
          </div>
        )
      },
      sortingValue: record => record.status,
      csvValue: record => 'cippa'
    },
  ],
}
