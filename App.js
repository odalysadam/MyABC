import React from 'react'
import { StyleSheet } from 'react-native'
import Canvas from './src/components/Canvas'

export default class App extends React.Component {
  render() {
    return (
      <Canvas />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
