
/* @flow */

import InstagramClient from './InstagramClient';

export const IG_BASE_URL = 'https://api.instagram.com';
export const IG_ACCOUNT_LOGIN_URL = 'https://www.instagram.com/accounts/login';
export const IG_OAUTH_AUTH_PATH = `/oauth/authorize`;
export const IG_OAUTH_TOKEN_URL = `${IG_BASE_URL}/oauth/access_token`;
export const IG_USERS_URL = `${IG_BASE_URL}/v1/users`;
export const IG_MEDIA_URL = `${IG_BASE_URL}/v1/media`;
export const IG_RESULT_LIMIT = 100;

export const instagramClient = new InstagramClient({
  clientId: '46a9f3befb454307b55031fc4496a650',
  clientSecret: 'd9a79b56f8ac48ce86651afee7a3e49c',
  redirectURI: 'https://famelab.com'
});
