import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'

import Color from './Color'

export default class ColorPicker extends Component {
  updateColor = color => {
    this.props.updateColor(color)
  }

  render() {
    return (
      <View style={styles.container}>
        <Color color='red' setColor={this.updateColor} />
        <Color color='green' setColor={this.updateColor} style={{ alignSelf: 'flex-end'}} />
        <Color color='blue' setColor={this.updateColor} />
        <Color color='orange' setColor={this.updateColor} style={{ alignSelf: 'flex-end'}} />
        <Color color='pink' setColor={this.updateColor} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    borderRightWidth: 5,
    borderRightColor: '#736357',
    backgroundColor: '#c7b299',
    justifyContent: 'center',
    alignItems: 'flex-start'
  }
})