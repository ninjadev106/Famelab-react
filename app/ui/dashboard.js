
/* @flow */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TextInput,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  LayoutAnimation,
  Image,
  ListView,
  Text,
  View,
  Modal,
  KeyboardAvoidingView,
  Navigator
} from 'react-native';

import SwipeCards from 'react-native-swipe-cards';
import { connect } from 'react-redux';
import Promise from 'bluebird';
import includes from 'lodash/includes';
import map from 'lodash/map';
import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import { Map } from 'immutable';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Iconz from 'react-native-vector-icons/FontAwesome';

import Notice from './widgets/newNotice';
import CommentInput from './CommentInput';

import commentBack from "../images/commentBack.png"
import circleBack from "../images/circleBack.png"

import { getImages, getComments, getCommentDetails } from '../instagram/selectors';
import { getDashboardContent } from '../reducers/selectors';

import type { List } from 'immutable';
import type { ContentItem } from '../reducers/types';
import type { InstagramImageObject,
              InstagramImageObjectList,
              InstagramCommentMap,
              CommentDetailsList } from '../instagram/types';

var base = 60

var {height, width} = Dimensions.get('window');
var eachItem = width -20

import Nav from "./widgets/nav"

// Avatar Images
import avatar1 from '../images/mock1.jpg'
import avatar2 from '../images/mock2.jpg'
import avatar3 from '../images/mock3.jpg'
import avatar4 from '../images/mock4.jpg'
import avatar5 from '../images/mock5.jpg'

// Post Images
import image1 from '../images/post1.jpg'
import image2 from '../images/post2.jpg'
import image3 from '../images/post3.jpg'
import image4 from '../images/post4.jpg'
import image5 from '../images/post5.jpg'

import EachComment from './widgets/eachComment'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var commentStyle = {
  position1: {
    position:'absolute',
    bottom:170,
    left:width/2 - 100,
    width:200,
    height:50,
    alignSelf:'center',
    backgroundColor:'rgba(0,0,0,0)'
  },
  position2: {position:'absolute',
    bottom: base ,
    right:15,
    width:60,
    height:60,
    alignSelf:'center',
    borderRadius:25,
    backgroundColor:'rgba(0,0,0,0)'
  }
};

type DashboardState = {
  dataSource: ListView.DataSource;
  commentData: Map<string, ListView.DataSource>;
  commentModalMediaId: ?string;
  showCommentModal: boolean;
  eachPost: number;
  commentBack: number;
  comm1: string;
  comm2: string;
  commH: number;
  commentPosi: {};
  commentVal: string;
  notice: number;
  topOfEmpty: number;
  isLoading: boolean;
};

type DashboardProps = {
  isOnline: boolean;
  content: [ContentItem];
  images: InstagramImageObjectList;
  comments: InstagramCommentMap;
  commentDetails: CommentDetailsList;
  isLoading: boolean;
  actions: {
    loadInitialFamelabData: () => void;
    loadInstagramMediaById: (id: string) => void;
    createInstagramComment: (mediaId: string, text: string) => void;
  };
};

class Dashboard extends Component {

  state: DashboardState;
  props: DashboardProps;

  timeouts = [];

  constructor(props: DashboardProps){
    super(props)
    this.state = {
      showCommentModal: false,
      commentModalMediaId: null,
      dataSource: ds.cloneWithRows([]),
      cards:[],
      commentData: new Map(),
      topOfEmpty: 50,
      eachPost: 0,
      commentBack : circleBack,
          commH : 0,
          comm1:'',
          comm2:'',
      commH: 30,
      commentPosi: commentStyle.position2,
      commentVal: '',
      notice: -150,
      isLoading: false
    }
  }

  componentDidMount() {
    this.timeouts.push(setTimeout(() => this.setState({notice: -0}), 1000));
    this.timeouts.push(setTimeout(() => this.setState({notice: -150}), 3000));
    this.reloadListData();
  }

  componentWillUnmount() {
    console.log("componentWillUnmount "+this.timeouts.length);

    for (var i = 0; i < this.timeouts.length; i++) {
      var timeOut = this.timeouts[i];
      clearTimeout(timeOut) ;
    }
  } 


  componentWillReceiveProps(nextProps: DashboardProps) {
    const loadingStateChanged = this.props.isLoading !== nextProps.isLoading;
    const isDoneLoading = !nextProps.isLoading;
    if (loadingStateChanged && isDoneLoading && !this.state.isLoading) {
      return this.loadData();
    }
  }

