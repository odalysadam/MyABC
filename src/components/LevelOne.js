import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'

import letters from '../logic/letters'
import Canvas from './Canvas'

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
