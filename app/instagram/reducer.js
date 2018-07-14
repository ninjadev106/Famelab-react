
/* @flow */

import { handleActions } from 'redux-actions';
import { List, Map } from 'immutable';

import * as types from '../actions/actionTypes';
import * as actions from '../actions/actions';

import type { Action } from '../types';
import type { State, LoginPayload, LoadImagesPayload, LoadMediaAndCommentsPayload } from './types';

const initState: State = {
  user: null,
  accessToken: '',
  images: new List(),
  comments: new Map(),
  commentDetails: new List(),
  friends: new List()
};

const handlers = {
  [types.RECEIVE_INSTAGRAM_FRIENDS]: (state: State, { payload }: Action<ReceiveInstagramFreindsPayload>) => {
    if (!payload) {
      return state;
    }
    return {
      ...state,
      friends: new List(payload.friends)
    };
  },
  [types.LOGIN]: (state: State, { payload }: Action<LoginPayload>) => {
    if (!payload) {
      return state;
    }
    return {
      ...state,
      accessToken: payload.accessToken,
      user: payload.user
    };
  },
  [types.LOAD_INSTAGRAM_IMAGES]: (state: State, { payload }: Action<LoadImagesPayload>) => {
    if (!payload) {
      return state;
    }
    return {
      ...state,
      images: payload.images
    };
  },
  [types.LOAD_MEDIA_AND_COMMENTS]: (state: State, { payload }: Action<LoadMediaAndCommentsPayload>) => {
    if (!payload) {
      return state;
    }
    const { image, comments, commentDetails } = payload;
    return {
      ...state,
      images: state.images.push(image),
      comments: state.comments.set(image.id, comments),
      commentDetails: state.commentDetails.merge(commentDetails)
    };
  },
  [types.WILL_LIKE_COMMENT]: likeComment,
  [types.LIKE_COMMENT]: likeComment,
  [types.WILL_UNLIKE_COMMENT]: unlikeComment,
  [types.UNLIKE_COMMENT]: unlikeComment,
  [types.CREATE_INSTAGRAM_COMMENT]: (state: State, { payload }: Action<any>) => {
    if (!payload) {
      return state;
    }
    const { mediaId, comment } = payload;
    const comments = state.comments.get(mediaId);
    return {
      ...state,
      comments: state.comments.set(mediaId, comments.push(comment))
    };
  }
};

const likeComment = (state: State, { payload }: Action<any>) => {
  if (!payload) {
    return state;
  }
  const { commentId, contentId } = payload;
  return {
    ...state,
    commentDetails: state.commentDetails.map(d => {
      if (d.comment_id === commentId) {
        return {
          ...d,
          i_like: true,
          num_likes: d.num_likes + 1
        };
      }
      return d;
    })
  };
};

const unlikeComment = (state: State, { payload }: Action<any>) => {
  if (!payload) {
    return state;
  }
  const { commentId, contentId } = payload;
  return {
    ...state,
    commentDetails: state.commentDetails.map(d => {
      if (d.comment_id === commentId) {
        return {
          ...d,
          i_like: false,
          num_likes: d.num_likes - 1
        };
      }
      return d;
    })
  };
};

export default handleActions(handlers, initState);
