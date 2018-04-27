import React, { Component } from 'react'
import { Svg } from 'expo'

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

  /**
   * Triggered when component receives new props.
   * Determines if strokeWidth has changes and if so stores new strokeWidth in state
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.strokeWidth !== nextProps.strokeWidth) {
      this.setState({ strokeWidth: nextProps.strokeWidth })
    }
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
