
/* @flow */

import React, { Component } from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { reducer as instagramReducer } from '../instagram';
import appReducer from '../reducers';
import Root from './root';
import { createLogger } from 'redux-logger';

const logger = createLogger();
const reducers = combineReducers({
  instagram: instagramReducer,
  app: appReducer
});
const store = createStore(reducers, applyMiddleware(thunk, logger));

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}
