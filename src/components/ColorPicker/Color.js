import React, { Component } from 'react'
import { TouchableHighlight, Image } from 'react-native'
import PropTypes from 'prop-types'

/**
 * This component defines a Button displayed as a color splash to change the stroke color.
 */
export default class Color extends Component {
  constructor() {
    super()
    this.state = {
      source: '',
      colorCode: ''
    }
  }

  /**
   * React Lifecycle Method. Triggered before component mounts.
   * Stores image source and color code related to given color name in state
   */
  componentWillMount() {
    let source = null
    let colorCode = ''

    switch (this.props.color) {
      case 'red':
        source = require('../../../assets/color_splashes/red.png')
        colorCode = '#ed1c24'
        break
      case 'green':
        source = require('../../../assets/color_splashes/green.png')
        colorCode = '#39b54a'
        break
      case 'orange':
        source = require('../../../assets/color_splashes/orange.png')
        colorCode = '#fbb03b'
        break
      case 'blue':
        source = require('../../../assets/color_splashes/blue.png')
        colorCode = '#29abe2'
        break
      case 'pink':
        source = require('../../../assets/color_splashes/pink.png')
        colorCode = '#b00088'
        break
      default:
        source = require('../../../assets/color_splashes/orange.png')
        colorCode = '#fbb03b'
    }

    this.setState({ source, colorCode })
  }

  /**
   * Passes selected color code back to ColorPicker
   */
  onPress = () => {
    this.props.setColor(this.state.colorCode)
    this.props.showPointer(this.props.color)
  }

  render() {
    return (
      <TouchableHighlight
        style={this.props.style || {}}
        onPress={this.onPress}
        underlayColor='transparent'
        activeOpacity={0.6}
      >
        <Image
          style={{ width: 150, height: 125 }}
          source={this.state.source}
          resizeMode='stretch'
        />
      </TouchableHighlight>
    )
  }
}

Color.propTypes = {

  /** Name of the color*/
  color: PropTypes.string.isRequired,

  /** Function for passing color code of selected color back to parent */
  setColor: PropTypes.func.isRequired,

  /** Function for passing name of selected color back to parent */
  showPointer: PropTypes.func.isRequired
}
