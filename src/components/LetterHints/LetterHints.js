import React, { Component } from 'react'
import { Svg } from 'expo'

import StartPoint from './StartPoint'
import EndPoint from './EndPoint'
import Arrow from './Arrow'
import Maths from '../../util/Maths'

/**
 * This component defines a container to show visualized letter hints like start point, direction change and endpoint
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

  componentWillMount() {
    const activeSection = this.props.sections[this.props.activeSection]
    const start = this.extractStart(activeSection)
    const end = this.extractEnd(activeSection)
    const arrowPoints = this.extractArrowPoints(activeSection)

    this.setState({
      start,
      end,
      arrowPoints
    })
  }

  componentWillReceiveProps(nextProps) {
    const newActiveSection = nextProps.sections[nextProps.activeSection]

    const newStart = this.extractStart(newActiveSection)
    const oldStart = this.state.start
    if (!Maths.equals(oldStart.p0, newStart.p0) || !Maths.equals(oldStart.p1, newStart.p1)) {
      this.setState({
        start: newStart
      })
    }

    const newEnd = this.extractEnd(newActiveSection)
    const oldEnd = this.state.end
    if (!Maths.equals(oldEnd, newEnd)) {
      this.setState({
        end: newEnd
      })
    }

    const newArrowPoints = this.extractArrowPoints(newActiveSection)
    const oldArrowPoints = this.state.arrowPoints
    let equalCount = 0

    for (let i = 0; i < newArrowPoints.length; i++) {
      if (Maths.equals(newArrowPoints[i].p0, oldArrowPoints[i].p0) && Maths.equals(newArrowPoints[i].p1, oldArrowPoints[i].p1)) {
        equalCount++
      }
    }

    if (equalCount !== newArrowPoints.length) {
      this.setState({
        arrowPoints: newArrowPoints
      })
    }
  }

  extractStart = section => {
    const subsection = section[0]

    if (subsection.type === 'LINE') {
      return { p0: subsection.def[0], p1: subsection.def[1] }
    }

    if (subsection.type === 'CURVE') {
      console.log('curve')
      const { xt, yt, tMin, tMax } = subsection.def
      const points = Maths.funcToPoints(xt, yt, tMin, tMax)

      return { p0: points[0], p1: points[1] }
    }

    return []
  }

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
    const { sections, scale, strokeWidth } = this.props
    const { start, end } = this.state
    const activeSection = sections[this.props.activeSection]

    return (
      <Svg.G>
        <StartPoint p0={start.p0} p1={start.p1} scale={scale} strokeWidth={strokeWidth} />
        {activeSection.length > 1 && this.renderSubsectionArrows()}
        <EndPoint p={end} scale={scale} strokeWidth={strokeWidth} />
      </Svg.G>
    )
  }
}
