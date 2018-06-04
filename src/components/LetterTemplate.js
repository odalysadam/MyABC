import React, { Component } from 'react'
import { Svg } from 'expo'
import PropTypes from 'prop-types'

import Maths from '../util/Maths'

/**
 * This component visualizes the letter through white lines with rounded edges.
 */
export default class LetterTemplate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      paths: '',
      strokeWidth: props.strokeWidth,
    }
  }

  /**
   * Triggered before component mounts.
   * Builds a SVG Path Object definition out of points defining the letter
   * and stores it in this components state.
   */
  componentWillMount() {
    this.buildLetter(this.props.strokeWidth)
  }

  /**
   * React Lifecycle Method. Triggered when props change.
   * Determines if strokeWidth has changes and if so stores new strokeWidth
   * in state
   *
   * @param {Object} nextProps - Object of props this component is about
   * to receive
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.strokeWidth !== nextProps.strokeWidth) {
      this.buildLetter(nextProps.strokeWidth)
    }
  }

  /**
   * Builds letter out of multiple paths, which can either be a line or a curve.
   * This is done, so that sections where the ends aren't visible aren't drawn
   * with round linecap. Round linecap makes the section look longer, so there
   * was some unexpected behaviour where you got the error tooFarFromLine
   * although it looked like you were hitting the line.
   */
  buildLetter = strokeWidth => {
    const sections = this.props.def

    // iterate through sections
    let paths = []
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]

      // iterate through subsections and build path
      for (let j = 0; j < section.length; j++) {
        const subsection = section[j]
        if (subsection.type === 'LINE') {
          paths.push(this.buildLine(subsection, 'l'+i+'-'+j, strokeWidth))
        }

        if (subsection.type === 'CURVE') {
          paths.push(this.buildCurve(subsection, 'l'+i+'-'+j, strokeWidth))
        }
      }
    }

    this.setState({ paths })
  }

  /**
   * Builds the string definition of a line for the SVG Path Object
   *
   * @param {Object} subsection - Object defining a subsection
   * @param {string} key - Unique key for SVG Path
   * @param {number} strokeWidth - Stroke width for SVG Path
   * @returns {string} String definition for SVG Path
   */
  buildLine = (subsection, key, strokeWidth) => {
    const p0 = subsection.def[0]
    const p1 = subsection.def[1]
    const lineCap = subsection.visibleEnds ? 'round' : 'butt'

    return (
      <Svg.Path
        key={key}
        d={`M${p0[0]} ${p0[1]} L${p1[0]} ${p1[1]}`}
        stroke='#ffffff'
        strokeWidth={strokeWidth}
        strokeLinecap={lineCap}
        strokeLinejoin='round'
        fill='none'
        scale={this.props.scale}
      />
    )
  }

  /**
   * Builds the string definition of a curve for the SVG Path Object
   *
   * @param {Object} subsection - Object defining a subsection
   * @param {string} key - Unique key for SVG Path
   * @param {number} strokeWidth - Stroke width for SVG Path
   * @returns {string} String definition for SVG Path
   */
  buildCurve = (subsection, key, strokeWidth) => {
    const { xt, yt, tMin, tMax } = subsection.def
    const points = Maths.funcToPoints(xt, yt, tMin, tMax)
    const lineCap = subsection.visibleEnds ? 'round' : 'butt'

    let path = `M${points[0][0]} ${points[0][1]}`
    for (let i = 1; i < points.length; i++) {
      path = `${path} L${points[i][0]} ${points[i][1]}`
    }

    return (
      <Svg.Path
        key={key}
        d={path}
        stroke='#ffffff'
        strokeWidth={strokeWidth}
        strokeLinecap={lineCap}
        strokeLinejoin='round'
        fill='none'
        scale={this.props.scale}
      />
    )
  }

  render() {
    return (
      <Svg.G>
        {this.state.paths}
      </Svg.G>
    )
  }
}

LetterTemplate.propTypes = {

  /** Letter definition */
  def: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,

  /** Stroke width of LetterTemplate */
  strokeWidth: PropTypes.number.isRequired,

  /** Number to scale the arrow */
  scale: PropTypes.number.isRequired,
}
