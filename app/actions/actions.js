/* @flow */

import Promise from 'bluebird';
import { Linking } from 'react-native';
import qs from 'querystring';
import Contacts from 'react-native-contacts';

import * as types from './actionTypes';

import log from '../log';
import { instagramClient } from '../instagram';
import { famelabLogin, famelabRequest } from './helpers';

import type { InstagramUserObject,
              InstagramImageObjectList } from '../instagram';
import type { RequestOptions, FamelabUser } from './types';
import type { Action } from '../types';

export function recordInvitations(num: number) {
  return (dispatch, getState) => {
    return Promise.resolve()
      .then(() => {
        const { instagram } = getState();
        return famelabRequest({
          user: instagram.user,
          accessToken: instagram.accessToken,
          url: 'https://famelab-api.appspot.com/users/invite',
          method: 'POST',
          body: {
            num
          }
        });
      })
      .catch(error => {
        log.trace(error);
        log.error(error);
      });
  };
}

export function loadContacts() {
  return (dispatch: any) => {
    Contacts.checkPermission((err, permission) => {
      if (permission === Contacts.PERMISSION_UNDEFINED){
        Contacts.requestPermission((err, permission) => {
          if (err && err === Contacts.PERMISSION_DENIED) {
            return dispatch({ type: types.RECEIVE_CONTACTS_FAILURE, payload: { error: err } });
          }
          return dispatch(fetchContacts());
        });
      }
      if (permission === Contacts.PERMISSION_AUTHORIZED){
        return dispatch(fetchContacts());
      }
      if (permission === Contacts.PERMISSION_DENIED){
        return dispatch({ type: types.RECEIVE_CONTACTS_FAILURE, payload: { error: err } });
      }
    });
  }
}

export function fetchContacts() {
  return (dispatch: any) => {
    Contacts.getAll((err, contacts) => {
        dispatch({
          type: types.RECEIVE_CONTACTS,
          payload: {
            contacts
          }
        })
    });
  };
}

export function loadFriends() {
  return (dispatch: any) => {
    return Promise.resolve()
      .then(() => dispatch(loadInstagramFriends()))
      .catch(error => {
        log.trace(error);
        log.error(error);
      });
  }
}

export function loadInstagramFriends() {
  return (dispatch: any, getState: any) => {
    return Promise.resolve()
      .then(() => {
        const { instagram } = getState();
        return instagramClient.getFriends(instagram.accessToken);
      })
      .then(friends => {
        dispatch({
          type: types.RECEIVE_INSTAGRAM_FRIENDS,
          payload: {
            friends
          }
        })
      })
      .catch(error => {
        log.trace(error);
        log.error(error);
      });
  }
}

export function loadInitialData(code: string) {
  return (dispatch: any) => {
    return Promise.resolve()
      .then(() => dispatch(loadInitialInstagramData(code)))
      .then(() => dispatch(loadInitialFamelabData()))
      .catch(error => {
        log.trace(error);
        log.error(error);
      });
  };
}

export function loadInitialInstagramData(code: string): Promise<Action> {
  return (dispatch, getState) => {
    return Promise.resolve()
      .then(() => instagramClient.getAccessTokenForCode(code))
      .then(accessToken => Promise.join(
        accessToken,
        instagramClient.findCurrentUser(accessToken)
      ))
      .spread((
        accessToken: string,
        user: InstagramUserObject
      ) => {
        return dispatch({
          type: types.LOGIN,
          payload: { accessToken, user }
        });
      })
      .catch(error => {
        log.trace(error);
        log.error(error)
      });
  };
}

export function loadInitialFamelabData() {
  return (dispatch, getState) => {
    return Promise.resolve()
      .then(() => {
        const { instagram } = getState();
        return famelabLogin(instagram.user, instagram.accessToken);
      })
      .then(famelabUser => {
        const { instagram } = getState();
        return Promise.join(
          famelabUser,
          loadFamelabUserContent(instagram.user, instagram.accessToken)
        );
      })
      .spread((user, content) => {
        return dispatch({
          type: types.LOAD_FAMELAB_USER_CONTENT,
          payload: {
            user,
            content
          }
        });
      })
      .catch(error => {
        log.trace(error);
        log.error(error);
      });
  };
}

export function loadLeaderboardData(term: 'all' | 'year' | 'month' | 'today') {
  return (dispatch, getState) => {
    return Promise.resolve()
      .then(() => {
        const { instagram } = getState();
        return famelabRequest({
          user: instagram.user,
          accessToken: instagram.accessToken,
          url: `https://famelab-api.appspot.com/charts/top?term=${term}`
        });
      })
      .then(leaderboardData => {
        return dispatch({
          type: types.LOAD_LEADERBOARD,
          payload: {
            leaderboardData
          }
        });
      })
      .catch(error => {
        log.trace(error);
        log.error(error);
      });
  };
}

export function loadUserImages(): Promise<Action> {
  return (dispatch, getState) => {
    return Promise.resolve()
      .then(() => {
        const { instagram } = getState();
        return instagramClient.findUserRecentImages(instagram.accessToken);
      })
      .then((images: InstagramImageObjectList) => {
        return dispatch({
          type: types.LOAD_INSTAGRAM_IMAGES,
          payload: {
            images
          }
        });
      })
      .catch(error => {
        log.trace(error);
        log.error(error)
      });
  };
}

