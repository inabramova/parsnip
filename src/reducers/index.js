import { createSelector } from 'reselect';
import { TASK_STATUSES } from '../constants';

const initialState = {
  items: [],
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

export function projects(state = initialState, action) {
  switch (action.type) {
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
      const projectIndex = state.items.findIndex(
        project => project.id === task.projectId
      );
      const project = state.items[projectIndex];

      const nextProject = {
        ...project,
        tasks: project.tasks.concat(task),
      };

      return {
        ...state,
        items: [
          ...state.items.slice(0, projectIndex),
          nextProject,
          ...state.items.slice(projectIndex + 1),
        ],
      };
    }
    case 'EDIT_TASK_SUCCEEDED': {
      const { task } = action.payload;
      const projectIndex = state.items.findIndex(
        project => project.id === task.projectId
      );
      const project = state.items[projectIndex];
      const taskIndex = project.tasks.findIndex(t => t.id === task.id);

      const nextProject = {
        ...project,
        tasks: [
          ...project.tasks.slice(0, taskIndex),
          task,
          ...project.tasks.slice(taskIndex + 1),
        ],
      };

      return {
        ...state,
        items: [
          ...state.items.slice(0, projectIndex),
          nextProject,
          ...state.items.slice(projectIndex + 1),
        ],
      };
    }

    default: {
      return state;
    }
  }
}

export function tasks(state = initialState, action) {
  switch (action.type) {
    case 'CREATE_TASK': {
      return {
        tasks: state.tasks.concat(action.payload),
      };
    }
    case 'EDIT_TASK_SUCCEEDED': {
      const { payload } = action;
      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task.id === payload.task.id) {
            return Object.assign({}, task, payload.task);
          }
          return task;
        }),
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
      return {
        ...state,
        tasks: state.tasks.concat(action.payload.task),
      };
    }
    case 'FILTER_TASKS': {
      return { ...state, searchTerm: action.payload.searchTerm };
    }
    case 'TIMER_INCREMENT': {
      const nextTasks = state.tasks.map(task => {
        if (task.id === action.payload.taskId) {
          return { ...task, timer: task.timer + 1 };
        }
        return task;
      });

      return { ...state, tasks: nextTasks };
    }
    default: {
      return state;
    }
  }
}
const getSearchTerm = state => state.page.tasksSearchTerm;

const getTasksByProjectId = state => {
  if (!state.page.currentProjectId) {
    return [];
  }

  const currentProject = state.projects.items.find(
    project => project.id === state.page.currentProjectId
  );

  return currentProject.tasks;
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
