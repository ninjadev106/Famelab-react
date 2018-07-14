
/* @flow */

import Promise from 'bluebird';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import { likeComment, unlikeComment, loadInstagramMediaById } from '../../actions/actions';
import type { InstagramComment } from '../../instagram/types';

var {height, width} = Dimensions.get('window');

class EachComment extends Component {

  props: {
    contentId: string;
    comment: InstagramComment;
    userHasLiked: boolean;
    likeComment: (contentId: string, commentId: string) => void;
    unlikeComment: (contentId: string, commentId: string) => void;
    onShouldReloadComments: () => void;
  };

  render() {
    const { comment, userHasLiked } = this.props;
    const { id, from: user, text } = comment;
    return (
      <View style={styles.container}>
       <Image source = {{ uri: user.profile_picture }} style={{width:38, backgroundColor:'#eee', height:38, margin:5, borderRadius:19}} />
        <View style={{flexDirection:'row', flex:3}}>
          <Text style={{fontSize:11, fontWeight:'500', margin:5, color:'#333'}}>{user.full_name}</Text>
          <Text style={{fontSize:11, fontWeight:'300', margin:5, color:'#333', width:170}}>{text}</Text>
        </View>
        <View style={{flex:1, flexDirection:'row', justifyContent:'flex-end', margin:5, alignItems:'center'}}>
        {/* TODO <Text style={{color:'#f54259', fontSize:12,}}>{this.props.data.hearts}</Text> */}
        <Icon
          name={userHasLiked ? 'heart' : 'heart-o'}
          color='#f54259'
          size={15}
          style={{ margin: 5 }}
          onPress={() => this.handlePress()}
        />
        </View>
      </View>
    );
  }

  handlePress() {
    const { comment, userHasLiked, contentId } = this.props;
    Promise.resolve()
      .then(() => {
        if (userHasLiked) {
          return this.props.unlikeComment(contentId, comment.id);
        }
        return this.props.likeComment(contentId, comment.id)
      })
      .then(() => {
        this.props.onShouldReloadComments();
      })
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    likeComment: (contentId, commentId) => dispatch(likeComment(contentId, commentId)),
    unlikeComment: (contentId, commentId) => dispatch(unlikeComment(contentId, commentId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EachComment);

const styles = StyleSheet.create({
  container: {
    height:70,
    backgroundColor:"rgba(255,255,255,0.7)",
    margin:2,
    shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 1,
      shadowOffset: {
        height: 1,
        width: 0
      },
    padding:5,
    width:width-20,
    flexDirection:'row',
    alignItems:'center'
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
