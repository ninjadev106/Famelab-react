
/* @flow */

import type { State, FamelabUser } from './types';

type AppState = {
  app: State;
};

export function getLeaderboardData({ app }: AppState) {
  return app.leaderboardData;
}

export function getFamelabUser({ app }: AppState): FamelabUser {
  return app.user;
}

export function getDashboardContent({ app }: AppState) {
  return app.content;
}

export function getDashboardComments({ app }: AppState) {

}

export function getContacts({ app }: AppState) {
  return app.contacts;
}
