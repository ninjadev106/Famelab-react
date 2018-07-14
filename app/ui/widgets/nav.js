/* @flow */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux';

import { getFamelabUser } from '../../reducers/selectors';
import type { FamelabUser } from '../../reducers/types';

type State = {};

type Props = {
  name: string;
  user: FamelabUser;
};

class Nav extends Component {

  state: State;
  props: Props;

  render() {
    const { user } = this.props;
    return (
      <View style={styles.container}>
        <View style={{width:65}} />
        <Text style={{fontSize:14, fontWeight:'400', color:'#333'}}>{this.props.name.toUpperCase()}</Text>
        <View style={{width:50, alignItems:'center', flexDirection:'row'}}>
          <Image source ={require('../../images/coins_outline.png')} resizeMode = "contain" style={{height:40, width:20, height:20}} />
          <Text style={{fontSize:13, color:'#FF4A87', margin:5}}>{user && user.points}</Text>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: getFamelabUser(state)
  };
}

export default connect(mapStateToProps)(Nav);

const styles = StyleSheet.create({
  container: {
    height:60,
     shadowColor: "rgba(0,0,0,0.4)",
      shadowOpacity: 0.2,
      shadowRadius: 1,
      shadowOffset: {
        height: 1,
        width: 0
      },
      padding:10,
    alignItems:'center',
    paddingTop:15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent:'space-between'
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
