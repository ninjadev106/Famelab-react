
/* @flow */

import React, { Component } from 'react';
import {
  Modal,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView } from 'react-native';
import Promise from 'bluebird';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import Icon from 'react-native-vector-icons/Entypo';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Initials from 'react-native-material-initials/native';
import SendSMS from 'react-native-sms';

import { loadContacts, recordInvitations } from '../actions/actions';
import { getContacts } from '../reducers/selectors';

import get50FreeCoins from '../images/get50FreeCoins.png';

import type { ContactObject } from '../reducers/types';

type Props = {
  visible: boolean;
  onRequestClose: () => void;
  loadContacts: () => void;
  recordInvitations: (num: number) => void;
  contacts: List<ContactObject>;
};

type State = {
  selectedMap: Map<string, ContactObject>;
};

function mapStateToProps(state) {
  return {
    contacts: getContacts(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadContacts: () => dispatch(loadContacts()),
    recordInvitations: num => dispatch(recordInvitations(num))
  };
}

class InviteListModal extends Component {

  props: Props;
  state: State = {
    selectedMap: new Map()
  };

  loadingPromise: ?Promise;

  componentDidMount() {
    this.loadingPromise = this.props.loadContacts();
  }

  componentWillUnmount() {
    this.loadingPromise && this.loadingPromise.cancel();
  }

  goBack() {
    this.props.onRequestClose();
  }

  handleInvite() {
    const phoneNumbers = this.state.selectedMap.map(contact => {
      if (!contact.phoneNumbers || !contact.phoneNumbers.length) {
        return;
      }
      return contact.phoneNumbers[0].number;
    })
    SendSMS.send({
      body: 'Join me on 👑Famelab👑 and expose your posts to millions of interested viewers!',
      recipients: phoneNumbers.toArray()
    }, (completed, cancelled, error) => {
      if (completed) {
        const numberSelected = Object.keys(this.state.selectedMap.toJS()).length;
        return Promise.resolve()
          .then(() => this.props.recordInvitations(numberSelected))
          .then(() => this.props.onRequestClose());
      }
      this.props.onRequestClose();
    });
  }

  render() {
    const { visible, onRequestClose } = this.props;
    return (
      <Modal visible={visible}
             transparent
             animationType="slide"
             onRequestClose={() => onRequestClose()}>
        <View style={styles.inviteModalBackground}>
          {this.renderHeader()}
          <ScrollView style={styles.scrollView}>
            {this.props.contacts.map((contact, index) => this.renderListItem(contact, index))}
          </ScrollView>
          {this.renderFooter()}
        </View>
      </Modal>
    );
  }

  renderListItem(contact: ContactObject, index: number) {
    const isSelected = !!this.state.selectedMap.get(contact.recordID);
    const fullName = `${contact.givenName} ${contact.familyName}`;
    return (
      <View key={contact.recordID} style={styles.listItemContainer}>
        <View style={styles.listItem}>
          {contact.thumbnailPath ? (
            <Image source={{ uri: contact.thumbnailPath }} style={styles.imageAvatar} />
          ) : (
            <Initials
              style={styles.avatar(index)}
              color="white"
              size={40}
              text={fullName}
              single={false}
            />
          )}
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>{fullName}</Text>
          </View>
          <TouchableOpacity
            style={isSelected ? styles.selectButton : styles.unselectedButton}
            onPress={() => this.setState({
              selectedMap: isSelected
                ? this.state.selectedMap.remove(contact.recordID)
                : this.state.selectedMap.set(contact.recordID, contact)
            })}
          >
            {isSelected ? (
              <FAIcon name="check" size={15} color="white"/>
            ) : (
              <FAIcon name="plus" size={15} color="#FF4A87"/>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.separator}/>
      </View>
    );
  }

  renderHeader() {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => this.goBack()} style={styles.backButton}>
          <Icon name="chevron-left"/>
          <Text>Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>INVITE FRIENDS</Text>
        </View>
        <View style={styles.spacer}/>
      </View>
    );
  }

  renderFooter() {
    return (
      <View style={styles.footer}>
        <View style={styles.footerTextContainer}>
          <Text style={styles.footerText}>Invite 5 friends to receive</Text>
          <Text style={styles.footerText}>your free coins!</Text>
        </View>
        <TouchableOpacity onPress={() => this.handleInvite()}>
          <Image source={get50FreeCoins} resizeMode="contain" style={styles.inviteButton}/>
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InviteListModal);

function genRandomColor(index) {
  return ['#A09EFF', '#FF583E', '#FF73AC', '#FF4A87', '#A4FF8C', '#FFF94D'][index % 6];
}

const styles = {
  inviteModalBackground: {
    flex: 1,
    backgroundColor: 'white'
  },
  scrollView: {
    flex: 1
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  listItemContainer: {
    flex: 1
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    flex: 1,
    backgroundColor: '#ccc'
  },
  usernameContainer: {
    flex: 1
  },
  username: {
    fontWeight: 'bold'
  },
  imageAvatar: {
    width: 38,
    backgroundColor: '#eee',
    height: 38,
    margin: 5,
    marginRight: 20,
    borderRadius: 19
  },
  avatar: index => ({
    width: 38,
    backgroundColor: genRandomColor(index),
    height: 38,
    margin: 5,
    marginRight: 20,
    borderRadius: 19
  }),
  header: {
    shadowColor: "#411c22",
    backgroundColor: 'white',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {
      height: 4,
      width: 0
    },
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  footer: {
    shadowColor: "#411c22",
    backgroundColor: 'white',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {
      height: -4,
      width: 0
    },
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerTextContainer: {
    justifyContent: 'center'
  },
  footerText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  backButton: {
    flex: 0.5,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center'
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  spacer: {
    flex: 0.5
  },
  selectButton: {
    height: 25,
    width: 25,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#FF4A87',
    alignItems: 'center',
    justifyContent: 'center'
  },
  unselectedButton: {
    height: 25,
    width: 25,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#FFF3F8',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inviteButton: {
    marginVertical: 8,
    width: 335,
    height: 46
  }
};
