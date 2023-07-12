import PropTypes from 'prop-types'

export const CampaignType = PropTypes.shape({})

export default {
  primaryKey: 'id', // can be also be a comma separated list of fields
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
      id: 'html_text',
      label: 'HTML text',
      type: 'html',
    },
    {
      id: 'insertion_datetime',
      label: 'Insertion',
      type: 'datetime',
    },
    {
      id: 'last_dispatch',
      label: 'Last dispatch',
      type: 'datetime',
    },
    {
      id: 'last_edit_datetime',
      label: 'Last edit',
      type: 'datetime',
    },
    {
      id: 'last_not_test_dispatch',
      label: 'Last dispatch (no test)',
      type: 'datetime',
    },
    {
      id: 'name',
      label: 'Name',
      type: 'string',
    },
    {
      id: 'plain_text',
      label: 'Plain text',
      type: 'string',
    },
    {
      id: 'subject',
      label: 'Subject',
      type: 'string',
    },
    {
      id: 'template',
      label: 'Template',
      type: 'int',
    },
    {
      id: 'topic',
      label: 'Topic',
      type: 'string',
    },
    {
      id: 'url',
      label: 'URL',
      type: 'string',
    },
    {
      id: 'view_online',
      label: 'View online',
      type: 'boolean',
    }
  ],
}
