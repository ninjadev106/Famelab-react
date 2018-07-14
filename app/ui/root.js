
/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  Navigator,
  Image,
  TouchableOpacity,
  View,
  LayoutAnimation,
  Dimensions,
  Modal,
  WebView,
  ActivityIndicator,
  NetInfo,
  Text
} from 'react-native';
import url from 'url';
import Icon from 'react-native-vector-icons/FontAwesome';
import Promise from 'bluebird';
import includes from 'lodash/includes';

import InviteListModal from './InviteListModal';
import Dashboard from './dashboard';
import Leaderboard from './leadership';
import Login from './login';
import Notification from './noti';
import Post from './post';
import Profile from './userProfile';
import { getUser,
 getInstagramAccessToken,
 instagramClient } from '../instagram';
 import InviteModal from './InviteModal';

 import chat from '../images/chat.png'
 import stats from '../images/stats.png'
 import notif from '../images/notif.png'
 import lab from '../images/lab.png'
 import person from '../images/person.png'

 import chat_active from '../images/comments_active.png'
 import stats_active from '../images/stats_active.png'
 import notif_active from '../images/bell_active.png'
 import person_active from '../images/profile_active.png'

 var icons = ['comment', 'bell', 'trophy', 'user-circle']
 var {height, width} = Dimensions.get('window');

 Promise.config({
  warnings: {
    wForgottenReturn: false
  }
});

 import { connect } from 'react-redux';
 import {bindActionCreators} from 'redux';
 import * as actions from '../actions/actions';

 const routes = {
  dashboard: Dashboard,
  notification: Notification,
  login: Login,
  leaderboard: Leaderboard,
  post: Post,
  profile: Profile
};

type RootState = {
  isOnline: boolean;
  isLoading: boolean;
  myView: string;
  menuMargin: number;
  showInviteModal: boolean;
  showInviteListModal: boolean;
  showModal: boolean;
  showInstagram: boolean;
  icons: any;
};

type RootProps = {
  accessToken: string;
  actions: {
    loadInitialData: (code: string) => void;
  };
};

type UrlEvent = {
  url: string;
};

const styles = {
  container: (width) => ({
    position:'absolute',
    shadowColor: "#ccc",
    borderRadius:10,
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
      height: 0,
      width: 5
    },
    bottom:5,
    left:0,
    height:45,
    width: width,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.8)'
  }),
  button1: {
    width:70,
    shadowColor: "#ccc",
    borderRadius:10,
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
      height: 0,
      width: 0
    },
    height:70,
    borderRadius:35,
    alignItems:'center',
    padding:5,
    backgroundColor:'rgba(255,255,255,0.8)',
    justifyContent:'center'
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

class Root extends Component {

  state: RootState;
  props: RootProps;

  _handleNetworkStateChange: (networkState: any) => void;

  constructor(props){
    super(props)
    this.state = {
      isOnline: true,
      myView: 'dashboard',
      showInviteModal: false,
      showInviteListModal: false,
      showModal: false,
      showInstagram: false,
      menuMargin: -60,
      isLoading: false,
      icons:{
        comments: chat_active,
        notif: notif,
        stats: stats,
        person: person

      }
    }
    this._handleNetworkStateChange = networkState => this.updateNetworkState(networkState);
  }

  componentDidMount() {
    this.addNetworkStateListener();
    this.checkAccessToken();
  }

  componentWillUnmount() {
    this.removeNetworkStateListener();
  }

  checkAccessToken() {
    if (!this.props.accessToken) {
      this.setState({
        showModal: true,
        showInstagram: true,
        menuMargin: 0
      });
    }
  }

  showInviteModal() {
    this.setState({
      showInviteModal: true
    });
  }

  addNetworkStateListener() {
    NetInfo.fetch().done(this._handleNetworkStateChange);
    NetInfo.addEventListener('change', this._handleNetworkStateChange);
  }

  removeNetworkStateListener() {
    NetInfo.removeEventListener('change', this._handleNetworkStateChange);
  }

  updateNetworkState(networkState) {
    this.setState({
      isOnline: !includes(['none', 'unknown'], networkState)
    });
  }

  renderScene({id}, navigator){
    const Scene = routes[id]
    return (
      <Scene
      {...this.props}
      isOnline={this.state.isOnline}
      scene={this.state.myView}
      navigator={navigator}
      isLoading={this.state.isLoading}
      />
      );
    }

    openView(x) {
      var routeStack = this.refs.NAV.state.routeStack;
      routeStack.pop();
      routeStack.push({id:x});
      this.refs.NAV.immediatelyResetRouteStack(routeStack);
    }

