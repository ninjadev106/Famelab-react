/* @flow */

import Promise from 'bluebird';
import qs from 'querystring';
import map from 'lodash/map';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import times from 'lodash/times';
import { List } from 'immutable';

import log from '../log';
import { IG_BASE_URL,
         IG_OAUTH_AUTH_PATH,
         IG_ACCOUNT_LOGIN_URL,
         IG_OAUTH_TOKEN_URL,
         IG_USERS_URL,
         IG_RESULT_LIMIT,
         IG_MEDIA_URL } from './constants';

import type { InstagramUserObject,
              InstagramCountsObject,
              InstagramImageObject,
              InstagramImageObjectList } from './types';

type ConfigObject = {
   clientId: string;
   clientSecret: string;
   redirectURI: string;
};

export default class InstagramClient {

    config: ConfigObject;

    constructor(config: ConfigObject) {
        this.config = config;
    }

    getAuthorizeURL() {
        const { clientId, redirectURI } = this.config;
        const query = qs.stringify({
            client_id: clientId,
            redirect_uri: redirectURI,
            response_type: 'code',
            scope: 'public_content comments'
        });
        const next = encodeURIComponent(`${IG_OAUTH_AUTH_PATH}?${query}`);
        return `${IG_ACCOUNT_LOGIN_URL}?next=${next}`;
    }