export function loadInstagramMediaById(id: string): Promise<Action> {
  return (dispatch, getState) => {
    return Promise.resolve()
      .then(() => {
        const { instagram } = getState();
        return Promise.join(
          instagramClient.getImageAndCommentsByid(instagram.accessToken, id),
          getContentCommentDetails(instagram.user, instagram.accessToken, id)
        );
      })
      .spread(({ image, comments }, commentDetails) => {
        return dispatch({
          type: types.LOAD_MEDIA_AND_COMMENTS,
          payload: {
            image,
            comments,
            commentDetails
          }
        });
      })
      .catch(error => {
        log.trace(error);
        log.error(error)
      });
  };
}

export function getContentCommentDetails(user: InstagramUserObject, accessToken: string, contentId: string) {
  return Promise.resolve()
    .then(() => {
      const query = qs.stringify({
          content_id: contentId
      });
      return famelabRequest({
        user,
        accessToken,
        url: `https://famelab-api.appspot.com/comments?${query}`
      });
    })
    .catch(error => {
      log.trace(error);
      log.error(error)
    });
}

export function likeInstagramMedia(mediaId: string): Promise<Action> {
  return (dispatch, getState) => {
    return Promise.resolve()
      .then(() => {
        const { instagram } = getState();
        return instagramClient.likeMedia(instagram.accessToken, mediaId);
      })
      .then(() => {
        return dispatch({
          type: types.LIKE_INSTAGRAM_MEDIA,
          payload: {
              mediaId
          }
        });
      })
      .catch(error => {
        log.trace(error);
        log.error(error)
      });
  };
}

export function createInstagramComment(mediaId: string, text: string): Promise<Action> {
  return (dispatch, getState) => {
    return Promise.resolve()
      .then(() => {
        const { instagram } = getState();
        return instagramClient.createComment(instagram.accessToken, mediaId, text);
      })
      .then(comment => {
        return dispatch({
          type: types.CREATE_INSTAGRAM_COMMENT,
          payload: {
              mediaId,
              comment
          }
        });
      })
      .catch(error => {
        log.trace(error);
        log.error(error)
      });
  };
}


export function likeComment(contentId: string, commentId: string) {
    return (dispatch, getState) => {
      dispatch({
        type: types.WILL_LIKE_COMMENT,
        payload: {
          commentId,
          contentId
        }
      });
      return Promise.resolve()
        .then(() => {
          const { instagram } = getState();
          return famelabRequest({
            user: instagram.user,
            accessToken: instagram.accessToken,
            url: 'https://famelab-api.appspot.com/comments/like',
            method: 'POST',
            body: {
                comment_id: commentId,
                content_id: contentId
            }
          });
        })
        .then(body => {
          if (body.status && body.status === 'error') {
            throw new Error(body.message);
          }
          return dispatch({
            type: types.LIKE_COMMENT,
            payload: {
              commentId,
              contentId
            }
          });
        })
        .catch(error => {
          log.trace(error);
          log.error(error)
        });
    };
}

export function unlikeComment(contentId: string, commentId: string) {
    return (dispatch, getState) => {
      dispatch({
        type: types.WILL_UNLIKE_COMMENT,
        payload: {
          commentId,
          contentId
        }
      });
      return Promise.resolve()
        .then(() => {
          const { instagram } = getState();
          const query = qs.stringify({
              comment_id: commentId,
              content_id: contentId
          });
          return famelabRequest({
            user: instagram.user,
            accessToken: instagram.accessToken,
            url: `https://famelab-api.appspot.com/comments/like?${query}`,
            method: 'DELETE'
          });
        })
        .then(body => {
          if (body.status && body.status === 'error') {
            throw new Error(body.message);
          }
          return dispatch({
            type: types.UNLIKE_COMMENT,
            payload: {
              commentId,
              contentId
            }
          });
        })
        .catch(error => {
          log.trace(error);
          log.error(error)
        });
    };
}

export function promotePost(mediaId: string, numComments: number) {
    return (dispatch, getState) => {
      return Promise.resolve()
        .then(() => {
          const { instagram } = getState();
          return famelabRequest({
            user: instagram.user,
            accessToken: instagram.accessToken,
            url: 'https://famelab-api.appspot.com/content',
            method: 'POST',
            body: {
                source: 'instagram',
                source_id: mediaId,
                num_comments: numComments
            }
          });
        })
        .then(body => {
          if (body.status && body.status === 'error') {
            throw new Error(body.message);
          }
          return dispatch({
            type: types.PROMOTE_POST,
            payload: {
                mediaId,
                numComments,
                body
            }
          });
        })
        .catch(error => {
          log.trace(error);
          log.error(error)
        });
    };
}

export function loadFamelabUserContent(user: InstagramUserObject, accessToken: string) {
  return Promise.resolve()
    .then(() => famelabRequest({
      user,
      accessToken,
      url: 'https://famelab-api.appspot.com/content/fetch'
    }))
    .catch(error => {
      log.trace(error);
      log.error(error)
    });
}
