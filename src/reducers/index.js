import { createSelector } from 'reselect';
import { TASK_STATUSES } from '../constants';

const initialTaskState = {
  items: {},
  isLoading: false,
  error: null,
};
const initialProjectState = {
  items: {},
  isLoading: false,
  error: null,
};
const initialPageState = {
  currentProjectId: null,
  tasksSearchTerm: '',
};

export function page(state = initialPageState, action) {
  switch (action.type) {
    case 'SET_CURRENT_PROJECT_ID': {
      return {
        ...state,
        currentProjectId: action.payload.id,
      };
    }
    case 'FILTER_TASKS': {
      return { ...state, tasksSearchTerm: action.tasksSearchTerm };
    }
    default: {
      return state;
    }
  }
}

export function projects(state = initialProjectState, action) {
  switch (action.type) {
    case 'RECEIVE_ENTITIES': {
      const { entities } = action.payload;
      if (entities && entities.projects) {
        return {
          ...state,
          isLoading: false,
          items: entities.projects,
        };
      }

      return state;
    }
    case 'FETCH_PROJECTS_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    }
    case 'FETCH_PROJECTS_STARTED': {
      return {
        ...state,
        isLoading: true,
      };
    }
    case 'FETCH_PROJECTS_SUCCEEDED': {
      return {
        ...state,
        isLoading: false,
        items: action.payload.projects,
      };
    }

    case 'CREATE_TASK_SUCCEEDED': {
      const { task } = action.payload;

      const project = state.items[task.projectId];

      return {
        ...state,
        items: {
          ...state.items,
          [task.projectId]: {
            ...project,
            tasks: project.tasks.concat(task.id),
          },
        },
      };
    }
    default: {
      return state;
    }
  }
}

export function tasks(state = initialTaskState, action) {
  switch (action.type) {
    case 'RECEIVE_ENTITIES': {
      const { entities } = action.payload;
      if (entities && entities.tasks) {
        return {
          ...state,
          isLoading: false,
          items: entities.tasks,
        };
      }

      return state;
    }
    case 'CREATE_TASK': {
      return {
        tasks: state.tasks.concat(action.payload),
      };
    }
    case 'EDIT_TASK_SUCCEEDED': {
      const { payload } = action;
      const task = state.items[payload.task.id];
      return {
        ...state,
        items: {
          ...state.items,
          [task.id]: Object.assign({}, task, payload.task),
        },
      };
    }
    case 'FETCH_TASKS_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    }
    case 'FETCH_TASKS_STARTED': {
      return {
        ...state,
        isLoading: true,
      };
    }
    case 'FETCH_TASKS_SUCCEEDED': {
      return {
        ...state,
        isLoading: false,
        tasks: action.payload.tasks,
      };
    }
    case 'CREATE_TASK_SUCCEEDED': {
      const { task } = action.payload;

      const nextTasks = {
        ...state.items,
        [task.id]: task,
      };

      return {
        ...state,
        items: nextTasks,
      };
    }
    case 'FILTER_TASKS': {
      return { ...state, searchTerm: action.payload.searchTerm };
    }
    case 'TIMER_INCREMENT': {
      const task = state.items[action.payload.taskId];
      const nextTask = { ...task, timer: task.timer + 1 };
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.taskId]: nextTask,
        },
      };
    }
    default: {
      return state;
    }
  }
}
const getSearchTerm = state => state.page.tasksSearchTerm;

const getTasksByProjectId = state => {
  const { currentProjectId } = state.page;
  if (!currentProjectId || !state.projects.items[currentProjectId]) {
    return [];
  }
  const taskIds = state.projects.items[state.page.currentProjectId].tasks;
  return taskIds.map(id => state.tasks.items[id]);
};

export const getFilteredTasks = createSelector(
  [getTasksByProjectId, getSearchTerm],
  (tasks, searchTerm) =>
    tasks.filter(task => task.title.match(new RegExp(searchTerm, 'i')))
);

export const getGroupedAndFilteredTasks = createSelector(
  [getFilteredTasks],
  tasks => {
    const grouped = {};
    TASK_STATUSES.forEach(status => {
      grouped[status] = tasks.filter(task => task.status === status);
    });
    return grouped;
  }
);

export const getProjects = state => Object.values(state.projects.items);
