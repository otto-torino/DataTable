import { createContext } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  Select,
  TextField,
  Tooltip,
  Dialog,
  DialogContent,
  Alert,
  DialogActions,
  CircularProgress,
  LoaderWrapper,
  Skeleton,
  Checkbox,
  DialogTitle,
  DraggableRow,
  FormRow,
  TablePagination,
  PageLabel,
  PageInput,
  ToolbarActions,
  ToolbarSelection,
  ToolbarContainer,
  SelectAll,
  Typography,
} from './Styled'

export const AdapterContext = createContext({
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  Select,
  TextField,
  Tooltip,
  Dialog,
  DialogContent,
  Alert,
  DialogActions,
  CircularProgress,
  LoaderWrapper,
  Skeleton,
  Checkbox,
  DialogTitle,
  DraggableRow,
  FormRow,
  TablePagination,
  PageLabel,
  PageInput,
  ToolbarActions,
  ToolbarSelection,
  ToolbarContainer,
  SelectAll,
  Typography,
})

const AdapterProvider = ({ context, children }) => {
  return (
    <AdapterContext.Provider value={context}>
      {children}
    </AdapterContext.Provider>
  )
}

AdapterProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  context: PropTypes.object.isRequired,
}

export default AdapterProvider
