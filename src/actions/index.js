import * as api from "../api";

let _id = 1;
export function uniqueId() {
  return _id++;
}
function fetchTasksFailed(error) {
  return {
    type: "FETCH_TASKS_FAILED",
    payload: {
      error
    }
  };
}

export function fetchTasksSucceeded(tasks) {
  return {
    type: "FETCH_TASKS_SUCCEEDED",
    payload: {
      tasks
    }
  };
}

export function fetchTasksStarted() {
  return {
    type: "FETCH_TASKS_STARTED"
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

function createTaskSucceeded(task) {
  return {
    type: "CREATE_TASK_SUCCEEDED",
    payload: {
      task
    }
  };
}

export function createTask({ title, description, status = "Unstarted" }) {
  return dispatch => {
    api.createTask({ title, description, status }).then(resp => {
      dispatch(createTaskSucceeded(resp.data));
    });
  };
}

function editTaskSucceeded(task) {
  return {
    type: "EDIT_TASK_SUCCEEDED",
    payload: { task }
  };
}

function progressTimerStart(taskId) {
  return { type: "TIMER_STARTED", payload: { taskId } };
}

function progressTimerStopped(taskId) {
  return { type: "TIMER_STOPPED", payload: { taskId } };
}

export function editTask(id, params = {}) {
  return (dispatch, getState) => {
    const task = getTaskById(getState().tasks.tasks, id);
    const updatedTask = Object.assign({}, task, params);
    api.editTask(id, updatedTask).then(resp => {
      dispatch(editTaskSucceeded(resp.data));
      if (resp.data.status === "In Progress") {
        return dispatch(progressTimerStart(resp.data.id));
      }
      if (task.status === "In Progress") {
        return dispatch(progressTimerStopped(task.id));
      }
    });
  };
}

export function filterTasks(searchTerm){
  return {type:"FILTER_TASKS", payload:{searchTerm}};
}

function getTaskById(tasks, id) {
  return tasks.find(task => task.id === id);
}
