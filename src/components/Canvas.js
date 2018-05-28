import React, { Component } from 'react'
import { View, StyleSheet, PanResponder, Button } from 'react-native'
import { Svg } from 'expo'
import PropTypes from 'prop-types'

import Maths from '../util/Maths'
import LetterTemplate from './LetterTemplate'
import LetterHints from './LetterHints/LetterHints'
import RewardStar from './RewardStar'

export default class Canvas extends Component {
  constructor(props) {
    super(props)
    this.initialState = {
      points: [],               // stores coordinates of finger position, inspired by rn-draw
      validStrokes: [],         // stores lines drawn in a section, inspired by rn-draw
      activeSection: 0,
      activeSubsection: 0,
      tolerance: props.tolerance,
      distanceFromSubStart: null,   // used to validate direction
      errors: {
        tooFarFromLine: 0,
        wrongDirection: 0,
        releasedAfterError: true,
      },
      blob: {
        show: false,
        pos: [],
        source: this.getColorBlob()
      },
      finished: false
    }

    this.state = Object.assign({}, this.initialState)
  }

  /**
   * React Lifecycle Method. Triggered before component mounts.
   * Setting up React Native PanResponder to track finger movement on screen.
   */
  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => this.onResponderGrant(e, gestureState),
      onPanResponderMove: (e, gestureState) => this.onResponderMove(e, gestureState),
      onPanResponderRelease: (e, gestureState) => this.onResponderRelease(e, gestureState)
    })
  }

  /**
   * React Lifecycle Method. Triggered when props change.
   * Adjusts the color of the blob related to change of stroke color
   *
   * @param {Object} nextProps - Contains all props
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.strokeColor !== nextProps.strokeColor) {
      this.setState({ blob: { ...this.state.blob, source: this.getColorBlob(nextProps.strokeColor) } })
    }
  }

  /**
   * Triggered, when the user touches the screen.
   * Checks if finger position on screen is close enough to start point of the active sections.
   *
   * @param {Object} e - synthetic touch event nativeEvent by React Native
   * @param {Object} gs - gestureState by React Native
   */
  onResponderGrant = (e, gs) => {

    // there's only one finger allowed
    if (gs.numberActiveTouches > 1) return

    const { activeSection, points, tolerance } = this.state
    const { letterDef, scale } = this.props
    const fingerPos = [e.nativeEvent.locationX, e.nativeEvent.locationY]
    const startSection = letterDef[activeSection][0]

    let start = null
    if (startSection.type === 'LINE') {
      start = Maths.mult(startSection.def[0], scale)
    }
    if (startSection.type === 'CURVE') {
      const { xt, yt, tMin, tMax } = startSection.def
      const curvePoints = Maths.funcToPoints(xt, yt, tMin, tMax)
      start = Maths.mult(curvePoints[0], scale)
    }

    const d = Maths.distance(fingerPos, start)
    if (d > tolerance) {
      // StartPoint would be animated here
      this.setState({ errors: { releasedAfterError: false } })
      return
    }
    this.setState({ points: [...points, fingerPos] })
  }

  /**
   * Triggered, when the user moves over screen.
   * Checks the following things:
   * - if distance between finger and letter is within tolerance
   * - if finger is moving in right direction
   * - if finger hits end point of subsection
   * Switches to next subsection if all three check out.
   *
   * @param {Object} e - synthetic touch event nativeEvent by React Native
   * @param {Object} gs - gestureState by React Native
   */
  onResponderMove = (e, gs) => {

    // there's only one finger allowed
    if (gs.numberActiveTouches > 1) return

    // don't go on when errors occurred before
    const { errors } = this.state
    if (!errors.releasedAfterError) return

    const { points, tolerance } = this.state
    const { letterDef, scale } = this.props

    const activeSection = letterDef[this.state.activeSection]
    const activeSubsection = activeSection[this.state.activeSubsection]
    const fingerPos = [e.nativeEvent.locationX, e.nativeEvent.locationY]

    // validate distance to activeSubsection
    const distanceApproved = this.validateDistanceOnMove(fingerPos, activeSubsection)

    if (!distanceApproved) {
      const tooFar = errors.tooFarFromLine + 1

      this.setState({
        errors: { ...errors, tooFarFromLine: tooFar, releasedAfterError: false },
        blob: { show: true, pos: fingerPos, source: this.state.blob.source }
      }, () => {
        if (tooFar >= 3) {
          if (this.props.tolerance === tolerance) {
            this.setState({ tolerance: tolerance + 15 })
          }
        }
        setTimeout(() => {
          this.setState({ points: [], blob: { show: false, pos: [], source: this.state.blob.source } })
        }, 1000)
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
    let end = []
    if (activeSubsection.type === 'LINE') {
      end = Maths.mult(activeSubsection.def[1], scale)
    }
    if (activeSubsection.type === 'CURVE') {
      const { xt, yt, tMin, tMax } = activeSubsection.def
      const points = Maths.funcToPoints(xt, yt, tMin, tMax)
      end = Maths.mult(points[points.length - 1], scale)
    }

    const d = Maths.distance(fingerPos, end)
    if (d <= tolerance) {
      if (this.state.activeSubsection < activeSection.length - 1) {
        this.setState({ activeSubsection: this.state.activeSubsection + 1, distanceFromSubStart: null })
      }
    }

    this.setState({ points: [...points, fingerPos] })
  }

  onResponderRelease = e => {
    const { errors } = this.state
    this.setState({ distanceFromSubStart: null, activeSubsection: 0 })

    if (!errors.releasedAfterError) {
      this.setState({ errors: { ...errors, releasedAfterError: true } })
      return
    }

    const { activeSection, points, tolerance} = this.state
    const { letterDef, scale } = this.props
    const fingerPos = [e.nativeEvent.locationX, e.nativeEvent.locationY]
    const section = letterDef[activeSection]
    const endSection = section[section.length - 1]

    let end = null
    if (endSection.type === 'LINE') {
      end = Maths.mult(endSection.def[1], scale)
    }
    if (endSection.type === 'CURVE') {
      const { xt, yt, tMin, tMax } = endSection.def
      const curvePoints = Maths.funcToPoints(xt, yt, tMin, tMax)
      end = Maths.mult(curvePoints[curvePoints.length - 1], scale)
    }

    const d = Maths.distance(fingerPos, end)
    if (d > tolerance) {
      // EndPoint would be animated here
      this.setState({ points: [] })
    } else {

      if (activeSection < letterDef.length - 1) {
        const validStroke = (
          <Svg.Path
            key={activeSection}
            d={this.convertToPath(points)}
            stroke={this.props.strokeColor}
            strokeWidth={20}
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
          />
        )

        this.setState({
          points: [],
          validStrokes: [...this.state.validStrokes, validStroke],
          activeSection: activeSection + 1
        })
      } else {
        this.setState({ finished: true })
        setTimeout(() => {
          this.setState(this.initialState)
        }, 1500)
      }
    }
  }

  validateDistanceOnMove = (fingerPos, subsection) => {
    let points = []
    if (subsection.type === 'LINE') {
      points.push(subsection.def[0])
      points.push(subsection.def[1])
    }

    if (subsection.type === 'CURVE') {
      const { xt, yt, tMin, tMax } = subsection.def
      points = Array.from(Maths.funcToPoints(xt, yt, tMin, tMax))
    }

    for (let i = 1; i < points.length; i++) {
      const p0 = Maths.mult(points[i - 1], this.props.scale)
      const p1 = Maths.mult(points[i], this.props.scale)

      const nearestPoint = Maths.nearestPointOnLine(fingerPos, p0, p1)
      if (!nearestPoint) {
        continue
      }

      const d = Maths.distance(fingerPos, nearestPoint)
      if (d > this.state.tolerance) {
        continue
      }

      return true
    }
    return false
  }

  /**
   * Sets correct image of color blob according to stroke color
   *
   * @param {string} color - stroke color
   */
  getColorBlob = color => {
    switch (color) {
      case '#ed1c24':
        return require('../../assets/color_blobs/red_blob.png')
      case '#39b54a':
        return require('../../assets/color_blobs/green_blob.png')
      case '#fbb03b':
        return require('../../assets/color_blobs/orange_blob.png')
      case '#29abe2':
        return require('../../assets/color_blobs/blue_blob.png')
      case '#b00088':
        return require('../../assets/color_blobs/pink_blob.png')
      default:
        return require('../../assets/color_blobs/orange_blob.png')
    }
  }

  /**
   * Creates a SVG Path string definition out of points.
   * Used to visualize finger movement.
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
    const { validStrokes, points, activeSection, tolerance, blob, finished } = this.state
    const { letterDef, scale, strokeColor } = this.props

    return (
      <View {...this.panResponder.panHandlers} style={styles.svgContainer}>
        <Svg style={styles.container}>
          <LetterTemplate
            def={letterDef}
            strokeWidth={tolerance}
            scale={scale}
          />
          {validStrokes}
          <LetterHints
            sections={letterDef}
            activeSection={activeSection}
            strokeWidth={tolerance}
            scale={scale}
          />
          <Svg.Path
            d={this.convertToPath(points)}
            stroke={strokeColor}
            strokeWidth={20}
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
          />
          {blob.show &&
            <Svg.Image
              x={blob.pos[0] - 50}
              y={-blob.pos[1] + 50}
              width='100'
              height='100'
              href={blob.source}
            />
          }
          {finished && <RewardStar scale={scale}/>}
        </Svg>
        <Button title='Reset' onPress={() => this.setState(this.initialState)}/>
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

Canvas.propTypes = {

  /** Letter definition */
  letterDef: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,

  /** Number to scale the arrow */
  scale: PropTypes.number.isRequired,

  /** Highest tolerated distance between finger and template */
  tolerance: PropTypes.number.isRequired,

  /** Color of the stroke */
  strokeColor: PropTypes.string.isRequired,
}
