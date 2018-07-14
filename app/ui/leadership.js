
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  Image,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux';
import Promise from 'bluebird';

import line from '../images/underline.png'
var {height, width} = Dimensions.get('window');
var ScrollableTabView = require('react-native-scrollable-tab-view');
import AllTime from './widgets/allTime'
import Today from './widgets/today'
import Nav from './widgets/nav'
import ThisMonth from './widgets/thisMonth'
import { getLeaderboardData } from '../reducers/selectors';


var position1 = -width/3 - 5
var position2 = 0
var position3 = width/3

class Leadership extends Component {
  constructor(props){
    super(props)
    this.state = {
      term: 'all',
      today: styles.activeTitle,
      thisMonth: styles.subTitles,
      allTime: styles.subTitles,
      active: position3
    }
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.term !== prevState.term) {
      this.loadData();
    }
  }

  loadData() {
    Promise.resolve()
      .then(() => this.props.actions.loadLeaderboardData(this.state.term));
  }

  currentMonth(){
    return(<View></View>)
  }
  allTime(){
    return(<View></View>)
  }

  render() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    return (
        <View style={styles.container}>
          <Nav {...this.props} name="leaderboard" />
        <View style={{flex:1}}>
        <View style={{flex:2, flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
          <TouchableOpacity onPress = {() => this.setState({ active:position1, term: 'today' })}>
          <Text style ={this.state.today}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress = {() => this.setState({ active: position2, term: 'month' })}>
            <Text style ={this.state.thisMonth}>ThisMonth</Text>
            </TouchableOpacity>
          <TouchableOpacity onPress = {() => this.setState({ active: position3, term: 'all' })}>
          <Text style ={this.state.allTime}>AllTime</Text>
          </TouchableOpacity>
        </View>
        <Image source = {line} resizeMode = "contain" style={{width:40, left:this.state.active, marginTop:-10, marginBottom:10, alignSelf:'center'}} />
        </View>
        <View style={{flex:9}}>
          <Today data={this.props.data} />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: getLeaderboardData(state)
  };
}

export default connect(mapStateToProps)(Leadership);

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  subTitles:{
    color:'#979797',
    fontSize:13,
    fontWeight:'400'
  },
  activeTitle:{
    color:'#333',
    borderBottomWidth:5,
    borderColor:'#333'
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
