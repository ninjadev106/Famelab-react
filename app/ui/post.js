
/* @flow */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  ListView,
  Dimensions,
  Image,
  Text,
  View
} from 'react-native';
import Promise from 'bluebird';

import back from '../images/planeBack.png'
import plane from '../images/plane.png'
import Modal from 'react-native-modalbox';
import { connect } from 'react-redux';
import Nav from './widgets/nav'
import Icon from 'react-native-vector-icons/FontAwesome';

import less from '../images/less.png'
import more from '../images/more.png'

import { loadUserImages } from '../actions/actions';

import { getFamelabUser } from '../reducers/selectors';
import type { FamelabUser } from '../reducers/types';

import { getImages } from '../instagram';
import type { InstagramImageObjectList,
              InstagramImageObject } from '../instagram';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
const { height, width } = Dimensions.get('window');

type Props = {
  images: InstagramImageObjectList;
  loadUserImages: () => void;
  user: FamelabUser;
};


type State = {
  instagramImages: ListView.DataSource;
  modal: {
    image?: InstagramImageObject,
    comments: number;
  }
};

class Post extends Component {

  props: Props;
  state: State;

  constructor(props: Props) {
    super(props)
    this.state = {
      uploadStats:'Insuffient Coins',
        promotionDrop: -130,
        prompt: "Upload Successful",
        statusLocal: -130,
      modal: {
        image: undefined,
        comments: 0,
      },
      instagramImages: ds.cloneWithRows(this.props.images.toJS())
    }
  }

  componentDidMount() {
    this.props.loadUserImages();
    console.log(this.props)
  }

  componentWillReceiveProps({ images }: Props) {
    this.setState({
      instagramImages: ds.cloneWithRows(images ? images.toJS() : [])
    });
  }

  componentDidUpdate() {

  }
  promotionDrop(){
    return(<View style={{position:'absolute', backgroundColor:'#fff', width:width, height:120, alignItems:'center', justifyContent:'center',left:0, top:this.state.promotionDrop}}>
      <Text style={{fontSize:14, color:'#333'}}>{this.state.prompt}</Text>
      </View>)
  }

  challenge() {

  }
  less(){
    if(this.state.modal.comments > 0){
        this.setState({
          modal : {
            image : this.state.modal.image,
            comments: this.state.modal.comments - 5
          }
        })}
  }

  more(){
    // this needs an if statement
    this.setState({
      modal : {
        image : this.state.modal.image,
        comments: this.state.modal.comments + 5
      }
    })
  }

  queue_post_status_note(){
    this.setState({
     promotionDrop: -0,
    })

    // .. promotion test code
 setTimeout(() => this.setState({promotionDrop: -150}), 1000);
  // delete the below to test
        
      
  
  }

  promotePost() {
      const { image, comments } = this.state.modal;
      Promise.resolve()
      .catch((error) => {console.log(error)})
        .then(() => this.props.actions.promotePost(image.id, comments))
        .catch((error) => {console.log(error)})
        .then(() => this.props.actions.loadInitialFamelabData())
        .then(() => {
          this.refs.modal1.close();
        });
  }

  overlayModal(){
    return(<Modal
          style={styles.mod}
          ref={"modal1"}
          swipeToClose={true}>
            {this.renderModalContents()}
        </Modal>)
  }

