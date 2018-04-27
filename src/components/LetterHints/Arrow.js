import React, { Component } from 'react'
import { Svg } from 'expo'

import Maths from '../../util/Maths'

/**
 * This component defines an arrow showing the direction change of a section.
 */
export default class Arrow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      angle: 0
    }
  }

  /**
   * Triggered before component mounts.
   * Sets the rotation angle.
   */
  componentWillMount() {
    const { p0, p1 } = this.props
    this.setState({ angle: Maths.calcRotationAngle(p0, p1) })
  }

  /**
   * Triggered when component receives new props after mounting.
   * Sets new rotation angle, if lines and their direction have changed.
   */
  componentWillReceiveProps(nextProps) {
    const { p0, p1 } = nextProps
    const d1 = Maths.sub(this.props.p1, this.props.p0)
    const d2 = Maths.sub(p1, p0)

    if (Maths.equals(p0, this.props.p0) && Maths.equals(p1, this.props.p1) && Maths.equals(d1, d2)) {
      return
    }
    this.setState({ angle: Maths.calcRotationAngle(p0, p1) })
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
