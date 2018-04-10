import React, { Component } from 'react'
import { View, StyleSheet, PanResponder } from 'react-native'
import { Svg } from 'expo'
const { G, Path, Circle, Text } = Svg
// import { Svg, G, Path, Circle, Text } from 'react-native-svg'

import Maths from '../util/Maths'
import letters from '../logic/letters'
import Letter from './Letter'

export default class Canvas extends Component {
  constructor() {
    super()

    this.state = {
      points: [],         // stores coordinates of finger position, inspired by rn-draw
      strokes: [],        // stores lines drawn between points, inspired by rn-draw
      shouldDraw: false,  // determines if finger movement should be drawn to the screen
      // level: 0,           // active Level
      // section: 0,         // active section of letter
      // letter: letters['a_big'], // TODO think of better way to connect these components
      // tolerance: 15, // tolerated distance
      // errors: {
      //   notFindingStart: 0,
      //   notHittingLetter: 0,
      //   drawingBackwards: 0,
      //   didNotFinishSection: 0
      // }
    }
  }

  /**
   * setting up React Native PanResponder to track finger movement on screen, inspired by rn-draw
   */
  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => this.onResponderGrant(e, gestureState),
      onPanResponderMove: (e, gestureState) => this.onResponderMove(e, gestureState),
      onPanResponderRelease: (e, gestureState) => this.onResponderRelease(e, gestureState)
    })
  }

  /**
   * This method is triggered, when the user touches the screen.
   * It checks if the distance from starting point of active section to finger position is within the tolerated area.
   * If distance is within tolerated area, it stores the finger position for drawing and resets the associated error count.
   * Otherwise it increments the error count until the error occurred three times. When the error occurred three times the count
   * will be reset and the starting point will be hinted.
   */
  onResponderGrant = (e, gestureState) => {
    // const { points, tolerance, errors } = this.state
    // const fingerPos = [e.nativeEvent.locationX, e.nativeEvent.locationY]
    // const d = this.distanceToStart(fingerPos)
    // console.log(d)
    //
    // // check if finger position is inside of tolerated distance of starting point
    // if (d > tolerance) {
    //   let errorCount = errors.notFindingStart
    //   errorCount++
    //   console.log(errorCount)
    //
    //   if (errorCount >= 3) {
    //     // TODO highlight starting point
    //     // this.setState({ shouldDraw: false, errors: { notFindingStart: errorCount}})
    //   }
    //
    //   this.setState({ shouldDraw: false, errors: { notFindingStart: errorCount }})
    // } else {
    //   this.setState({ points: [...points, fingerPos], shouldDraw: true, errors: { notFindingStart: 0 }})
    // }

  }

  // check if points are close enough to letter and if direction is correct
  onResponderMove = (e, gestureState) => {
    // const { shouldDraw, points, tolerance, errors } = this.state
    //
    // // don't do anything if an error occurred before
    // if (!shouldDraw) {
    //   return
    // }
    //
    // const fingerPos = [e.nativeEvent.locationX, e.nativeEvent.locationY]
    // const d = this.distanceToLine(fingerPos)
    // console.log(fingerPos, d)
    //
    // // check if finger position is inside of tolerated distance
    // if (d > tolerance) {
    //   let errorCount = errors.notHittingLetter
    //   errorCount++
    //   console.log(errorCount)
    //
    //   if (errorCount >= 3) {
    //     // TODO tolerance += 5|10|15|20
    //     // this.setState({ shouldDraw: false, errors: { notFindingStart: errorCount}})
    //   }
    //
    //   this.setState({ shouldDraw: false, errors: { notHittingLetter: errorCount }})
    // } else {
    //   this.setState({ points: [...points, fingerPos], shouldDraw: true, errors: { notHittingLetter: 0 }})
    // }
  }

  // draw
  onResponderRelease = (e, gestureState) => {
    // const { points, strokes, section } = this.state
    //
    // // console.log(points)
    // if (!points.length) return
    //
    // let stroke
    //
    // // draw a circle if user has just touched screen without moving
    // if(points.length === 1) {
    //   stroke = (
    //     <Circle key={section} cx={points[0][0]} cy={points[0][1]} r='10' fill='#000000' /> // TODO adjust size
    //   )
    // } else {
    //   stroke = (
    //     <Path
    //       key={section}
    //       d={this.convertToPath(points)}
    //       stroke='#000000'
    //       strokeWidth={12}
    //       strokeLinecap='round'
    //       strokeLinejoin='round'
    //       fill='none'
    //     />
    //   )
    // }

    // this.setState({
    //   strokes: [...strokes, stroke],
    //   points: [],
    //   section: section + 1 // only update this when a subsection or section successfully ended
    // })
  }

  /**
   * Creates a SVG Path out of points
   */
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
    const { shouldDraw, strokes, points, section, errors } = this.state
    // console.log(this.state)

    return (
      <View style={styles.container}>
        <View {...this.panResponder.panHandlers} style={styles.svgContainer}>
          <Svg style={styles.container}>
            <Letter name='a_big' />
            <G>
              {strokes}
              {shouldDraw &&
                <Path
                  key={section}
                  d={this.convertToPath(points)}
                  stroke='#000000'
                  strokeWidth={12}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  fill='none'
                />
              }
            </G>
            <Text x='50' y='450'>{errors.notFindingStart} {errors.notHittingLetter}</Text>
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
