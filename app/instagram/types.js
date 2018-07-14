
/* @flow */

import type { List, Map } from 'immutable';
import type { Action, Payload } from '../types';

export type InstagramComment = {
  from: InstagramUserObject;
  text: string;
  created_time: string;
  id: string;
};

export type CommentDetails = {
  comment_id: string;
  i_like: boolean;
  num_likes: string;
};

export type InstagramBasicImageObject = {
    height: number;
    width: number;
    url: string;
};

export type InstagramImageObject = {
    attribution: any;
    caption: {
      text: string;
    };
    comments: any;
    created_time: string;
    filter: string;
    id: string;
    images: {
      low_resolution: InstagramBasicImageObject;
      standard_resolution: InstagramBasicImageObject;
      thumbnail: InstagramBasicImageObject;
    },
    likes: any;
    link: string;
    location: any;
    tags: [any];
    type: string;
    user: InstagramUserObject;
    user_has_liked: any;
    users_in_photo: [any];
};

export type InstagramImageObjectList = List<InstagramImageObject>;
export type InstagramCommentMap = Map<string, InstagramComment>;
export type CommentDetailsList = List<CommentDetails>;

export type InstagramCountsObject = {
  followed_by: number;
  followeds: number;
  media: number;
};

export type InstagramUserObject = {
    bio: string;
    counts: InstagramCountsObject;
    full_name: string;
    id: string;
    profile_picture: string;
    username: string;
    website: string;
};

export type LoginPayload = {
  user: any;
  accessToken: string;
};

export type LoadImagesPayload = {
  images: InstagramImageObjectList;
}

export type LoadMediaAndCommentsPayload = {
  image: InstagramImageObject;
  comments: InstagramCommentMap;
}

export type State = {
  user: ?InstagramUserObject;
  images: InstagramImageObjectList;
  comments: InstagramCommentMap;
  commentDetails: CommentDetailsList;
  accessToken: string;
};
