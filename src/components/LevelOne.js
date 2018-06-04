import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from "prop-types";

import letters from '../logic/letters'
import Canvas from './Canvas'

/**
 * This component holds the data to define the first level and sets up
 * the Canvas.
 */
export default class LevelOne extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Canvas
          letterDef={letters[this.props.letter]}
          scale={1.75}
          tolerance={25}
          strokeColor={this.props.strokeColor}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
  }
})

LevelOne.propTypes = {

  /** Name of the letter */
  letter: PropTypes.string.isRequired,

  /** Color for the stroke in hexadecimal */
  strokeColor: PropTypes.string.isRequired
}