    newView(x,y){
      this.openView(x);

      switch (x) {
       case 'dashboard': {
        return this.setState({
          icons: {
            comments: chat_active,
            notif: notif,
            stats: stats,
            person: person
          }
        });
      }
      case 'notification': {
        return this.setState({
          icons: {
            comments: chat,
            notif: notif_active,
            stats: stats,
            person: person
          }
        });
      }
      case 'leaderboard': {
        return this.setState({
          icons: {
            comments: chat,
            notif: notif,
            stats: stats_active,
            person: person
          }
        });
      }
      case 'profile':
      return this.setState({
        icons: {
          comments: chat,
          notif: notif,
          stats: stats,
          person: person_active
        }
      });
    }
  }

  render() {
    return (
    <View style={{flex:1}}>
    <Navigator
    style={{flex: 1,}}
    configureScene = {(route, routeStack) => Navigator.SceneConfigs.FloatFromBottom}
    ref="NAV"
    initialRoute={{id: this.state.myView, name: this.state.myView}}
    renderScene={this.renderScene.bind(this)}
    />
    <View style={styles.container(width)}>
    <TouchableOpacity onPress ={() => this.newView("dashboard")} style={{flex:1, alignItems:'center', justifyContent:'center', }}>
    <Image source = {this.state.icons.comments} resizeMode= "contain" style={{width:20, margin:5, height:20}}/>
    </TouchableOpacity>
    <TouchableOpacity  onPress ={() => this.newView("notification")}  style={{flex:1, alignItems:'center', justifyContent:'center', }}>
    <Image source = {this.state.icons.notif} resizeMode= "contain" style={{width:20, margin:5, height:20}}/>
    </TouchableOpacity>
    <TouchableOpacity onPress ={() => this.openView('post')} style={styles.button1}>
    <Image source = {lab} resizeMode= "contain" style={{width:35, margin:5, marginBottom:10,  height:35}}/>
    </TouchableOpacity>
    <TouchableOpacity onPress ={() => this.newView("leaderboard")} style={{flex:1, alignItems:'center', justifyContent:'center', }}>
    <Image source = {this.state.icons.stats} resizeMode= "contain" style={{width:20, margin:5, height:20}}/>
    </TouchableOpacity>
    <TouchableOpacity onPress ={() => this.newView("profile")} style={{flex:1, alignItems:'center', justifyContent:'center', }}>
    <Image source = {this.state.icons.person} resizeMode= "contain" style={{width:20, margin:5, height:20}}/>
    </TouchableOpacity>
    </View>
    {this.renderInstagramLoginModal()}
    {this.renderInviteModal()}
    {this.renderInviteListModal()}
    </View>
    )
  }

  renderInviteModal() {
    const { showInviteModal } = this.state;
    return (
    <InviteModal
    visible={showInviteModal}
    onRequestClose={() => this.setState({ showInviteModal: false })}
    onRequestInviteList={() => {
      this.setState({
        showInviteModal: false
      });
      setTimeout(() => {
        this.setState({
          showInviteListModal: true
        });
      }, 100);
    }}
    />
    );
  }

  renderInviteListModal() {
    const { showInviteListModal } = this.state;
    return (
    <InviteListModal
    visible={showInviteListModal}
    onRequestClose={() => this.setState({ showInviteListModal: false })}
    />
    );
  }

  renderInstagramLoginModal() {
    const { isLoading, showModal } = this.state;
    return (
    <Modal animationType="slide"
    visible={showModal}
    onRequestClose={() => this.setState({ showModal: false })}>
    <View style={styles.modal}>
    <View style={{ height: 20 }}/>
    {isLoading
     ? <ActivityIndicator color="#000"/>
     : <WebView source={{ uri: instagramClient.getAuthorizeURL() }}
     style={{ height, width }}
     onNavigationStateChange={this.handleModalNavStateChange.bind(this)}/>}
     </View>
     </Modal>
     );
   }

   handleModalNavStateChange(navState) {
    if (navState.url.indexOf(instagramClient.config.redirectURI) !== -1) {
      const { query } = url.parse(navState.url, true);
      if (!query || !query.code) {
        return;
      }
      const { code } = query;
      this.setState({
        isLoading: true,
        showInstagram: false
      });
      Promise.resolve()
      .then(() => this.props.actions.loadInitialData(code))
      .then(() => {
        this.setState({
          showInstagram: false,
          showModal: false,
          isLoading: false
        });
      })
      .then(() => this.showInviteModal());
    }
  }
}
export default connect(state => ({
  user: getUser(state),
  accessToken: getInstagramAccessToken(state)
}),
(dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
})
)(Root);
