import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import Color from './Color'
import ColorPointer from './ColorPointer'

/**
 * This component defines a container for all pickable colors for the stroke.
 */
export default class ColorPicker extends Component {
  constructor() {
    super()
    this.state = {
      showRedPointer: false,
      showGreenPointer: false,
      showBluePointer: false,
      showOrangePointer: true,
      showPinkPointer: false
    }
  }

  /**
   * Called when the user taps on a color blob.
   * Sends hex code of picked color received by child component back
   * to LetterScreen.
   *
   * @param {string} color - Color code in hex
   */
  updateColor = color => {
    this.props.updateColor(color)
  }

  /**
   * Called when the user taps on a color blob.
   * Stores in state to which color should be pointed
   *
   * @param {string} color - Name of the color
   */
  highlightActiveColor = color => {
    this.setState({
      showRedPointer: false,
      showGreenPointer: false,
      showBluePointer: false,
      showOrangePointer: false,
      showPinkPointer: false
    })

    switch (color) {
      case 'red':
        this.setState({ showRedPointer: true })
        break
      case 'green':
        this.setState({ showGreenPointer: true })
        break
      case 'blue':
        this.setState({ showBluePointer: true })
        break
      case 'orange':
        this.setState({ showOrangePointer: true })
        break
      case 'pink':
        this.setState({ showPinkPointer: true })
        break
      default:
        this.setState({ showOrangePointer: true })
    }
  }

  render() {
    const transform = { scaleX: '-1', scaleY: '1', translateX: '150' }

    return (
      <View style={styles.container}>

        {/* Red Color Blob */}
        <View style={styles.row}>
          <Color
            color='red'
            setColor={this.updateColor}
            showPointer={this.highlightActiveColor}
          />
          <ColorPointer
            show={this.state.showRedPointer}
          />
        </View>

        {/* Green Color Blob */}
        <View style={[styles.row, styles.row_right]}>
          <ColorPointer
            transform={transform}
            show={this.state.showGreenPointer}
          />
          <Color
            color='green'
            setColor={this.updateColor}
            showPointer={this.highlightActiveColor}
          />
        </View>

        {/* Blue Color Blob */}
        <View style={styles.row}>
          <Color
            color='blue'
            setColor={this.updateColor}
            showPointer={this.highlightActiveColor}
          />
          <ColorPointer
            show={this.state.showBluePointer}
          />
        </View>

        {/* Orange Color Blob */}
        <View style={[styles.row, styles.row_right]}>
          <ColorPointer
            transform={transform}
            show={this.state.showOrangePointer}
          />
          <Color
            color='orange'
            setColor={this.updateColor}
            showPointer={this.highlightActiveColor}
          />
        </View>

        {/* Pink Color Blob */}
        <View style={styles.row}>
          <Color
            color='pink'
            setColor={this.updateColor}
            showPointer={this.highlightActiveColor}
          />
          <ColorPointer
            show={this.state.showPinkPointer}
          />
        </View>
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
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  row_right: {
    justifyContent: 'flex-end'
  }
})

ColorPicker.propTypes = {

  /** Function for passing color code of selected color back to parent */
  updateColor: PropTypes.func.isRequired
}