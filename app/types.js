

export type Payload = LoginPayload | {};

export type Action<T: Payload> = {
  type?: string;
  payload?: T;
};
