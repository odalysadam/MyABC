import React, { Component } from 'react'
import { Svg } from 'expo'
import PropTypes from 'prop-types'

import Maths from '../../util/Maths'

/**
 * This component defines an arrow showing the direction change of a section.
 * It's positioned at the start of each following subsection after the first one.
 */
export default class Arrow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      angle: 0
    }
  }

  /**
   * React Lifecycle Method. Triggered before component mounts.
   * Sets the rotation angle so it points in the direction the finger should move.
   */
  componentWillMount() {
    const { p0, p1 } = this.props
    const d = Maths.sub(p1, p0)
    const a = Maths.calcAngleBetweenVectors(d, [1, 0])
    const angle = d[1] > 0 ? a : -a
    this.setState({ angle })
  }

  /**
   * React Lifecycle Method. Triggered when props change
   * Sets new rotation angles, if lines and their direction have changed.
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

    return (
      <Svg.G scale={scale}>
        <Svg.Path
          d={`M${p0[0]} ${p0[1]} l30 0 l-10 -7.5 m10 7.5 l-10 7.5`}
          stroke='#ccc914'
          strokeWidth={3}
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
          transform={{ rotation: this.state.angle, originX: p0[0], originY: p0[1] }}
        />
      </Svg.G>
    )
  }
}

Arrow.propTypes = {

  /** First point of subsection */
  p0: PropTypes.arrayOf(PropTypes.number).isRequired,

  /** Second point of subsection */
  p1: PropTypes.arrayOf(PropTypes.number).isRequired,

  /** Number to scale the arrow */
  scale: PropTypes.number.isRequired
}
