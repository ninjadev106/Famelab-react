
/* @flow */

import { encode } from 'base-64';

import type { InstagramUserObject,
              InstagramImageObjectList } from '../instagram';

export function famelabLogin(user: InstagramUserObject, accessToken: string) {
  return Promise.resolve()
    .then(() => {
      return famelabRequest({
        user,
        accessToken,
        url: 'https://famelab-api.appspot.com/users/me'
      })
    });
}

export function famelabRequest({ user, accessToken, url, body, method = 'GET' }: RequestOptions) {
  const request = () => {
    return fetch(url, {
        headers: {
          'Authorization': `Basic ${encode(`${user.id}:${accessToken}`)}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        method: method,
        body: body && JSON.stringify(body),
    });
  };
  return Promise.resolve()
    .then(() => request())
    .then(res => {
      if (res.status !== 200) {
        return famelabLoginFailure(res, user, request);
      }
      return res.json();
    });
}

function famelabLoginFailure(res: Response, user: InstagramUserObject, request: () => void) {
  return Promise.resolve()
    .then(() => res.json())
    .then(body => {
      if (body.reason === 'no_matching_uuid') {
        return createFamelabUser(user)
          .then(() => request())
          .then(res2 => res2.json());
      }
      return body;
    })
}


function createFamelabUser(user: InstagramUserObject) {
  return Promise.resolve()
    .then(() => {
      return fetch('https://famelab-api.appspot.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: user.full_name,
          instagram_uuid: user.id,
          profile_picture: user.profile_picture,
          instagram_username: user.username
        })
      })
    })
    .then(res => res.json())
}
