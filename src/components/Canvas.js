import React, { Component } from 'react'
import { View, StyleSheet, PanResponder, Button, Text } from 'react-native'
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
      oldFingerPos: [],   // used to validate direction
      errors: {
        tooFarFromLine: 0,
        wrongDirection: 0,
        releasedAfterError: true
      },
      blob: {
        show: false,
        pos: [],
        source: this.getColorBlob(props.color)
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
   * Checks, if finger position on screen is close enough to start point of the active sections.
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
      this.setState({ errors: { ...this.state.errors, releasedAfterError: false } })
      return
    }
    this.setState({ points: [...points, fingerPos], oldFingerPos: fingerPos, errors: { ...this.state.errors } })
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

    const { points, tolerance, activeSection, activeSubsection } = this.state
    const { letterDef, scale } = this.props

    const subsection = letterDef[activeSection][activeSubsection]
    const fingerPos = [e.nativeEvent.locationX, e.nativeEvent.locationY]

    // validate distance and direction
    const { oldFingerPos } = this.state
    const error = this.validateFingerMovement(oldFingerPos, fingerPos, subsection)
    if (error) {
      const count = errors[error] + 1
      this.setState({
        errors: { ...errors, [error]: count, releasedAfterError: false },
        blob: { show: true, pos: fingerPos, source: this.state.blob.source }
      }, () => {
        if (error === 'tooFarFromLine' && count >= 3) {
          if (this.props.tolerance === tolerance) {
            this.setState({ tolerance: tolerance + 15 })
          }
        }
        if (error === 'wrongDirection' && count >= 3) {
          // all letter hints would be shown and animated in order here
        }
        setTimeout(() => {
          this.setState({
            points: [],
            oldFingerPos: [],
            blob: { ...this.state.blob, show: false, pos: []}
          })
        }, 1000)
      })
      return
    }
    this.setState({ oldFingerPos: fingerPos })

    // validate if finger is hitting end point of subsection, if so switch to next subsection
    let end = []
    if (subsection.type === 'LINE') {
      end = Maths.mult(subsection.def[1], scale)
    }
    if (subsection.type === 'CURVE') {
      const { xt, yt, tMin, tMax } = subsection.def
      const points = Maths.funcToPoints(xt, yt, tMin, tMax)
      end = Maths.mult(points[points.length - 1], scale)
    }

    this.setState({ points: [...points, fingerPos] })

    const d = Maths.distance(fingerPos, end)
    if (d <= tolerance) {
      if (activeSubsection < letterDef[activeSection].length - 1) {
        this.setState({
          activeSubsection: activeSubsection + 1,
        })
      }
    }
  }

  /**
   * Triggered when finger is removed from screen.
   * If all subsections were finished, it checks if finger position is
   * within tolerated distance of the end point of the active section.
   * If it is within tolerated distance, a new path is created out of points
   * and stored in validStrokes. This ensures that strokes of a finished sections
   * aren't removed when an error happens.
   */
  onResponderRelease = e => {
    const { activeSection, activeSubsection  } = this.state
    const { letterDef } = this.props
    const section = letterDef[activeSection]

    let errors = null
    if (activeSubsection === section.length - 1 && this.state.errors.releasedAfterError) {
      const { points, tolerance} = this.state
      const { scale } = this.props

      const fingerPos = [e.nativeEvent.locationX, e.nativeEvent.locationY]
      const lastSubsection = section[section.length - 1]

      let end = null
      if (lastSubsection.type === 'LINE') {
        end = Maths.mult(lastSubsection.def[1], scale)
      }
      if (lastSubsection.type === 'CURVE') {
        const {xt, yt, tMin, tMax} = lastSubsection.def
        const curvePoints = Maths.funcToPoints(xt, yt, tMin, tMax)
        end = Maths.mult(curvePoints[curvePoints.length - 1], scale)
      }

      const d = Maths.distance(fingerPos, end)
      if (d > tolerance) {
        // EndPoint would be animated here
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

          errors = this.initialState.errors
          this.setState({
            validStrokes: [...this.state.validStrokes, validStroke],
            activeSection: activeSection + 1
          })
        } else {
          this.finishAndReset()
        }
      }
    }

    this.setState({
      points: [],
      oldFingerPos: [],
      activeSubsection: 0,
      errors: errors || {...this.state.errors, releasedAfterError: true }
    })
  }

  /**
   * Validates the distance of finger on screen to line(s) of given subsection.
   *
   * @param {number[]} oldFingerPos - Last position [x, y] of finger on screen
   * @param {number[]} fingerPos - Current position [x, y] of finger on screen
   * @param {Object} subsection - Definition of subsection
   * @returns {string|null} true, if distance is within tolerance
   */
  validateFingerMovement = (oldFingerPos, fingerPos, subsection) => {
    const moveDirection = Maths.sub(fingerPos, oldFingerPos)
    let points = []

    if (subsection.type === 'LINE') {
      points.push(subsection.def[0])
      points.push(subsection.def[1])
    }

    if (subsection.type === 'CURVE') {
      const { xt, yt, tMin, tMax } = subsection.def
      points = Array.from(Maths.funcToPoints(xt, yt, tMin, tMax))
    }

    let error = null
    for (let i = 1; i < points.length; i++) {
      const p0 = Maths.mult(points[i - 1], this.props.scale)
      const p1 = Maths.mult(points[i], this.props.scale)

      const nearestPoint = Maths.nearestPointOnLine(fingerPos, p0, p1)
      if (!nearestPoint) {
        error = 'tooFarFromLine'
        continue
      }

      const d = Maths.distance(fingerPos, nearestPoint)
      if (d > this.state.tolerance) {
        error = 'tooFarFromLine'
        continue
      }

      const posDistance = Maths.distance(oldFingerPos, fingerPos)
      if (posDistance > 10) {
        const subsectionDirection = Maths.sub(points[i], points[i-1])
        const angle = Maths.calcAngleBetweenVectors(moveDirection, subsectionDirection)
        if (angle > 90) {
          error = 'wrongDirection'
          continue
        }
      }

      return null
    }
    return error
  }

  /**
   * Sets correct image of color blob according to stroke color
   *
   * @param {string} [color] - stroke color
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
   * @param {Array.<number[]>} points - coordinates where screen was touched
   * @returns {String} definition for SVG Path
   */
  convertToPath = points => {
    if (!points.length) return ''

    // create path for a circle, if only one point is stored
    if (points.length === 1) {
      return `M${points[0][0] - 5} ${points[0][1]} a3 3 0 1,0 6,0 a3 3 0 1,0 -6,0`
    }

    // create full path
    return points.map((value, index) => {
      if (index === 0) {
        return `M${points[0][0]} ${points[0][1]}`
      }

      return `L${value[0]} ${value[1]}`
    }).join(' ')
  }

  /**
   * Displays an overview over errors that might have happened.
   * Substitute for animations.
   */
  showErrors = () => {
    const { errors } = this.state
    return (
      <View style={styles.textContainer}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>Error Overview</Text>
        <Text>Too Far From Line Counter: {errors.tooFarFromLine}</Text>
        <Text>Going Wrong Direction Counter: {errors.wrongDirection}</Text>
      </View>
    )
  }

  /**
   * Sets finished to true after 1s, so the RewardStar will be shown.
   * Then resets the level to its initial state after 1.5s
   */
  finishAndReset = () => {
    setTimeout(() => {
      this.setState({ finished: true })
      setTimeout(() => {
        this.initialState.blob.source = this.getColorBlob(this.props.strokeColor)
        this.setState(this.initialState)
      }, 1500)
    }, 1000)
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
        {this.showErrors()}
        <Button title='Reset' onPress={() => {
          this.initialState.blob.source = this.getColorBlob(this.props.strokeColor)
          this.setState(this.initialState)
        }}/>
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
  textContainer: {
    flex: 1,
    position: 'absolute',
    right: 10,
    top: 20,
  }
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
