import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { render } from 'react-dom';

import App from './components/App';
import todoApp from './reducers';


render(
  <Provider store={createStore(todoApp)}>
    <App />
  </Provider>,
  document.getElementById('app')
);
