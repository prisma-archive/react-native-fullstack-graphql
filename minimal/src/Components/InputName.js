import React, { Component } from 'react'
import { Text, View, TextInput } from 'react-native'

export class InputName extends Component {
  state = {
    name: '',
  }
  render() {
    return (
      <View>
        <TextInput
          style={{ height: 40 }}
          placeholder="Type here"
          onChangeText={(name) => this.setState({ name })}
          onSubmitEditing={() => this.props.onSubmit(this.state.name)}
        />
      </View>
    )
  }
}

export default InputName