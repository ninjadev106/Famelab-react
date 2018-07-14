/* @flow */

import React, { Component } from 'react';
import { View,
         Image,
         TextInput,
         TouchableOpacity,
         Text,
         Dimensions } from 'react-native';

var {height, width} = Dimensions.get('window');

type Props = {
  onCreateComment: (text: string) => void;
};

export default class CommentInput extends Component {

  props: Props;

  state = {
    text: ''
  }

  render() {
    return (
      <View style={styles.container}>
        <Image resizeMode='contain' style={styles.image} source = {require('../images/comment-o.png')} />
        <TextInput
          autoFocus
          style={styles.input}
          keyboardType="email-address"
          placeholder ="Add a comment..."
          value={this.state.text}
          onChangeText={text => this.setState({ text })}
        />
        <TouchableOpacity onPress={() => this.props.onCreateComment(this.state.text)}>
          <Text style={{color:'#FD1E79', fontSize:14, margin:5, fontWeight:'600'}}>Post</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  container: {
    flexDirection: 'row',
    height: 50,
    width: width - 10,
    alignItems:'center'
  },
  image: {
    width: 20,
    margin: 15
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
    width: 100,
    fontSize: 16,
    alignItems: 'center'
  }
}
