import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'

import ColorPicker from './ColorPicker/ColorPicker'
import LevelOne from './LevelOne'

/**
 * This component functions as a container for letter drawing related elements and functionalities.
 * For now it holds the ColorPicker and LevelOne components and manages the data flow.
 */
export default class LetterScreen extends Component {
  constructor() {
    super()
    this.state = {
      color: '#fbb03b'
    }
  }

  /**
   * Store color received by the ColorPicker in state so it can be passed down to LevelOne.
   */
  handleColorUpdate = color => {
    this.setState({ color })
  }

  render() {
    return (
      <View style={styles.container}>
        <ColorPicker updateColor={this.handleColorUpdate}/>
        <LevelOne letter='a_big' strokeColor={this.state.color}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  }
})
