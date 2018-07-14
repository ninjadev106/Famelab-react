/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  View
} from 'react-native';


var {height, width} = Dimensions.get('window');

import coin from '../../images/coins.png'

export default class Nav extends Component {
  render() {
    return (<View style={{alignItems:'center',shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 1,
      shadowOffset: {
        height: 1,
        width: 0
      }, backgroundColor:'#fff', position:'absolute', left:0, top:this.props.height, width:width, alignSelf:'center'}}>
      <View style={styles.container}>
      <View style={{flex:1}}>
      <Image source = {coin} resizeMode="contain" style={{width:25, height:25, margin:5, marginBottom:30, marginLeft:20}} />
      </View>
      <View style={{flex:9, margin:20}}><Text style={{color:'#3D3D3D', fontSize:14}}>{this.props.message}</Text></View>
      </View>
      <View style={{width:50, margin:5, height:6, borderRadius:10, backgroundColor:'#eee'}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height:120,
    alignItems:'center',
    marginBottom:5,
    paddingTop:15,
    backgroundColor: '#fff',
    flexDirection: 'row',
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
