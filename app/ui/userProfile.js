/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  StyleSheet,
  LayoutAnimation,
  StatusBar,
  Dimensions,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux';

import background from '../images/coverPic.png'
import levelBack from '../images/levelBack.png'
import progressBarImage from '../images/progressBarImage.png'
import Icon from 'react-native-vector-icons/FontAwesome';
import coin from "../images/coins.png"
import { getFamelabUser } from '../reducers/selectors';

var {height, width} = Dimensions.get('window');
var progressBarWidth = width - 50
class UserProfile extends Component {
  constructor(props){
    super(props)
    this.state = {
      nextLevel: 1000,
      currentXP: 0
    }
  }
  componentDidMount(){

    setTimeout(() => this.setState({currentXP:560}),600)
  }
  myInfo(){
    return(<View></View>)
  }
  myObjectives(){
    return(<View></View>)
  }
  progressBar(){

    return(<View style={{margin:5, marginTop:10, width:progressBarWidth, justifyContent:'center',height:8, backgroundColor:'#eee', borderRadius:5}}>
    <Image source = {progressBarImage} resizeMode='cover' style={{height:6, borderRadius:5, width:(this.state.currentXP/this.state.nextLevel)*progressBarWidth}} />
    </View>)
  }
  render() {
    const { user } = this.props;
    LayoutAnimation.spring();
    return (
      <View style={styles.container}>
      <StatusBar
     backgroundColor="blue"
     barStyle="light-content"
   />
       <View style={{flex:3, backgroundColor:'#fff', paddingBottom:15}}>
       <Image source = {background} resizeMode='stretch' style={{height:null, marginBottom:20, alignItems:'center', flex:1, backgroundColor:'rgba(0,0,0,0)', width:null}} >
       <Text style={{color:'#fff', fontWeight:'200', fontSize:14, marginTop:40}}>{user.full_name.toUpperCase()}</Text>
       </Image>
       <Image source = {{ uri: user.profile_picture }} resizeMode='contain' style={{height:80, marginTop:-60, backgroundColor:'rgba(0,0,0,0)', alignSelf:'center', justifyContent:'flex-end', width:80, borderRadius: 40}} >
       </Image>
       <Image source = {levelBack} resizeMode = "stretch" style = {{width:80, alignItems:'center', justifyContent:'center', alignSelf:'center', backgroundColor:'rgba(0,0,0,0)', marginTop:-20, height:40}} >
       <Text style={{color:'#eee', fontWeight:'500'}}>LV. {user.level}</Text>
       </Image>
       </View>
       <View style={{flex:7}}>
       <View style={{backgroundColor:'#fff', margin:7, borderRadius:5, height:140}}>
       <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingLeft:10, borderBottomWidth:1, borderBottomColor:'#f2f2f2'}}>
         <View style={{}}>
         <Text style={{color:'#333', fontSize:15, margin:5}}>My Coins</Text>
         <Text style={{color:'#bbb', fontSize:10, margin:5}}>Leave high-quality comments to earn coins</Text>
         </View>
         <View style={{margin:10, flexDirection:'row', alignItems:'center'}}>
           <Image source={coin} resizeMode="contain" style={{width:26, height:26}} />
           <Text style={{margin:5, color:'#FF713E', fontWeight:'400' }}>{user.points}</Text>
         </View>
       </View>
         <View style={{flex:1, justifyContent:'center', marginLeft:10}}>
           <View style={{flexDirection:'row', alignItems:'flex-end'}}>
           <Text style={{color:'#333', fontSize:13}}>CURRENT LEVEL</Text>
           <Text style={{color:'#bbb', fontSize:11, marginLeft:5}}>Get Famous With Famelab</Text>
           </View>
           {this.progressBar()}
         </View>
       </View>
         <View style={{backgroundColor:'#fff', margin:7, borderRadius:5, height:50, flexDirection:'row', alignItems:'center'}}>
           <View style={{backgroundColor:'#FF74AC', alignItems:'center', justifyContent:'center', padding:5, margin:5, borderRadius:5, height:35, width:35}}>
           <Icon name = "instagram" color="#fff" size = {25} style={{}} />
           </View>
           <Text style={{color:'#333', marginLeft:10}}>Instagram</Text>
         </View>
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

export default connect(mapStateToProps)(UserProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#F8F5F7'

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
