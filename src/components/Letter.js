import React, { Component } from 'react'
import { G, Path } from 'react-native-svg'

import letters from '../logic/letters'

// TODO Visualize Sections with numbers and arrows
export default class Letter extends Component {
  constructor(props) {
    super(props)

    const sections = letters[props.name]

    this.state = {
      name: props.name,
      sections,
      level: 1,
      section: sections[0],
      path: this.buildPath(sections),
      strokeWidth: 24, // 1. Level 24, 2. Level 16 or 12 (that's for visualization only)
    }
  }

  buildPath = sections => {

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
    return path
  }

  // it doesn't matter with what you build it to show it, internally you just have to know the points
  // this might be more difficult for arcs, you might
  render() {
    const { strokeWidth } = this.state
    // console.log(this.state)
    return (
      <G>
        <Path
          d={this.state.path}
          stroke='#ffffff'
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
        />
      </G>
    )
  }
}