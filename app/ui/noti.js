
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ListView,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  View
} from 'react-native';

import data from "../mock/noti"
import Nav from './widgets/nav'
var {height, width} = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Post extends Component {
  constructor(props){
    super(props)

    this.state = {
      dataSource: ds.cloneWithRows(data.notifications)
    }
  }

  promo(){
    console.log(data)
    if(data.promos_avail){
      var x = data.promo
        return(<View style={{flexDirection:'row', marginTop:5, padding:5, height:100, width:width, backgroundColor:'#fff', alignSelf:'center', alignItems:'center', }}>
          <Image source = {x.image} resizeMode="contain" style={{width:120,}} />
          <View style={{flex:3, height:70, justifyContent:'space-between'}}>
          <Text style={{fontSize:14, fontWeight:'100', color:'#333'}}>Today you earned <Text style={{fontWeight:'300', color:'#FF4A87'}}>XXX</Text> coins! Promote a post now!</Text>
          <View  style={{flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between'}}>
          <Text style={{color:'#999', fontSize:11}}>{x.time}</Text>
          <TouchableOpacity style={{borderRadius:10, backgroundColor:'#FF98C2', width:100, alignItems:'center',borderColor:'#FF83AF', padding:6 }}>
      <Text style={{fontSize:11, color:'#fff'}}>{x.action_button}</Text>
      </TouchableOpacity>
          </View>
          </View>
          </View>)}else{
          return(<View />)
        }
  }

  eachNotification(x){
    return(<View  style={{flexDirection:'row', padding:5, height:100, alignItems:'center', backgroundColor:'#fff', marginTop:7 }}>
      <Image source = {x.image} resizeMode="contain" style={{margin:5, flex:1, width:120,}} />
      <View style={{flex:3, height:70, justifyContent:'space-between'}}>
      <Text style={{fontSize:14, fontWeight:'100', color:'#333'}}>{x.text}</Text>
      <View style={{flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between'}}>
      <Text style={{color:'#999', fontSize:11}}>{x.time}</Text>
      <TouchableOpacity style={{borderRadius:10, width:100, alignItems:'center', borderWidth:1, borderColor:'#FF83AF', padding:5 }}>
      <Text style={{fontSize:10, color:'#FF83AF'}}>{x.action_button}</Text>
      </TouchableOpacity>
      </View>
      </View>
    </View>)
  }


  render() {
    return (
      <View style={styles.container}>
      <Nav {...this.props} name = "Notification" />
        {this.promo()}
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#f3f3f3',

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
