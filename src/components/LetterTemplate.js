import React, { Component } from 'react'
import { Svg } from 'expo'

import Maths from '../util/Maths'

/**
 * This component visualizes the letter to be drawn.
 */
export default class LetterTemplate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      path: '',
      strokeWidth: props.strokeWidth,
    }
  }

  /**
   * Triggered before component mounts.
   * Builds a SVG Path Object definition out of points defining the letter
   * and stores it in this components state.
   */
  componentWillMount() {
    const sections = this.props.def

    // iterate through sections
    let path = ''
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]

      // iterate through subsections and build path
      for (let j = 0; j < section.length; j++) {
        const subsection = section[j]
        if (subsection.type === 'LINE') {
          path = path + this.buildLine(subsection)
        }

        if (subsection.type === 'CURVE') {
          path = path + this.buildCurve(subsection)
        }
      }
    }

    this.setState({ path })
  }

  /**
   * Triggered when component receives new props.
   * Determines if strokeWidth has changes and if so stores new strokeWidth in state
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.strokeWidth !== nextProps.strokeWidth) {
      this.setState({ strokeWidth: nextProps.strokeWidth })
    }
  }

  buildLine = subsection => {
    let path = ''

    const p0 = subsection.def[0]
    const p1 = subsection.def[1]

    return path + `M${p0[0]} ${p0[1]} L${p1[0]} ${p1[1]} `
  }

  buildCurve = subsection => {
    const { xt, yt, tMin, tMax } = subsection.def
    const points = Maths.funcToPoints(xt, yt, tMin, tMax)

    let path = 'M' + points[0][0] + ' ' + points[0][1]

    for (let i = 1; i < points.length; i++) {
      path = path + 'L' + points[i][0] + ' ' + points[i][1]
    }

    return path
  }

  render() {
    const { path, strokeWidth } = this.state
    const { scale } = this.props

    return (
      <Svg.G>
        <Svg.Path
          d={path}
          stroke='#ffffff'
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
          scale={scale}
        />
      </Svg.G>
    )
  }
}