  renderModalContents() {
    const { image } = this.state.modal;
    if (!image) {
      return;
    }
    const { url } = image.images.low_resolution;
    return (
      <View style={{height:400, alignItems:'center', justifyContent:'space-between', borderRadius:5, width:300, backgroundColor:'#fff'}}>
      <Image source = {{uri : url}} resizeMode='cover' style={{width:280, borderRadius:5, margin:10, height:180}} />
      <Text style={{fontSize:14, fontWeight:'400'}}>Promote This Post</Text>
      <View style={{height:2, width:30 , margin:5, backgroundColor:'#333'}} />
      <Text style={{fontSize:11, color:'#ccc', margin:3}}>How many comments do you want to earn?</Text>
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around', height:30, width:180}}>
        <TouchableOpacity onPress = {() => this.less()}><Image source = {less} resizeMode = "contain" style={{width:25}} /></TouchableOpacity>
        <Text style={{fontSize:21, fontWeight:'600', color:'#FF98C2'}}>{this.state.modal.comments}</Text>
        <TouchableOpacity onPress = {() => this.more()}><Image source = {more} resizeMode = "contain" style={{width:30}} /></TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => this.promotePost()}>
        <Image source = {back} resizeMode="contain" style={{height:44, backgroundColor:"rgba(0,0,0,0)", flexDirection:'row', justifyContent:'center',alignItems:'center', margin:10}} >
        <Image source={plane} resizeMode="contain" style={{width:22, height:22}} />
        <View style={{margin:10}}>
        <Text style = {{color:'#fff', fontSize:11}}>Receive {this.state.modal.comments} Comments</Text>
        <Text style = {{color:'#fff', fontSize:11}}>For {this.state.modal.comments} Coins</Text>
        </View>
        </Image>
        </TouchableOpacity>
      </View>
    );
  }

  openModal(image){
    if(this.props.user.points < 5){
      this.queueNoCoins()
    }else{
        this.refs.modal1.open()
        this.setState({
          modal : {
            image : image,
            comments: this.state.modal.comments
          }
        })
    
      }
  }

  queueNoCoins(){
    this.setState({
      statusLocal: 0
    })
    
  }

  eachImage(image: InstagramImageObject) {
    const { url } = image.images.low_resolution;
    return (
      <TouchableOpacity onPress={() => this.openModal(image)} style={{width:width/3, height:width/3}}>
        <Image source = {{ uri: url }} resizeMode = "contain" style={{ flex: 1, width: null, height: null }} />
      </TouchableOpacity>
    );
  }
  uploadStats(){
    return(<View style={{width:width, height:90,borderBottomWidth:1, borderBottomColor:'#eee', backgroundColor:'#fff', alignItems:'center', justifyContent:'center', position:'absolute', top:this.state.statusLocal}}>
    <Text style={{color:'#333'}}>{this.state.uploadStats}</Text>
    </View>)
  }

  render() {
    // que promo promotion
    
    const { user } = this.props;
    return (
      <View style={styles.container}>
        <Nav {...this.props} name="post photo" />
        <View style={{flex:1, marginTop:5, backgroundColor:'#fff'}}>
          <View style={{backgroundColor:'#fff', margin:7, borderRadius:5, height:40, flexDirection:'row', alignItems:'center'}}>
           <View style={{backgroundColor:'#FF74AC', alignItems:'center', justifyContent:'center', padding:5, margin:5, borderRadius:5, height:35, width:35}}>
           <Icon name = "instagram" color="#fff" size = {25} style={{}} />
           </View>
           <Text style={{color:'#333', marginLeft:10}}>Instagram Photos</Text>
         </View>
         <ListView
         enableEmptySections = {true}
         dataSource = {this.state.instagramImages}
         renderRow = {(rowData) => this.eachImage(rowData)}
         style = {{flex:1, marginBottom:50}}
         contentContainerStyle={styles.images} />
        </View>
        {this.overlayModal()}
         {this.uploadStats()}
         {this.promotionDrop()}
      </View>
    );
  }
}

function mapStateToProps(state): {} {
  return {
    images: getImages(state),
    user: getFamelabUser(state)
  };
}

function mapDisatchToProps(dispatch): {} {
  return {
    loadUserImages: () => dispatch(loadUserImages()),
  };
}

export default connect(mapStateToProps, mapDisatchToProps)(Post);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#f7f7f7'

  },
  mod:{
    flex:1,
    backgroundColor:'rgba(0,0,0,0.6)',
    alignItems:'center',
    justifyContent:'center',
  },
  images:{
    flexDirection:"row",
    flexWrap : "wrap"
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
