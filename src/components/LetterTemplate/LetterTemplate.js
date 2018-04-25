import React, { Component } from 'react'
import { Svg } from 'expo'

import StartPoint from './StartPoint'
import EndPoint from './EndPoint'
import Arrow from './Arrow'

 // TODO fix all this, when iteration while drawing works (if it needs to be fixed Kappa)
export default class LetterTemplate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeSection: props.activeSection,
      path: '',
      strokeWidth: props.strokeWidth,
    }
  }

  /**
   * Builds a SVG Path Object definition out of points defining the letter
   * and stores it in this components state before it mounts
   */
  componentWillMount() {
    const { sections } = this.props

    // iterate through sections
    let path = ''
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]

      // iterate through subsections and build path
      for (let j = 0; j < section.length; j++) {
        const subsection = section[j]
        const p0 = subsection[0]
        const p1 = subsection[1]

        path = path + `M${p0[0]} ${p0[1]} L${p1[0]} ${p1[1]} `
      }
    }

    this.setState({ path })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.strokeWidth !== nextProps.strokeWidth) {
      this.setState({ strokeWidth: nextProps.strokeWidth })
    }
  }

  renderSubsectionArrows = () => {
    return this.state.activeSection.map((subsection, index) => {
      if (index != 0) {
        return <Arrow key={index} p0={subsection[0]} p1={subsection[1]} scale={this.props.scale} />
      }
    })
  }

  render() {
    const { activeSection, path, strokeWidth } = this.state
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
        <StartPoint p0={activeSection[0][0]} p1={activeSection[0][1]} scale={scale} strokeWidth={strokeWidth} />
        {activeSection.length > 1 && this.renderSubsectionArrows()}
        <EndPoint p={activeSection[activeSection.length - 1][1]} scale={scale} strokeWidth={strokeWidth} />
      </Svg.G>
    )
  }
}