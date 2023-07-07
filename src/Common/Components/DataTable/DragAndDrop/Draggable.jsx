import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { constants } from 'smooth-dnd'
const {
	wrapperClass
} = constants

class Draggable extends Component {
	render() {
		if (this.props.render) {
			return React.cloneElement(this.props.render(), { className: wrapperClass });
		}
		
		const clsName = `${this.props.className ? (this.props.className + ' ') : ''}`
		return (
			<div {...this.props} className={`${clsName}${wrapperClass}`} >
				{this.props.children}
			</div>
		)
	}
}

Draggable.propTypes = {
  render: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}

export default Draggable;
