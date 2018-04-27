import React, { Component } from 'react'
import { Svg } from 'expo'

import StartPoint from './StartPoint'
import EndPoint from './EndPoint'
import Arrow from './Arrow'

/**
 * This component defines a container to show visualized letter hints like start point, direction change and endpoint
 */
export default class LetterHints extends Component {

  /**
   * Determines if a section has more than one subsection and creates
   * an Arrow element for each subsection after the first one.
   *
   * @returns {Array.<JSX>} an Arrow element for each subsection or direction change
   */
  renderSubsectionArrows = () => {
    const activeSection = this.props.sections[this.props.activeSection]
    return activeSection.map((subsection, index) => {
      if (index != 0) {
        return <Arrow key={index} p0={subsection[0]} p1={subsection[1]} scale={this.props.scale} />
      }
    })
  }

  render() {
    const { sections, scale, strokeWidth } = this.props
    const activeSection = sections[this.props.activeSection]

    return (
      <Svg.G>
        <StartPoint p0={activeSection[0][0]} p1={activeSection[0][1]} scale={scale} strokeWidth={strokeWidth} />
        {activeSection.length > 1 && this.renderSubsectionArrows()}
        <EndPoint p={activeSection[activeSection.length - 1][1]} scale={scale} strokeWidth={strokeWidth} />
      </Svg.G>
    )
  }
}
