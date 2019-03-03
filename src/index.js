import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";

import { Provider } from "react-redux";
import thunk from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";

import { composeWithDevTools } from "redux-devtools-extension";

import tasksReducer from "./reducers";
import App from "./App";
import "./index.css";

/*
//alternative way hooking up devTools
const enhancers = compose(
  window.devToolsExtension ? window.devToolsExtension : f => f
);

const store = createStore(tasks, defaultState, enhancers); */

const rootReducer = (state = {}, action) => {
  return {
    tasks: tasksReducer(state.tasks, action)
  };
};

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    ReactDOM.render(
      <Provider store={store}>
        <NextApp />
      </Provider>,
      document.getElementById("root")
    );
  });
}

if (module.hot) {
  module.hot.accept("./reducers", () => {
    const nextRootReducer = require("./reducers").default;
    store.replaceReducer(nextRootReducer);
  });
}
