import React, { Component } from 'react'
import { Svg } from 'expo'

export default class EndPoint extends Component {
  render() {
    const { p, scale, strokeWidth } = this.props

    return (
      <Svg.G>
        <Svg.Path
          d={`M${p[0] - 6} ${p[1]} a6 6 0 1,0 12,0 a6 6 0 1,0 -12,0`}
          stroke='#ccc914'
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
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