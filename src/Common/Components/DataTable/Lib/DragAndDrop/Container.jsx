import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { smoothDnD as container } from 'smooth-dnd'
import { dropHandlers } from 'smooth-dnd'

container.dropHandler = dropHandlers.reactDropHandler().handler
container.wrapChild = false

class Container extends Component {
  constructor(props) {
    super(props)

    this.prevContainer = null
    this.container = null
    this.containerRef = React.createRef()

    this.getContainerOptions = this.getContainerOptions.bind(this)
    this.getContainer = this.getContainer.bind(this)
    this.isObjectTypePropsChanged = this.isObjectTypePropsChanged.bind(this)
  }

  componentDidMount() {
    this.prevContainer = this.getContainer()
    this.container = container(this.getContainer(), this.getContainerOptions())
  }

  componentWillUnmount() {
    this.container.dispose()
    this.container = null
  }

  componentDidUpdate(prevProps) {
    if (this.getContainer()) {
      if (this.prevContainer && this.prevContainer !== this.getContainer()) {
        this.container.dispose()
        this.container = container(
          this.getContainer(),
          this.getContainerOptions(),
        )
        this.prevContainer = this.getContainer()
        return
      }

      if (this.isObjectTypePropsChanged(prevProps)) {
        this.container.setOptions(this.getContainerOptions())
      }
    }
  }

  isObjectTypePropsChanged(prevProps) {
    // eslint-disable-next-line no-unused-vars
    const { render, children, style, ...containerOptions } = this.props

    for (const _key in containerOptions) {
      const key = _key
      // eslint-disable-next-line no-prototype-builtins
      if (containerOptions.hasOwnProperty(key)) {
        const prop = containerOptions[key]

        if (typeof prop !== 'function' && prop !== prevProps[key]) {
          return true
        }
      }
    }

    return false
  }

  render() {
    if (this.props.render) {
      return this.props.render(this.containerRef)
    } else {
      return (
        <div style={this.props.style} ref={this.containerRef}>
          {this.props.children}
        </div>
      )
    }
  }

  getContainer() {
    return this.containerRef.current
  }

  getContainerOptions() {
    return Object.keys(this.props).reduce((result, key) => {
      const optionName = key
      const prop = this.props[optionName]

      if (typeof prop === 'function') {
        result[optionName] = (...params) => {
          return this.props[optionName](...params)
        }
      } else {
        result[optionName] = prop
      }

      return result
    }, {})
  }
}

Container.defaultProps = {
  behaviour: 'move',
  orientation: 'vertical',
}

Container.propTypes = {
  behaviour: PropTypes.oneOf(['move', 'copy', 'drop-zone', 'contain']),
  groupName: PropTypes.string,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  style: PropTypes.object,
  dragHandleSelector: PropTypes.string,
  nonDragAreaSelector: PropTypes.string,
  dragBeginDelay: PropTypes.number,
  animationDuration: PropTypes.number,
  autoScrollEnabled: PropTypes.bool,
  lockAxis: PropTypes.string,
  dragClass: PropTypes.string,
  dropClass: PropTypes.string,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDrop: PropTypes.func,
  getChildPayload: PropTypes.func,
  shouldAnimateDrop: PropTypes.func,
  shouldAcceptDrop: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragLeave: PropTypes.func,
  render: PropTypes.func,
  getGhostParent: PropTypes.func,
  removeOnDropOut: PropTypes.bool,
  dropPlaceholder: PropTypes.oneOfType([
    PropTypes.shape({
      className: PropTypes.string,
      animationDuration: PropTypes.number,
      showOnTop: PropTypes.bool,
    }),
    PropTypes.bool,
  ]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default Container