  emptyModal(){
    return(<View style={{width:width, height:150, justifyContent:'center', alignItems:'center', position:'absolute', left:0, top:this.state.topOfEmpty}}>
      <Text>Nothing here for now.</Text>
      </View>)
  }

  animateEmpty(){
    this.timeouts.push(setTimeout(() => this.setState({topOfEmpty: -150}), 5000));
  }

  loadData() {
    this.setState({
      isLoading: true
    });
    const sourceIds = map(this.props.content, c => c.source_id);
    return Promise.map(sourceIds, id => {
        return this.props.actions.loadInstagramMediaById(id);
      })
      .then(() => this.reloadListData())
      .then(() => {
        this.setState({
          isLoading: false
        });
      });
  }

  reloadListData() {
    const sourceIds = map(this.props.content, c => c.source_id);
    const { images, comments } = this.props;
    const dashboardImages = filter(images && images.toJS(), img => includes(sourceIds, img.id));
    const commentData = (new Map()).withMutations(map => {
      dashboardImages.forEach(image => {
        map.set(image.id, this.getCommentData(image));
      });
    });
    this.setState({
      dataSource: ds.cloneWithRows(dashboardImages),
      cards : dashboardImages,
      commentData
    });
  }

  reloadMediaById(id: string) {
    Promise.resolve()
      .then(() => this.props.actions.loadInstagramMediaById(id))
      .then(() => this.props.actions.loadInitialFamelabData())
      .then(() => {
        const { images, comments } = this.props;
        const dashboardImages = filter(images && images.toJS(), img => id === img.id);
        const commentData = (new Map()).withMutations(map => {
          dashboardImages.forEach(img => {
            map.set(img.id, this.getCommentData(img));
          });
        });
        this.setState({
          dataSource: ds.cloneWithRows(dashboardImages),
          cards: dashboardImages,
          commentData
        });
      })
  }

  getCommentData(image: InstagramImageObject) {
    const { comments, commentDetails } = this.props;
    const imageComments = comments.get(image.id);
    return ds.cloneWithRows(imageComments ? map(imageComments.toJS(), comment => {
      const details = commentDetails.toJS().find(d => d.comment_id === comment.id);
      return {
        comment,
        userHasLiked: details ? details.i_like : false,
        numLikes: details ? details.num_likes : 0
      };
    }) : []);
  }

  comments(){
    return (
      <View/>
    );
  }

