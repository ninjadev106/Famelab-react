
/* @flow */

import React, { Component } from 'react';
import {
  Modal,
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  Easing } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import freeCoins from '../images/FreeCoins.png'
import earn50CoinsButton from '../images/earn50Coins.png'

type Props = {
  visible: boolean;
  onRequestClose: () => void;
  onRequestInviteList: () => void;
};

type State = {
  fadeIn: Animated.Value;
  bounceIn: Animated.Value;
};

export default class InviteModal extends Component {

  props: Props;

  state: State = {
    fadeIn: new Animated.Value(0),
    bounceIn: new Animated.Value(0)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.visible !== nextProps.visible && nextProps.visible) {
      this.animateIn();
    }
  }

  animateIn() {
    Animated.timing(
      this.state.fadeIn,
      {
        duration: 700,
        delay: 200,
        toValue: 1
      }
    ).start();
    Animated.spring(
      this.state.bounceIn,
      {
        toValue: 1,
        friction: 2,
        tension: 10,
        velocity: 7
      }
    ).start();
  }

  render() {
    const { visible, onRequestClose, onRequestInviteList } = this.props;
    const anims = {
      opacity: this.state.fadeIn,
      transform: [{
        scale: this.state.bounceIn
      }]
    };
    return (
      <Modal visible={visible}
             transparent
             onRequestClose={() => onRequestClose()}>
           <View style={styles.inviteModalBackground}>
             <Animated.View style={[styles.inviteModal, anims]}>
               <View style={styles.inviteInfoTop}>
                 <Image source={freeCoins} style={styles.inviteImage} resizeMode="cover"/>
               </View>
               <View style={styles.inviteInfoBottom}>
                 <Text style={styles.bigText}>GET FREE COINS</Text>
                 <Text style={styles.smallText}>Invite Your Friends</Text>
                 <Text style={styles.smallText}>And Earn Free Comments</Text>
                 <TouchableOpacity onPress={() => onRequestInviteList()}>
                   <Image source={earn50CoinsButton} resizeMode="contain" style={styles.button}/>
                 </TouchableOpacity>
               </View>
             </Animated.View>
             <TouchableOpacity onPress={() => onRequestClose()}>
                 <View style={styles.close}>
                   <MaterialIcon name="close" />
                 </View>
             </TouchableOpacity>
           </View>
      </Modal>
    );
  }
}

const styles = {
  inviteModalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  inviteModal: {
    opacity: 0,
    marginHorizontal: 30,
    marginVertical: 100,
    height: 420,
    width: 315,
    borderRadius: 5,
    shadowColor: "#411c22",
    backgroundColor: 'white',
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowOffset: {
      height: 4,
      width: 0
    },
  },
  inviteImage: {
    flexGrow: 1
  },
  inviteInfoTop: {
    height: 205,
    top: -2,
    overflow: 'hidden',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    flexGrow: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inviteInfoBottom: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5
  },
  bigText: {
    fontSize: 29,
    marginVertical: 8
  },
  smallText: {
    marginVertical: 4,
    fontSize: 15,
    color: '#585858'
  },
  button: {
    marginVertical: 26,
    width: 255,
    height: 46
  },
  close: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
    overflow: 'hidden',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
