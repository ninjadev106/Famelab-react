/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  WebView,
  Text,
  View
} from 'react-native';

export default class SideBar extends Component {
  render() {
    return (
      <WebView
        source={{uri: 'https://api.instagram.com/oauth/authorize/?client_id=b10c9cc0510e49b4806d33904e67ac5c&redirect_uri=http://famelab.com&response_type=code'}}
        style={{marginTop: 20}}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

