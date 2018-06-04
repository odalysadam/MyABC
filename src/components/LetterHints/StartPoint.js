import React, { Component } from 'react'
import { Svg } from 'expo'
import PropTypes from 'prop-types'

import Maths from '../../util/Maths'

/**
 * This component visualizes the start point through a circle with an arrow in it.
 * The arrow initially points to the right. It's rotated to show the direction the finger should move.
 */
export default class StartPoint extends Component {
  constructor(props) {
    super(props)
    this.state = {
      angle: 0
    }
  }

  /**
   * React Lifecycle Method. Triggered before component mounts.
   * Sets the rotation angle to make arrow point in right direction.
   */
  componentWillMount() {
    const { p0, p1 } = this.props
    const d = Maths.sub(p1, p0)
    const a = Maths.calcAngleBetweenVectors(d, [1, 0])
    const angle = d[1] > 0 ? a : -a
    this.setState({ angle })
  }

  /**
   * React Lifecycle Method. Triggered when props change.
   * Sets new rotation angle, if lines and their direction have changed.
   *
   * @param {Object} nextProps - Object of props this component is about to receive
   */
  componentWillReceiveProps(nextProps) {
    const { p0, p1 } = nextProps
    const d1 = Maths.sub(this.props.p1, this.props.p0)
    const d2 = Maths.sub(p1, p0)

    if (!Maths.equals(p0, this.props.p0) || !Maths.equals(p1, this.props.p1) || !Maths.equals(d1, d2)) {
      const d = Maths.sub(p1, p0)
      const a = Maths.calcAngleBetweenVectors(d, [1, 0])
      const angle = d[1] > 0 ? a : -a
      this.setState({ angle })
    }
  }

  render() {
    const { p0, scale } = this.props
    const r = (this.props.strokeWidth + 10) / 2

    return (
      <Svg.G scale={scale}>
        <Svg.Path
          d={`M${p0[0] - r} ${p0[1]} a${r} ${r} 0 1,0 ${r * 2},0 a${r} ${r} 0 1,0 -${r * 2},0`}
          stroke='#ccc914'
          strokeWidth={1}
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='#ccc914'
        />
        <Svg.Path
          d={`M${p0[0] - r / 2} ${p0[1]} l${r} 0 l-10 -7.5 m10 7.5 l-10 7.5`}
          stroke='#99970f'
          strokeWidth={5}
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
          transform={{rotation: this.state.angle, originX: p0[0], originY: p0[1]}}
        />
      </Svg.G>
    )
  }
}

StartPoint.propTypes = {

  /** First point of subsection */
  p0: PropTypes.arrayOf(PropTypes.number).isRequired,

  /** Second point of subsection */
  p1: PropTypes.arrayOf(PropTypes.number).isRequired,

  /** Number to scale the arrow */
  scale: PropTypes.number.isRequired,

  /** Stroke width of LetterTemplate */
  strokeWidth: PropTypes.number.isRequired
}
