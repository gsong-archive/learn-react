import { createStore } from 'redux';

import { Observable } from 'rxjs-es6';

import todoApp from './reducers';
import { loadState, saveState } from './localStorage';


const configureStore = () => {
  const persistedState = loadState();
  const store = createStore(todoApp, persistedState);
  const store$ = Observable.create(obs =>
    store.subscribe(() => obs.next(store.getState()))
  )
    .throttleTime(1000);

  store$.subscribe((state) => saveState({ todos: state.todos }));

  return store;
};

export default configureStore;
