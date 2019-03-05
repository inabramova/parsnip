import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createTask } from './index';
import * as api from '../api';

jest.unmock('../api');

api.createTask = jest.fn(
  () => new Promise((resolve, reject) => resolve({ data: 'foo' }))
);

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('createTask', () => {
  it('works', () => {
    const expectedActions = [
      { type: 'CREATE_TASK_STARTED' },
      { type: 'CREATE_TASK_SUCCEEDED', payload: { task: 'foo' } },
    ];

    const store = mockStore({
      tasks: {
        tasks: [],
      },
    });

    store.dispatch(createTask({})).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(api.createTask).toHaveBeenCalled();
    });
  });
});
