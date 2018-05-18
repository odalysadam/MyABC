import React, { Component } from 'react'
import { Svg } from 'expo'

/**
 * This component visualizes the end point of a section
 */
export default class EndPoint extends Component {
  render() {
    const { p, scale } = this.props
    const r = (this.props.strokeWidth + 10) / 2

    return (
      <Svg.G>
        <Svg.Path
          d={`M${p[0] - r} ${p[1]} a${r} ${r} 0 1,0 ${r * 2},0 a${r} ${r} 0 1,0 -${r * 2},0`}
          stroke='#ccc914'
          strokeWidth={1}
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='#ccc914'
          scale={scale}
        />
        <Svg.Path
          d={`M${p[0] - 8} ${p[1]} l0 -8 l+16 0 l0 +16 l-16 0 z`}
          stroke='#99970f'
          strokeWidth={1}
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='#99970f'
          scale={scale}
        />
      </Svg.G>
    )
  }
}
