
/* @flow */

import { handleActions } from 'redux-actions';
import { List } from 'immutable';

import * as types from '../actions/actionTypes';
import * as actions from '../actions/actions';

import type { Action, Payload } from '../types';
import type {
  State,
  FetchContentPayload,
  LoadLeaderboardPayload,
  ReceiveContactsPayload } from './types';

const initState: State = {
  content: [],
  leaderboardData: [],
  contacts: new List()
};

const handlers = {
  [types.LOAD_FAMELAB_USER_CONTENT]: (state: State, { payload }: Action<FetchContentPayload>) => {
    if (!payload) {
      return state;
    }
    return {
      ...state,
      user: payload.user,
      content: payload.content
    };
  },
  [types.LOAD_LEADERBOARD]: (state: State, { payload }: Action<LoadLeaderboardPayload>) => {
    if (!payload) {
      return state;
    }
    return {
      ...state,
      leaderboardData: payload.leaderboardData
    };
  },
  [types.RECEIVE_CONTACTS]: (state: State, { payload }: Action<ReceiveContactsPayload>) => {
    if (!payload) {
      return state;
    }
    return {
      ...state,
      contacts: new List(payload.contacts)
    };
  }
};

export default handleActions(handlers, initState);
