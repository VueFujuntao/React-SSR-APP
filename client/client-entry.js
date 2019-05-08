import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";

import Store from "./redux/index.js";
import App from './app.jsx';

const initState = window.__INITIAL__STATE__ || {};
const newStore = createStore(
  Store,
  initState,
  compose(
    applyMiddleware(thunk),
    // react 谷歌浏览器控件 用来调试用的 需要自己安装 不然是不启动的
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  )
);

const RenderComponent = Component => {
  ReactDOM.render(
    <Provider store={newStore}>
      <Component />
    </Provider>,
    document.getElementById('app')
  )
}

RenderComponent(App)

if (module.hot) {
   module.hot.accept('./app.jsx', () => {
    const NextApp = require('./app.jsx').default;
    RenderComponent(NextApp)
  })
}