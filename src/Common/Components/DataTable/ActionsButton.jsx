import MoreVertIcon from '@mui/icons-material/MoreVert'
import PropTypes from 'prop-types'
import { useContext, useState } from 'react'

import { AdapterContext } from './AdapterProvider'

const ActionsButton = ({ actions, onAction }) => {
  const { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } = useContext(AdapterContext)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
        {actions.map((action) => (
          <MenuItem
            key={action.id}
            onClick={(evt) => {
              handleClose()
              onAction(action, evt)
            }}
          >
            {action.icon && <ListItemIcon style={{ minWidth: '40px' }}>{action.icon}</ListItemIcon>}
            <ListItemText>{action.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

ActionsButton.propTypes = {
  onAction: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
    }),
  ),
}

export default ActionsButton
