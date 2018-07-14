
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ListView,
  Text,
  View
} from 'react-native';

import silver from "../../images/silver.png"
import bronze from "../../images/bronze.png"
import crown from "../../images/crow.png"
import fame_coins from "../../images/fame_coins.png"

import Icon from 'react-native-vector-icons/MaterialIcons';
import Iconz from 'react-native-vector-icons/FontAwesome';
var {height, width} = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Today extends Component {
  constructor(props){
    super(props)
    this.state = {
      dataSource: ds.cloneWithRows(this.props.data)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({
        dataSource: ds.cloneWithRows(nextProps.data)
      });
    }
  }

  findMe(){
    return(<TouchableOpacity
      style={{position:'absolute', right:0, bottom:100, }}>
      <Image source ={require('../../images/findMeGrad.png')} resizeMode="cover" style = {{ height:65, alignItems:'center', backgroundColor:'rgba(0,0,0,0)', justifyContent:'center'}} >
      <Icon name='gps-fixed' size={20} color='#eee' style={{marginBottom:4}} />
      </Image>
      </TouchableOpacity>)
  }

  eachItem(user){
    return(<View style={{flexDirection:'row', borderBottomWidth:1, borderColor:'#eee', justifyContent:'space-between', height:80, alignItems:'center',}}>
      <View style={{flexDirection:'row', alignItems:'center', padding:10 }}>
      <Text style={{color:'#999', fontSize:11}}>{user.id}</Text>
      <Image source = {{uri : user.profile_picture}} style={{borderRadius:20, width:40, height:40, backgroundColor:'#eee', margin:10}} resizeMode="contain" />
      <View>
      <Text style={{fontWeight:'500', color:'#333'}}>{user.full_name}</Text>
      <Text style={{color:'#999', fontSize:11}}>{user.instagram_username}</Text>
      </View>
      </View>
        <View style={{flexDirection:'row', alignItems:'center', marginRight:10}}>
          <View style={{backgroundColor:'#fc2b73', width:20, height:20, borderRadius:10, alignItems:'center', justifyContent:'center'}}>
          <Icon name="star" color="#ffef65" size ={12} style={{}} />
          </View>
          <Text style={{color:'#fc2b73', fontSize:11, fontWeight:'600', margin:5}}>{user.points}</Text>
        </View>
      </View>)
  }

  commentButton(){
    return(<View></View>)
  }

  render() {
    const [first, second, third] = this.props.data;
    return (
    <View style={{flex:1}}>
      <ScrollView style={styles.container}>
      <Image source ={require('../../images/background.png')} resizeMode="cover" style={{width:width, height:390,}}>
        <View style={{flex:1, flexDirection:'row'}}>
          {second && <View style={styles.trophy}>
            <Image source = {{uri: second.profile_picture}} resizeMode="contain" style={{width:60, justifyContent:'flex-end', backgroundColor:'#f7f7f7', height:60, borderRadius:30}}/>
            <Image source = {silver} style={{width:40, height:40, marginTop:-15, backgroundColor:'rgba(0,0,0,0)'}} resizeMode="contain" />
            <Text numberOfLines = {1}  style={{color:'#fff', width:80, textAlign:'center', fontSize:13}}>{second.full_name}</Text>
          </View>}
          {first && <View style={styles.trophy1}>
            <Image source = {{uri: first.profile_picture}} resizeMode="contain" style={{width:90, justifyContent:'flex-end', backgroundColor:'#f7f7f7', height:90, borderRadius:45}}/>
            <Image source = {crown} style={{width:60, height:60, marginTop:-25, backgroundColor:'rgba(0,0,0,0)'}} resizeMode="contain" />
            <Text numberOfLines = {1}  style={{color:'#fff', width:80, textAlign:'center', fontSize:13}}>{first.full_name}</Text>
          </View>}
          {third && <View style={styles.trophy}>
            <Image source = {{uri: third.profile_picture}} resizeMode="contain" style={{width:60, justifyContent:'flex-end', backgroundColor:'#f7f7f7', height:60, borderRadius:30}}/>
            <Image source = {bronze} style={{width:40, height:40, marginTop:-15, backgroundColor:'rgba(0,0,0,0)'}} resizeMode="contain" />
            <Text numberOfLines = {1}  style={{color:'#fff', width:80, textAlign:'center', fontSize:13}}>{third.full_name}</Text>
           </View>}
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>

        </View>
      </View>
       <View style={{height:50, flexDirection:'row', justifyContent:'space-around'}}>
          {second && <View style={{flexDirection:'row', alignItems:'center'}}><Image source={fame_coins} resizeMode='contain' style={{width:20, margin:5}} /><Text style={{color:'#fff', fontSize:11}}>{second.points}</Text></View>}
          {first && <View style={{flexDirection:'row', alignItems:'center'}}><Image source={fame_coins} resizeMode='contain' style={{width:20, margin:5}} /><Text style={{color:'#fff', fontSize:11}}>{first.points}</Text></View>}
          {third && <View style={{flexDirection:'row', alignItems:'center'}}><Image source={fame_coins} resizeMode='contain' style={{width:20, margin:5}} /><Text style={{color:'#fff', fontSize:11}}>{third.points}</Text></View>}
      </View>
      </Image>
        <ListView
        enableEmptySections
        dataSource = {this.state.dataSource}
        renderRow = {(rowData) => this.eachItem(rowData)}
        />
      </ScrollView>
              {this.findMe()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom:30

  },
  trophy:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  trophy1:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    paddingBottom:100
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
