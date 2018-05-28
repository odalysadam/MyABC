import React, { Component } from 'react'
import { Svg } from 'expo'

/**
 * This component displays a big yellow star.
 * Values generated with:
 * http://www.smiffysplace.com/stars.html, 27.05.2018
 */
export default class RewardStar extends Component {
  render() {
    return (
      <Svg.Path
        d='
          M 180.000 275.000
          L 268.168 321.353
          L 251.329 223.176
          L 322.658 153.647
          L 224.084 139.324
          L 180.000 50.000
          L 135.916 139.324
          L 37.342 153.647
          L 108.671 223.176
          L 91.832 321.353
          L 180.000 275.000
        '
        stroke='#fecc53'
        strokeWidth={1}
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='#fecc53'
        scale={this.props.scale}
      />
    )
  }
}
