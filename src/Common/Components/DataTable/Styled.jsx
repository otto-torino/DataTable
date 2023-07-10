import {
  TableContainer as MuiTableContainer,
  Table as MuiTable,
  TableHead as MuiTableHead,
  TableBody as MuiTableBody,
  TableRow as MuiTableRow,
  TableCell as MuiTableCell,
  TableSortLabel as MuiTableSortLabel,
  TablePagination,
  CircularProgress as MuiCircularProgress,
  Skeleton as MuiSkeleton,
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  Button as MuiButton,
  IconButton as MuiIconButton,
  TextField,
  Checkbox as MuiCheckbox,
  Select,
  MenuItem as MuiMenuItem,
  FormControl as MuiFormControl,
  InputLabel as MuiInputLabel,
  Typography,
  Tooltip,
  Alert,
  Menu,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  Collapse,
} from '@mui/material'
import styled from 'styled-components'

// utils
export const Box = styled.div`
  ${({ theme, background }) =>
    background && theme
      ? `background: ${theme.palette[background]?.main}; color: ${theme.palette[background]?.contrastText};`
      : ''}
  align-items: ${(props) => props.align || 'flex-start'};
  display: flex;
  flex-direction: ${(props) => props.direction || 'column'};
  flex-grow: ${(props) => props.grow || 0};
  flex-wrap: ${(props) => (props.wrap ? 'wrap' : 'nowrap')};
  gap: ${(props) => (props.gap ? props.gap : 'auto')};
  height: ${(props) => props.height || 'auto'};
  justify-content: ${(props) => props.justify || 'flex-start'};
  margin: ${(props) => props.margin || '0'};
  padding: ${(props) => props.padding || '0'};
  position: ${(props) => props.position || 'static'};
  width: ${(props) => props.width || 'auto'};
`

// generics
export { Typography, Collapse }

// table
export const TableContainer = styled(MuiTableContainer)`
  max-width: 100%;
  overflow: auto;
`
export const Table = styled(MuiTable)`
  th {
    position: relative;
  }

  &.resizable-active > thead th,
  &.resizable-active > tbody td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.resizable-active > thead th span {
    position: static;
  }

  &.resizable-active > thead th.th-col-name span {
    display: block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.resizable-active > thead th.th-col-name svg {
    position: absolute;
    right: 0;
    top: 17px;
    background: inherit !important;
    margin-left: 0;
    padding-right: 4px;
    margin-right: 0;
    padding-left: 4px;
  }

  .resizer {
      border-right: 2px solid ${({ theme }) => theme.palette.dataTableResizableHandle.main};
      height: 50%;
      position: absolute;
      top: 25%;
      right: 0;
      width: 5px;
      cursor: col-resize;
      user-select: none;
  }

  .resizer:hover,
  .resizing {
      border-right: 2px solid #A32427;
  }
`
export const TableHead = styled(MuiTableHead)``
export const TableBody = styled(MuiTableBody)``
export const TableRow = styled(MuiTableRow)`
  &:hover {
    td {
      background: ${({ theme }) => theme.palette.dataTableRowHover.main} !important;
    }
  }
`
export const TableCell = styled(MuiTableCell)`
  width: ${({ checkbox }) => (checkbox ? '20px' : 'auto')};
  max-width: ${({ checkbox }) => (checkbox ? '20px' : 'auto')};
`
export const TableSortLabel = styled(MuiTableSortLabel)``
export { TablePagination }
export const PageInput = styled.input`
  border: 1px solid ${({ theme }) => theme.palette.dataTableContrastLight.main};
  background: ${({ theme, warning }) => (warning ? theme.palette.dataTableWarning.main : theme.palette.dataTableContrastLight.main)};
  color: ${({ theme }) => theme.palette.dataTableContent.contrastText};
  margin: 0 2rem 0 0.5rem;
  padding: 0.5rem;
  max-width: 40px;

  &:focus {
    border: 1px solid
      ${({ theme, warning }) =>
        warning
          ? theme.palette.dataTableError.main
          : theme.palette.dataTableContrastLight.main};
    outline: 0;
  }
`
export const PageLabel = styled.label`
  font-size: 0.9rem;
  line-height: 1.43;
`

// button
export const Button = styled(MuiButton)``
export const IconButton = styled(MuiIconButton)``

// dialog
export const Dialog = styled(MuiDialog)``
export const DialogTitle = styled(MuiDialogTitle)``
export const DialogContent = styled(MuiDialogContent)``
export const DialogActions = styled(MuiDialogActions)``

// lists
export { ListItemIcon, ListItemText }

// alert
export { Alert }

// form
export const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-top: 1rem;
`
export const FormControl = styled(MuiFormControl)``
export const InputLabel = styled(MuiInputLabel)``
export const Checkbox = styled(MuiCheckbox)``
export const MenuItem = styled(MuiMenuItem)``
export { Menu, Select, InputAdornment, TextField }

// loader
export const LoaderWrapper = styled.div`
  align-items: center;
  display: ${({ display }) => display};
  flex-direction: column;
  justify-content: center;
  min-height: ${(props) => props.minHeight};
`
export const CircularProgress = styled(MuiCircularProgress)``
export const Skeleton = styled(MuiSkeleton)``

// toolbar
export const ToolbarContainer = styled.div`
  background: ${({ theme }) => theme.palette.dataTableToolbar.main};
  color: ${({ theme }) => theme.palette.dataTableToolbar.contrastText};
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const ToolbarSelection = styled(Box)``
export const SelectAll = styled(Typography)`
  border-left: 1px solid #eee;
  margin-left: 1rem !important;
  padding-left: 1rem;
`
export const SelectAllLink = styled.button`
  cursor: pointer;
`
export const ToolbarActions = styled(Box)``

// settings
export const DraggableRow = styled(Box)`
  border: 1px solid ${({ theme }) => theme.palette.dataTableContrastLight.main};
  border-top-width: ${({ first }) => first ? 1 : 0}px;
  padding-right: .5rem;
`

// tooltip
export { Tooltip }