  addComment() {
    const {
      commentModalMediaId: mediaId,
      showCommentModal
    } = this.state;
    return (
      <Modal
        transparent
        animationType="fade"
        visible={showCommentModal}
        onRequestClose={() => this.setState({ showCommentModal: false })}
      >
        <TouchableWithoutFeedback
          style={styles.modalBackground}
          onPress={() => this.setState({ showCommentModal: false })}
        >
          <View style={styles.commentModal}>
            <KeyboardAvoidingView behavior="padding" style={styles.commentContainer}>
              {mediaId && <CommentInput
                onCreateComment={text => {
                  Promise.resolve()
                    .then(() => this.props.actions.createInstagramComment(mediaId, text))
                    .then(() => this.reloadMediaById(mediaId))
                    .then(() => {
                      this.setState({
                        showCommentModal: false
                      });
                    });
                }}
              />}
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  commentIcon(mediaId: string) {
    return (
      <View>
        <TouchableOpacity
          onPress= {() => {
            this.setState({
              showCommentModal: true,
              commentModalMediaId: mediaId
            });
          }}
          style={this.state.commentPosi}
        >
          <Image source = {this.state.commentBack} resizeMode = "cover" style ={{flex:1, alignItems:'center', flexDirection:'row', alignItems:'center', justifyContent:'center', width:null, backgroundColor:'rgba(0,0,0,0)'}}>
          <Image resizeMode='contain' style={{width:30, marginBottom:5, marginRight:5, marginLeft:5}} source = {require('../images/addComment.png')} />
          <View style={{height:this.state.commH}}>
            <Text style={{color:'#fff', fontSize:12}}>{this.state.comm1}</Text>
            <Text style={{color:'#fff', fontSize:9}}>{this.state.comm2}</Text>
          </View>
          </Image>
        </TouchableOpacity>
      </View>
    );
  }

  posts(image: InstagramImageObject) {
    this.setState({
      commentModalMediaId: image.id
    })
    const { user } = image;
    const { url } = image.images.standard_resolution;
    const comments = this.state.commentData.get(image.id);
    return(
    <View style={{flex:1, padding:8}}>
      <ScrollView
        onScroll = {() => this.setState({commentPosi : commentStyle.position2,
          commentBack : circleBack,
          commH : 0,
          comm1:'',
          comm2:''
        })}
      >
        <View style={{height:50, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <View style={{alignItems:'center', flexDirection:'row'}}>
            <Image source={{ uri: user.profile_picture }} style={{width:30, height:30, borderRadius:15}} resizeMode="contain" />
            <Text style={{fontSize:11, margin:10}}>{user.full_name}</Text>
          </View>
          <Icon name ="more-vert" color="#444" size = {20} />
        </View>
        <View
          style={{
            shadowColor: "#444",
            height:eachItem,
            width:eachItem,
            borderRadius:5,
            shadowOpacity: 0.4,
            shadowRadius: 3,
            shadowOffset: {
              height: 3,
              width: 0
            }
          }}
        >
        <Image source={{ uri: url }} resizeMode="contain" style={{flex:1, width:null, height:null, backgroundColor:'rgba(0,0,0,0)', borderRadius:5 }} />
      </View>
        <View style={{ width:eachItem, marginTop:10, alignItems:"center"}}>
          <Text style={{alignItems:"center", color:"#666", fontSize:11, textAlign:'center', marginTop:40, }}>{image.caption.text}</Text>
        </View>
        <View style={{padding:5, marginTop:20, borderLeftWidth:3, borderColor:'#FF709D', height:14, justifyContent:'center'}}>
          <Text style={{fontSize:12}}>COMMENTS</Text>
        </View>
        <ListView
          enableEmptySections
          dataSource={comments}
          style={{marginTop:15}}
          renderRow={({ comment, userHasLiked, numLikes }) => (
            <EachComment
              contentId={image.id}
              comment={comment}
              userHasLiked={userHasLiked}
              numLikes={numLikes}
              onShouldReloadComments={() => this.reloadMediaById(image.id)}
            />
          )}
        />
      </ScrollView>
    </View>)
  }

  postList(){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    return (
      <ListView
        enableEmptySections
        dataSource={this.state.dataSource}
        contentContainerStyle={{}}
        style = {{flex:1}}
        renderRow = {(rowData) => this.posts(rowData)}
      />
    );
  }

  handleYup(){

            this.setState({
              showCommentModal: true,
              commentModalMediaId: mediaId
            });

  }
  handleNope(){}

  nextImage(){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    return (
      <TouchableOpacity
        onPress={() => this.setState({
          eachPost: this.state.eachPost + 1
        })}
        style={styles.nextImageButton}
        >
        <Icon name ='fast-forward' size={25} color='#f54259' />
      </TouchableOpacity>
    );
  }

  renderNoMoreCards(){
    return(<View style={{flex:1, alignItems:'center', backgroundColor:'#fff', justifyContent:'center', width:width-10, margin:5}}><Text style={{color:'#555', fontWeight:'200', fontSize:20}}>No more cards</Text></View>)
  }
  render() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.animateEmpty()
    return (
      <View style={styles.container}>
        <Nav {...this.props} name="comment" />
        {this.emptyModal()}
        <SwipeCards
        cards={this.state.cards}

        renderCard={(cardData) => this.posts(cardData)}
        renderNoMoreCards={() => this.renderNoMoreCards()}
        handleYup= {(cardData) => this.handleYup()}
        handleNope= {() => this.handleNope()}
      />
        {this.addComment()}
        <Notice height = {this.state.notice} message = "Leave comments to earn coins! Use your coins to earn rewards, and to promote your own posts." />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    content: getDashboardContent(state),
    // TODO dev only content: [ { source_id: '1482963023705490531_538995803' } ],
    images: getImages(state),
    comments: getComments(state),
    commentDetails: getCommentDetails(state)
  };
}

export default connect(mapStateToProps)(Dashboard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#f3f3f3'

  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  modal2: {
    height: 230,
    backgroundColor: "#3B5998"
  },
  modal3: {
    height: 300,
    width: 300
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  nextImageButton: {
    position:'absolute',
    shadowColor: "#333",
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: {
      height: 2,
      width: 1
    },
    backgroundColor: '#rgba(255,255,255,0.8)',
    padding:5,
    width:50,
    height:50,
    borderRadius:25,
    alignItems:'center',
    justifyContent:'center',
    right:25,
    bottom: base + 60
  },
  commentModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent'
  },
  commentContainer: {
    backgroundColor: '#fff'
  }
});
