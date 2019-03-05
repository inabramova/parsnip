import { normalize, schema } from 'normalizr';
import * as api from '../api';

const taskSchema = new schema.Entity('tasks');
const projectSchema = new schema.Entity('projects', {
  tasks: [taskSchema],
});

function fetchTasksFailed(error) {
  return {
    type: 'FETCH_TASKS_FAILED',
    payload: {
      error,
    },
  };
}

export function fetchTasksSucceeded(tasks) {
  return {
    type: 'FETCH_TASKS_SUCCEEDED',
    payload: {
      tasks,
    },
  };
}

export function fetchTasksStarted() {
  return {
    type: 'FETCH_TASKS_STARTED',
  };
}

export function fetchTasks() {
  return dispatch => {
    dispatch(fetchTasksStarted());
    api
      .fetchTasks()
      .then(resp => {
        setTimeout(() => {
          dispatch(fetchTasksSucceeded(resp.data));
        }, 2000);
      })
      .catch(err => {
        dispatch(fetchTasksFailed(err.message));
      });
  };
}

function fetchProjectsStarted(boards) {
  return { type: 'FETCH_PROJECTS_STARTED', payload: { boards } };
}

function fetchProjectsSucceeded(projects) {
  return { type: 'FETCH_PROJECTS_SUCCEEDED', payload: { projects } };
}

function fetchProjectsFailed(err) {
  return { type: 'FETCH_PROJECTS_FAILED', payload: err };
}

function createTaskSucceeded(task) {
  return {
    type: 'CREATE_TASK_SUCCEEDED',
    payload: {
      task,
    },
  };
}

export function createTask({
  projectId,
  title,
  description,
  status = 'Unstarted',
}) {
  return dispatch => {
    api.createTask({ projectId, title, description, status }).then(resp => {
      dispatch(createTaskSucceeded(resp.data));
    });
  };
}

function editTaskSucceeded(task) {
  return {
    type: 'EDIT_TASK_SUCCEEDED',
    payload: { task },
  };
}

function progressTimerStart(taskId) {
  return { type: 'TIMER_STARTED', payload: { taskId } };
}

function progressTimerStopped(taskId) {
  return { type: 'TIMER_STOPPED', payload: { taskId } };
}

export function editTask(id, params = {}) {
  return (dispatch, getState) => {
    const task = getState().tasks.items[id];
    const updatedTask = Object.assign({}, task, params);
    api.editTask(id, updatedTask).then(resp => {
      dispatch(editTaskSucceeded(resp.data));
      if (resp.data.status === 'In Progress') {
        return dispatch(progressTimerStart(resp.data.id));
      }
      if (task.status === 'In Progress') {
        return dispatch(progressTimerStopped(task.id));
      }
    });
  };
}

export function filterTasks(tasksSearchTerm) {
  return { type: 'FILTER_TASKS', payload: { tasksSearchTerm } };
}

function getTaskById(tasks, id) {
  return tasks.find(task => task.id === id);
}

export function setCurrentProjectId(id) {
  return {
    type: 'SET_CURRENT_PROJECT_ID',
    payload: {
      id,
    },
  };
}

function receiveEntities(entities) {
  return {
    type: 'RECEIVE_ENTITIES',
    payload: entities,
  };
}

export function fetchProjects() {
  return (dispatch, getState) => {
    dispatch(fetchProjectsStarted());

    return api
      .fetchProjects()
      .then(resp => {
        const projects = resp.data;

        const normalizedData = normalize(projects, [projectSchema]);

        dispatch(receiveEntities(normalizedData));

        if (!getState().page.currentProjectId) {
          const defaultProjectId = projects[0].id;
          dispatch(setCurrentProjectId(defaultProjectId));
        }
      })
      .catch(err => {
        fetchProjectsFailed(err);
      });
  };
}
