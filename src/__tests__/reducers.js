import { tasks, projects } from '../reducers';

describe(' tasks reducer', () => {
  const initialState = {
    items: {},
    isLoading: false,
    error: null,
  };

  it('should return the initialState', () => {
    expect(tasks(undefined, {})).toEqual(initialState);
  });

  it('should handle the FETCH_TASKS_STARTED action', () => {
    const action = { type: 'FETCH_TASKS_STARTED' };
    const expectedState = { ...initialState, isLoading: true };

    expect(tasks(initialState, action)).toEqual(expectedState);
  });

  it('should handle the FETCH_TASKS_SUCCEEDED action', () => {
    const taskList = [{ title: 'Test the reducer', description: 'Very meta' }];
    const action = {
      type: 'FETCH_TASKS_SUCCEEDED',
      payload: { tasks: taskList },
    };
    const expectedState = { ...initialState, tasks: taskList };

    expect(tasks({ ...initialState, isLoading: true }, action)).toEqual(
      expectedState
    );
  });
  it('should add task oncreate', () => {
    const state = tasks(
      {
        items: {
          '1': {
            id: 1,
            title: 'Learn Redux',
            description: 'The store, actions, and reducers, oh my!',
            status: 'Unstarted',
            timer: 122,
            projectId: 1,
          },
        },
        isLoading: false,
        error: null,
      },
      {
        type: 'CREATE_TASK_SUCCEEDED',
        payload: {
          task: {
            projectId: 1,
            title: 'sdfsadf',
            description: 'adfsdf',
            status: 'Unstarted',
            timer: 0,
            id: 9,
          },
        },
      }
    );
    expect(state).toEqual({
      items: {
        '1': {
          id: 1,
          title: 'Learn Redux',
          description: 'The store, actions, and reducers, oh my!',
          status: 'Unstarted',
          timer: 122,
          projectId: 1,
        },
        '9': {
          projectId: 1,
          title: 'sdfsadf',
          description: 'adfsdf',
          status: 'Unstarted',
          timer: 0,
          id: 9,
        },
      },
      isLoading: false,
      error: null,
    });
  });
});

describe('projects reducer', () => {
  const state = projects(
    {
      items: {
        '1': { id: 1, name: 'Short-Term Goals', tasks: [1, 3, 4, 5, 6, 8] },
        '2': { id: 2, name: 'Long-Term Goals', tasks: [2, 7] },
      },
      isLoading: false,
      error: null,
    },
    {
      type: 'CREATE_TASK_SUCCEEDED',
      payload: {
        task: {
          projectId: 1,
          title: 'sdfsadf',
          description: 'adfsdf',
          status: 'Unstarted',
          timer: 0,
          id: 9,
        },
      },
    }
  );
  expect(state).toEqual({
    items: {
      '1': { id: 1, name: 'Short-Term Goals', tasks: [1, 3, 4, 5, 6, 8, 9] },
      '2': { id: 2, name: 'Long-Term Goals', tasks: [2, 7] },
    },
    isLoading: false,
    error: null,
  });
});
