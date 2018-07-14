
export type RequestOptions = {
  user: InstagramUserObject;
  accessToken: string;
  url: string;
  method?: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE',
  body?: any;
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
