import cloneDeep from 'lodash/cloneDeep';
import { stat } from 'fs';
import {
  getTasksByProjectId,
  getSearchTerm,
  getFilteredTasks,
} from '../reducers';

describe('tasks selectors', () => {
  const state = {
    tasks: {
      items: {
        '1': {
          id: 1,
          title: 'Learn Redux',
          description: 'The store, actions, and reducers, oh my!',
          status: 'Unstarted',
          timer: 122,
          projectId: 1,
        },
        '2': {
          id: 2,
          title: 'Peace on Earth',
          description: 'No big deal.',
          status: 'Completed',
          timer: 233,
          projectId: 2,
        },
        '3': {
          id: 3,
          title: 'Create Facebook for dogs',
          description: 'The hottest new social network',
          status: 'Completed',
          timer: 380,
          projectId: 1,
        },
        '4': {
          title: 'get new fish',
          description: 'also, clean the pond',
          status: 'Completed',
          id: 4,
          timer: 156,
          projectId: 1,
        },
        '5': {
          title: 'adfaf',
          description: 'adfadf',
          status: 'In Progress',
          id: 5,
          timer: 132,
          projectId: 1,
        },
        '6': {
          title: 'adfasf',
          description: 'adfadfasdf',
          status: 'Completed',
          id: 6,
          timer: 170,
          projectId: 1,
        },
        '7': {
          projectId: 2,
          title: 'fghfgh',
          description: 'fghfgh',
          status: 'Completed',
          id: 7,
          timer: 105,
        },
        '8': {
          projectId: 1,
          title: 'zxcvxcv',
          description: 'zxcvxccvb',
          status: 'Completed',
          timer: 31,
          id: 8,
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
    },
    projects: {
      items: {
        '1': {
          id: 1,
          name: 'Short-Term Goals',
          tasks: [1, 3, 4, 5, 6, 8, 9],
        },
        '2': {
          id: 2,
          name: 'Long-Term Goals',
          tasks: [2, 7],
        },
      },
      isLoading: false,
      error: null,
    },
    page: {
      currentProjectId: 1,
      tasksSearchTerm: 'red',
    },
  };

  afterEach(() => {
    getFilteredTasks.resetRecomputations();
  });

  it('should retrieve tasks from the getTasks selector', () => {
    expect(getTasksByProjectId(state).length).toEqual(7);
  });

  it('should retrieve the searchTerm from the getSearchTerm selector', () => {
    expect(getSearchTerm(state)).toEqual(state.page.tasksSearchTerm);
  });

  it('should return tasks from the getFilteredTasks selector', () => {
    const expectedTasks = [
      {
        id: 3,
        title: 'Create Facebook for dogs',
        description: 'The hottest new social network',
        status: 'Completed',
        timer: 380,
        projectId: 1,
      },
    ];
    const hottestState = cloneDeep(state);
    hottestState.page.tasksSearchTerm = 'faceboo';
    expect(getFilteredTasks(hottestState)).toEqual(expectedTasks);
  });

  it('should minimally recompute the state when getFilteredTasks is called', () => {
    const similarSearch = { ...state };
    console.log(state.page);
    similarSearch.page.tasksSearchTerm = 'red';
    console.log(similarSearch.page);
    const uniqueSearch = { ...state };
    uniqueSearch.page = { ...state.page, tasksSearchTerm: 'sel' };

    expect(getFilteredTasks.recomputations()).toEqual(0);
    getFilteredTasks(state);
    getFilteredTasks(state);
    expect(getFilteredTasks.recomputations()).toEqual(1);
    getFilteredTasks(uniqueSearch);
    expect(getFilteredTasks.recomputations()).toEqual(2);
  });
});
