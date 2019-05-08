import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import App from './app.jsx';
import Store from './redux/index.js';

export const newStore = createStore(
  Store,
  compose(
    applyMiddleware(thunk)
  )
);

export default (routerContext, url, oldStore) => (
  <Provider store={oldStore}>
    <App />
  </Provider>
)
