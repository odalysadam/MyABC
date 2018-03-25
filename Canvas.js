import React, { Component } from 'react'
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native'
import { Svg, G, Path } from 'react-native-svg'

export default class Canvas extends Component {
  constructor() {
    super()

    this.state = {
      points: [],
      strokes: [],
      section: 0
    }
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => this.onResponderGrant(e, gestureState),
      onPanResponderMove: (e, gestureState) => this.onResponderMove(e, gestureState),
      onPanResponderRelease: (e, gestureState) => this.onResponderRelease(e, gestureState)
    })
  }

  // check if point is close enough to the entry point of a letter
  onResponderGrant = (e, gestureState) => {
    this.setState({ points: [...this.state.points, [e.nativeEvent.locationX, e.nativeEvent.locationY]] })
  }

  // check if points are close enough to letter
  onResponderMove = (e, gestureState) => {
    this.setState({ points: [...this.state.points, [e.nativeEvent.locationX, e.nativeEvent.locationY]] })
  }

  // draw
  onResponderRelease = (e, gestureState) => {
    const { points, strokes, section } = this.state
    if (!points.length) return

    const stroke = (
      <Path
        key={section}
        d={this.convertToPath(points)}
        stroke='#000000'
        strokeWidth={8}
        fill='none'
      />
    )

    this.setState({
      strokes: [...strokes, stroke],
      points: [],
      section: section + 1
    })
  }

  convertToPath = points => {
    if (!points.length) return ''
    return points.map((value, index) => {
      if (index === 0) {
        return `M${points[0][0]} ${points[0][1]}`
      }
      return `L${value[0]} ${value[1]}`
    }).join(' ')
  }

  render() {
    const { strokes, points, section } = this.state

    return (
      <View style={styles.container}>
        <View {...this.panResponder.panHandlers} style={styles.svgContainer}>
          <Svg style={styles.container}>
            <G>
              {strokes}   // to remember and keep old strokes
              <Path       // to draw directly
                key={section}
                d={this.convertToPath(points)}
                stroke='#000000'
                strokeWidth={8}
                fill='none'
              />
            </G>
          </Svg>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2474a6'
  },
  svgContainer: {
    flex: 1
  },
})
