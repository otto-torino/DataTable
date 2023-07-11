import PropTypes from 'prop-types'
import { range } from 'ramda'
import { useContext } from 'react'

import { AdapterContext } from './AdapterProvider'

const Loader = ({ minHeight, size, skeleton, justifyStart, color, text, display, style, skeletonHeight }) => {
  const { CircularProgress, LoaderWrapper, Skeleton } = useContext(AdapterContext)
  return (
    <LoaderWrapper minHeight={minHeight} justifyStart={justifyStart} display={display} style={style}>
      {skeleton && (
        <div style={{ width: '100%' }}>
          {range(0, skeleton).map((idx) => (
            <Skeleton animation="pulse" key={idx} height={skeletonHeight} style={{ transform: 'scale(1,0.8)' }} />
          ))}
        </div>
      )}
      {!skeleton && <CircularProgress color={color} size={size}></CircularProgress>}
      {text && <p>{text}</p>}
    </LoaderWrapper>
  )
}

Loader.defaultProps = {
  minHeight: '0',
  size: 40,
  skeleton: false,
  skeletonHeight: 45,
  justifyStart: false,
  color: 'primary',
  display: 'flex',
  style: {},
}

Loader.propTypes = {
  minHeight: PropTypes.string,
  size: PropTypes.number,
  skeleton: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  skeletonHeight: PropTypes.number,
  justifyStart: PropTypes.bool,
  color: PropTypes.string,
  text: PropTypes.string,
  display: PropTypes.string,
  style: PropTypes.object,
}

export default Loader
