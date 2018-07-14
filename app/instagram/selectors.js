
/* @flow */

import type { State } from './types';

type AppState = {
  instagram: State;
};

export function getUser({ instagram }: AppState): any {
  return instagram.user;
}

export function getImages({ instagram }: AppState): any {
  return instagram.images;
}

export function getComments({ instagram }: AppState): any {
  return instagram.comments;
}

export function getInstagramAccessToken({ instagram }: AppState): string {
    return instagram.accessToken;
}

export function getCommentDetails({ instagram }: AppState) {
  return instagram.commentDetails;
}

export function getFriends({ instagram }: AppState) {
  return instagram.friends;
}
