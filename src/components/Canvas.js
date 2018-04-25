import React, { Component } from 'react'
import { View, StyleSheet, PanResponder, Animated } from 'react-native'
import { Svg } from 'expo'

import Maths from '../util/Maths'
import LetterTemplate from './LetterTemplate/LetterTemplate'

export default class Canvas extends Component {
  constructor(props) {
    super(props)

    this.state = {
      points: [],         // stores coordinates of finger position, inspired by rn-draw
      strokes: [],        // stores lines drawn between points, inspired by rn-draw
      activeSection: 0,
      activeSubsection: 0,
      tolerance: props.tolerance,
      distanceFromSubStart: null,         // used to validate direction
      errors: {
        TooFarFromStart: 0,
        TooFarFromLine: 0,
        WrongDirection: 0,
        TooFarFromEnd: 0,
        ReleasedAfterError: true,
      },
      blob: {
        show: false,
        pos: []
      },
    }
  }

  /**
   * setting up React Native PanResponder to track finger movement on screen
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
   * This method is triggered, when the user touches the screen. It checks if
   * the finger position on screen is close enough to the active sections start point.
   */
  onResponderGrant = e => {
    const { activeSection, points, tolerance, errors } = this.state
    const fingerPos = [e.nativeEvent.locationX, e.nativeEvent.locationY]

    const start = Maths.mult(this.props.letterDef[activeSection][0][0], this.props.scale)
    const d = Maths.distance(fingerPos, start)

    if (d > tolerance) {
      // TODO animate StartPoint with react-native.Animated
      this.setState({ errors: { ...errors, TooFarFromStart: 1 } })
    } else {
      this.setState({ points: [...points, fingerPos], errors: { ...errors, TooFarFromStart: 0 } })
    }
  }

  onResponderMove = e => {
    const { errors } =  this.state

    // if user didn't find start before or didn't release
    // screen after an error while moving occurred, don't go on
    if (errors.TooFarFromStart > 0 || !errors.ReleasedAfterError) return

    const { points, tolerance } = this.state
    const activeSection = this.props.letterDef[this.state.activeSection]
    const activeSubsection = activeSection[this.state.activeSubsection]
    const { scale } = this.props
    const fingerPos = [e.nativeEvent.locationX, e.nativeEvent.locationY]

    // validate distance to activeSubsection, TestCase: Lines Only
    const p0 = Maths.mult(activeSubsection[0], scale)
    const p1 = Maths.mult(activeSubsection[1], scale)
    const nearestPoint = Maths.nearestPointOnLine(fingerPos, p0, p1)
    const d1 = Maths.distance(fingerPos, nearestPoint)

    if (d1 > tolerance) {
      // TODO show blob on fingerPos - this.setState({ blob: { show: true, pos: fingerPos }})
      const tooFar = errors.TooFarFromLine + 1
      this.setState({ errors: { ...errors, TooFarFromLine: tooFar, ReleasedAfterError: false } }, () => {
        if (tooFar >= 3) {
          if (this.props.tolerance === tolerance) {
            this.setState({ tolerance: tolerance + 15 })  // TODO make it look smoothly with animation
          }
        }
      })
      return
    }

    // TODO THIS IS NOT WORKING PROPERLY WHEN SWITCHING SUBSECTIONS!!!!
    // validate if finger is moving in right direction
    // const oldD = this.state.distanceFromSubStart
    // const start = Maths.mult(activeSubsection[0], scale)
    // const d2 = Maths.distance(fingerPos, start)
    //
    // if (oldD && d2 < oldD) {
    //   const wd = errors.WrongDirection + 1
    //   this.setState({ errors: { ...errors, WrongDirection: wd, ReleasedAfterError: false } }, () => {
    //     if (wd >= 3) {
    //       // TODO animate startpoint and/or highlight arrow by changing color (and changing color back)
    //     }
    //   })
    //   return
    // }
    // this.setState({ distanceFromSubStart: d2 })

    // validate if finger is hitting end point of subsection, if so switch to next subsection
    const end = Maths.mult(activeSubsection[1], scale)
    const d3 = Maths.distance(fingerPos, end)

    if (d3 <= tolerance) {
      if (this.state.activeSubsection < activeSection.length - 1) {
        this.setState({ activeSubsection: this.state.activeSubsection + 1, distanceFromSubStart: null })
      }
    }

    this.setState({ points: [...points, fingerPos] })

    // TODO think about deleting points and strokes immediately
  }

  onResponderRelease = (e, gestureState) => {
    const { errors } = this.state
    this.setState({ distanceFromSubStart: null, activeSubsection: 0 })

    if (errors.TooFarFromStart > 0) return
    if (!errors.ReleasedAfterError) {
      this.setState({
        errors: {
          ...errors,
          ReleasedAfterError: true
        },
        points: [],
        strokes: []
      })
      return
    }

    const { points, tolerance} = this.state
    const activeSection = this.props.letterDef[this.state.activeSection]
    const fingerPos = [e.nativeEvent.locationX, e.nativeEvent.locationY]

    const end = Maths.mult(activeSection[activeSection.length - 1][1], this.props.scale)
    const d = Maths.distance(fingerPos, end)
    if (d > tolerance) {
      // TODO animate EndPoint
      this.setState({ points: [], strokes: [] })
    } else {
      this.setState({ points: [...points, fingerPos], activeSection: this.state.activeSection + 1 })
    }
  }

  /**
   * Creates a SVG Path string definition out of points
   *
   * @param {Array.<number[]>} - coordinates where screen was touched
   * @returns {String} definition for SVG Path
   */
  convertToPath = points => {
    if (!points.length) return ''

    // create path for a circle, if only one point is stored
    if (points.length === 1) {
      return `M${points[0][0] - 5} ${points[0][1]} a5 5 0 1,0 10,0 a5 5 0 1,0 -10,0`
    }

    // create full path
    return points.map((value, index) => {
      if (index === 0) return `M${points[0][0]} ${points[0][1]}`

      return `L${value[0]} ${value[1]}`
    }).join(' ')
  }

  render() {
    const { strokes, points, activeSection, tolerance, blob } = this.state
    const { letterDef, scale, strokeColor } = this.props
    // console.log(this.state)

    return (
      <View {...this.panResponder.panHandlers} style={styles.svgContainer}>
        <Svg style={styles.container}>
          <LetterTemplate
            sections={letterDef}
            activeSection={letterDef[activeSection]}
            strokeWidth={tolerance}
            scale={scale}
          />
          <Svg.G>
            {strokes}
              <Svg.Path
                d={this.convertToPath(points)}
                stroke={strokeColor}
                strokeWidth={20}
                strokeLinecap='round'
                strokeLinejoin='round'
                fill='none'
              />

            {/*{blob.show &&*/}
              {/*<Svg.Image*/}
                {/*x={blob.pos[0] + 50}*/}
                {/*y={blob.pos[1] + 50}*/}
                {/*width={100}*/}
                {/*height={100}*/}
                {/*href={require('../../assets/blob.png')}*/}
              {/*/>*/}
            {/*}*/}
          </Svg.G>
        </Svg>
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
    flex: 1,
  },
})