    getAccessTokenForCode(code: string): Promise<string> {
        const { clientId, clientSecret, redirectURI } = this.config;
        const body = qs.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectURI,
            grant_type: 'authorization_code',
            code: code
        });
        return Promise.resolve()
            .then(() => fetch(IG_OAUTH_TOKEN_URL, {
                method: 'POST',
                body: body,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }))
            .then(res => res.json())
            .then(res => {
                if (!res.access_token) {
                    throw new Error(
                        `Failed to get instagram access_token from
                         authorization request. Response body was
                         ${JSON.stringify(res)}`);
                }
                return res.access_token;
            })
            .catch(error => {
                log.error('Failed to get access token.');
                log.trace(error);
                throw error;
            });
    }

    getFriends(accessToken: string) {
      const query = qs.stringify({ 'access_token': accessToken });
      return Promise.resolve()
          .then(() => fetch(`${IG_USERS_URL}/self/follows?${query}`))
          .then(res => {
              if (res.status === 200) {
                  return res.json().then(json => json.data);
              }
              return res.json()
                  .then(errorRes => {
                      log.error(errorRes);
                      throw new Error(`Received error response from Instagram API: ${res.status}.`);
                  });
          })
          .catch(error => {
              log.error(`Failed to get follows with accessToken: "${accessToken}".`);
              log.trace(error);
              throw error;
          });
    }

    likeMedia(accessToken: string, mediaId: string): Promise {
      const query = qs.stringify({ 'access_token': accessToken });
      return Promise.resolve()
          .then(() => fetch(`${IG_MEDIA_URL}/${mediaId}/likes?${query}`, {
            method: 'POST'
          }))
          .then(res => {
              if (res.status === 200) {
                  return;
              }
              return res.json()
                  .then(errorRes => {
                      log.error(errorRes);
                      throw new Error(`Received error response from Instagram API: ${res.status}.`);
                  });
          })
          .catch(error => {
              log.error(`Failed to like media with accessToken: "${accessToken}" and mediaId "${mediaId}".`);
              log.trace(error);
              throw error;
          });
    }

    createComment(accessToken: string, mediaId: string, text: string): Promise {
      const query = qs.stringify({ 'access_token': accessToken });
      const body = qs.stringify({ text });
      return Promise.resolve()
          .then(() => fetch(`${IG_MEDIA_URL}/${mediaId}/comments?${query}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body
          }))
          .then(res => {
              if (res.status === 200) {
                  return;
              }
              return res.json()
                  .then(errorRes => {
                      log.error(errorRes);
                      throw new Error(`Received error response from Instagram API: ${res.status}.`);
                  });
          })
          .catch(error => {
              log.error(`Failed to like create comment with accessToken:
                "${accessToken}", mediaId "${mediaId}" and text "${text}".`);
              log.trace(error);
              throw error;
          });
    }

    findCurrentUser(accessToken: string): Promise<InstagramUserObject> {
        const query = qs.stringify({ 'access_token': accessToken });
        return Promise.resolve()
            .then(() => fetch(`${IG_USERS_URL}/self?${query}`))
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                        .then(this.receiveCurrentUser);
                }
                return res.json()
                    .then(errorRes => {
                        log.error(errorRes);
                        throw new Error(`Received error response from Instagram API: ${res.status}.`);
                    });
            })
            .catch(error => {
                log.error(`Failed to find current user with accessToken: "${accessToken}".`);
                log.trace(error);
                throw error;
            });
    }

    findUser(accessToken: string, handle: string): Promise<InstagramUserObject> {
        const query = qs.stringify({
            'access_token': accessToken,
            q: handle
        });
        return Promise.resolve()
            .then(() => fetch(`${IG_USERS_URL}/search?${query}`))
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                        .then(this.receiveUsers);
                }
                return res.json()
                    .then(errorRes => {
                        log.error(errorRes);
                        throw new Error(`Received error response from Instagram API: ${res.status}.`);
                    });
            })
            .catch(error => {
                log.error(`Failed to find users with accessToken: "${accessToken}"
                           and handle: "${handle}".`);
                log.trace(error);
                throw error;
            });
    }

    receiveCurrentUser(res: { data: {} }): Promise<InstagramUserObject> {
      return Promise.resolve()
          .then(() => {
              const user = res.data;
              if (!user) {
                  throw new Error('Failed to find current user.');
              }
              return user;
          });
    }

    receiveUsers(res: { data: {} }): Promise<InstagramUserObject> {
        return Promise.resolve()
            .then(() => {
                const users = res.data;
                if (!users || !users.length) {
                    throw new Error('Failed to find matching users.');
                }
                return users[0];
            });
    }

    findUserRecentImages(accessToken: string): Promise<InstagramImageObjectList> {
      const query = qs.stringify({ access_token: accessToken });
      return Promise.resolve()
          .then(igUser => fetch(`${IG_USERS_URL}/self/media/recent?${query}`))
          .then(res => {
              if (res.status === 200) {
                  return this.receivePaginatedImages(res);
              }
              return this.receiveInstagramError(res);
          })
          .catch(error => {
              log.error(`Failed to find user's recent images matching accessToken: "${accessToken}".`);
              log.trace(error);
              throw error;
          });
    }

    getImageById(accessToken: string, id: string): Promise {
      const query = qs.stringify({ access_token: accessToken });
      return Promise.resolve()
          .then(igUser => fetch(`${IG_MEDIA_URL}/${id}?${query}`))
          .then(res => {
              if (res.status === 200) {
                  return res.json();
              }
              return this.receiveInstagramError(res);
          })
          .then(body => body.data)
          .catch(error => {
              log.error(`Failed to find image with accessToken: "${accessToken}",
                         and id: "${id}".`);
              log.trace(error);
              throw error;
          });
    }

    getImageCommentsById(accessToken: string, id: string): Promise {
      const query = qs.stringify({ access_token: accessToken });
      return Promise.resolve()
          .then(igUser => fetch(`${IG_MEDIA_URL}/${id}/comments?${query}`))
          .then(res => {
              if (res.status === 200) {
                  return res.json();
              }
              return this.receiveInstagramError(res);
          })
          .then(body => new List(body.data))
          .catch(error => {
              log.error(`Failed to find media comments with accessToken: "${accessToken}",
                         and id: "${id}".`);
              log.trace(error);
              throw error;
          });
    }

    getImageAndCommentsByid(accessToken: string, id: string): Promise {
      return Promise.join(
        this.getImageById(accessToken, id),
        this.getImageCommentsById(accessToken, id)
      )
      .spread((image, comments) => ({
        image,
        comments
      }));
    }

    receivePaginatedImages(res: Response): Promise<InstagramImageObjectList> {
        return Promise.resolve()
            .then(() => res.json())
            .then(images => new List(images.data))
    }

    receiveInstagramError(res: Response): Promise {
        return Promise.resolve()
            .then(() => res.json())
            .then(errorRes => {
                log.error(errorRes);
                throw new Error(`Received error response from Instagram API: ${res.status}.`);
            });
    }

    receiveImagesByTag(images: [InstagramImageObject], tag: string) {
        const imagesByHandle = filter(images, image => includes(image.tags, tag));
        return new List(map(imagesByHandle, data => {
            return data.images.standard_resolution;
        }));
    }
}
