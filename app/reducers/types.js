
/* @flow */

import type { List } from 'immutable';

export type PhoneNumberObject = {
  label: string;
  number: string;
};

export type ContactObject = {
  familyName: string;
  givenName: string;
  hasThumbnail: boolean;
  recordID: string;
  thumbnailPath: string;
  phoneNumbers: [PhoneNumberObject]
};

export type ReceiveContactsPayload = {
  contacts: List<ContactObject>
};

export type FamelabUser = {
  full_name: string;
  id: string;
  instagram_username: string;
  instagram_uuid: string;
  level: string;
  points: number;
  profile_picture: string;
};

export type ContentItem = {
  id: string,
  source: 'instagram',
  source_id: string;
};

export type FetchContentPayload = {
  content: [ContentItem];
  user: any;
};

export type LoadLeaderboardPayload = {
  leaderboardData: [any];
}

export type State = {
  content: [ContentItem];
  user?: any;
  leaderboardData: [any];
  contacts: List<ContactObject>;
};
