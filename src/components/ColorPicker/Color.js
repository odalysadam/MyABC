import React, { Component } from 'react'
import { TouchableHighlight, Image } from 'react-native'

export default class Color extends Component {
  constructor() {
    super()

    this.state = {
      source: '',
      colorCode: ''
    }
  }

  componentWillMount() {
    switch (this.props.color) {
      case 'red':
        this.setState({
          source: require('../../../assets/color_splashes/red.png'),
          colorCode: '#ed1c24'
        })
        break
      case 'green':
        this.setState({
          source: require('../../../assets/color_splashes/green.png'),
          colorCode: '#39b54a'
        })
        break
      case 'orange':
        this.setState({
          source: require('../../../assets/color_splashes/orange.png'),
          colorCode: '#fbb03b'
        })
        break
      case 'blue':
        this.setState({
          source: require('../../../assets/color_splashes/blue.png'),
          colorCode: '#29abe2'
        })
        break
      case 'pink':
        this.setState({
          source: require('../../../assets/color_splashes/pink.png'),
          colorCode: '#b00088'
        })
        break
      default:
        this.setState({
          source: '../../../assets/orange.png',
          colorCode: '#fbb03b'
        })
    }
  }

  onPress = () => {
    this.props.setColor(this.state.colorCode)
  }

  render() {
    return (
      <TouchableHighlight
        style={this.props.style || {}}
        onPress={this.onPress}
        underlayColor='transparent'
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
