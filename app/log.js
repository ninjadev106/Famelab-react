
/* @flow */

export default {
  info(...args: [any]) {
    console.error(`[INFO]: ${JSON.stringify(args)}`);
  },

  debug(...args: [any]) {
    console.error(`[DEBUG]: ${JSON.stringify(args)}`);
  },

  error(...args: [any]) {
    console.error(...args);
  },

  trace(error: Error) {
    console.trace(error);
  }
};
