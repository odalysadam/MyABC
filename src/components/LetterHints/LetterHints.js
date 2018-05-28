import React, { Component } from 'react'
import { Svg } from 'expo'
import PropTypes from 'prop-types'

import StartPoint from './StartPoint'
import EndPoint from './EndPoint'
import Arrow from './Arrow'
import Maths from '../../util/Maths'

/**
 * This component defines a container to show visualized letter hints like start point,
 * arrows for direction change and end point.
 */
export default class LetterHints extends Component {
  constructor() {
    super()

    this.state = {
      start: {
        p0: [],
        p1: []
      },
      end: [],
      arrowPoints: []
    }
  }

  /**
   * React Lifecycle Method. Triggered before component mounts.
   * Setting up necessary data for letter hints.
   */
  componentWillMount() {
    const activeSection = this.props.sections[this.props.activeSection]
    const start = this.extractStartData(activeSection)
    const end = this.extractEnd(activeSection)

    this.setState({
      start,
      end
    })

    if (activeSection.length > 1) {
      this.setState({
        arrowPoints: this.extractArrowPoints(activeSection)
      })
    }
  }

  /**
   * React Lifecycle Method. Triggered when props change
   * Updates data for letter hints, if it has changed.
   *
   * @param {Object} nextProps - Object of props this component is about to receive
   */
  componentWillReceiveProps(nextProps) {
    const newActiveSection = nextProps.sections[nextProps.activeSection]

    // check if position of start point has changed
    const oldStart = this.state.start
    const newStart = this.extractStartData(newActiveSection)
    if (!Maths.equals(oldStart.p0, newStart.p0) || !Maths.equals(oldStart.p1, newStart.p1)) {
      this.setState({
        start: newStart
      })
    }

    // check if position of end point has changed
    const oldEnd = this.state.end
    const newEnd = this.extractEnd(newActiveSection)
    if (!Maths.equals(oldEnd, newEnd)) {
      this.setState({
        end: newEnd
      })
    }

    // reset arrowPoints, if there's only one subsection
    if (newActiveSection.length < 2 && this.state.arrowPoints.length > 0) {
      this.setState({
        arrowPoints: []
      })
      return
    }

    // check if a position for arrows have changed
    const oldArrowPoints = this.state.arrowPoints
    const newArrowPoints = this.extractArrowPoints(newActiveSection)

    if (oldArrowPoints.length === 0) {
      this.setState({
        arrowPoints: newArrowPoints
      })
    } else {

      let notEqualCount = 0
      for (let i = 0; i < newArrowPoints.length; i++) {
        if (!Maths.equals(newArrowPoints[i].p0, oldArrowPoints[i].p0) || !Maths.equals(newArrowPoints[i].p1, oldArrowPoints[i].p1)) {
          notEqualCount++
        }
      }

      if (notEqualCount > 0) {
        this.setState({
          arrowPoints: newArrowPoints
        })
      }
    }

  }

  /**
   * Extracts points needed to display StartPoint out of the active section.
   *
   * @param {Object[]} section - Arrow of objects describing subsections
   * @returns {Object} Object with two points p0, p1 or an empty object
   */
  extractStartData = section => {
    const subsection = section[0]

    if (subsection.type === 'LINE') {
      return { p0: subsection.def[0], p1: subsection.def[1] }
    }

    if (subsection.type === 'CURVE') {
      const { xt, yt, tMin, tMax } = subsection.def
      const points = Maths.funcToPoints(xt, yt, tMin, tMax)

      return { p0: points[0], p1: points[1] }
    }

    return {}
  }

  /**
   * Extracts the last point out of the active section.
   *
   * @param {Object[]} section - Arrow of objects describing subsections
   * @returns {number[]} Array representing a two-dimensional point
   */
  extractEnd = section => {
    const subsection = section[section.length - 1]

    if (subsection.type === 'LINE') {
      return subsection.def[1]
    }

    if (subsection.type === 'CURVE') {
      const { xt, yt, tMin, tMax } = subsection.def
      const points = Maths.funcToPoints(xt, yt, tMin, tMax)

      return points[points.length - 1]
    }

    return []
  }

  /**
   * Extracts points needed to display arrows to show change in direction
   * out of the active section.
   *
   * @param {Object[]} section - Arrow of objects describing subsections
   * @returns {Object[]} Array of objects with points for arrows
   */
  extractArrowPoints = section => {
    const arrowPoints = []

    for (let i = 1; i < section.length; i++) {
      const subsection = section[i]

      if (subsection.type === 'LINE') {
        arrowPoints.push({ p0: subsection.def[0], p1: subsection.def[1] })
      }

      if (subsection.type === 'CURVE') {
        const { xt, yt, tMin, tMax } = subsection.def
        const points = Maths.funcToPoints(xt, yt, tMin, tMax)

        arrowPoints.push({ p0: points[0], p1: points[Math.floor(points.length / 10)] })
      }
    }

    return arrowPoints
  }

  /**
   * Determines if a section has more than one subsection and creates
   * an Arrow element for each subsection after the first one.
   *
   * @returns {Array.<JSX>} an Arrow element for each subsection or direction change
   */
  renderSubsectionArrows = () => {
    const { arrowPoints } = this.state

    return arrowPoints.map((points, index) => {
      return (
        <Arrow
          key={index}
          p0={points.p0}
          p1={points.p1}
          scale={this.props.scale}
        />
      )
    })
  }

  render() {
    const { scale, strokeWidth } = this.props
    const { start, end, arrowPoints } = this.state

    return (
      <Svg.G>
        <StartPoint p0={start.p0} p1={start.p1} scale={scale} strokeWidth={strokeWidth} />
        {arrowPoints.length && this.renderSubsectionArrows()}
        <EndPoint p={end} scale={scale} strokeWidth={strokeWidth} />
      </Svg.G>
    )
  }
}

LetterHints.propTypes = {

  /** Letter definition */
  sections: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,

  /** Index of active section */
  activeSection: PropTypes.number.isRequired,

  /** Stroke width of LetterTemplate */
  strokeWidth: PropTypes.number.isRequired,

  /** Number to scale the arrow */
  scale: PropTypes.number.isRequired,
}
