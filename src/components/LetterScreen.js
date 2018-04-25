import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'

import ColorPicker from './ColorPicker/ColorPicker'
import LevelOne from './LevelOne'

export default class LetterScreen extends Component {
  constructor() {
    super()
    this.state = {
      color: '#fbb03b'
    }
  }

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
