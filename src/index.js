import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';

import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootSaga from './sagas';

import { tasks, projects, page } from './reducers';
import ConnectedApp from './App';
import './index.css';

/*
//alternative way hooking up devTools
const enhancers = compose(
  window.devToolsExtension ? window.devToolsExtension : f => f
);

const store = createStore(tasks, defaultState, enhancers); */

const rootReducer = (state = {}, action) => ({
  tasks: tasks(state.tasks, action),
  projects: projects(state.projects, action),
  page: page(state.page, action),
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('./App').default;
    ReactDOM.render(
      <Provider store={store}>
        <NextApp />
      </Provider>,
      document.getElementById('root')
    );
  });
}

if (module.hot) {
  module.hot.accept('./reducers', () => {
    // eslint-disable-next-line global-require
    const nextRootReducer = require('./reducers').default;
    store.replaceReducer(nextRootReducer);
  });
}
