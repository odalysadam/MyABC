import React, { Component } from 'react'
import { Svg } from 'expo'
import PropTypes from 'prop-types'

/**
 * This component display an arrow pointing to the selected color
 */
export default class ColorPointer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      style: {
        flex: 1,
        height: 125,
        opacity: props.show ? 1 : 0
      }
    }
  }

  /**
   * React Lifecycle Method. Triggered when props change.
   * Makes the arrow visible by setting opacity to 1.
   *
   * @param {Object} nextProps - Object of props this component is about
   * to receive
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.show !== this.props.show) {
      const opacity = nextProps.show ? 1 : 0
      this.setState({ style: { ...this.state.style, opacity }})
    }
  }

  render() {
    return (
     <Svg style={this.state.style}>
        <Svg.Path
          d='M100,50 q-40,-15 -80,10 l7.5,-20 m-7.5,20 l20,5'
          stroke='#736357'
          strokeWidth={10}
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
          transform={this.props.transform || {}}
        />
      </Svg>
    )
  }
}

ColorPointer.propTypes = {

  /** Boolean value to determine if the pointer should be visible */
  show: PropTypes.bool.isRequired,

  /** Object with transformations */
  transform: PropTypes.object
}
