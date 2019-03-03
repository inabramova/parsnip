const initialState = {
  tasks: [],
  isLoading: false
};

export default function tasks(state = initialState, action) {
  switch (action.type) {
    case "CREATE_TASK": {
      return {
        tasks: state.tasks.concat(action.payload)
      };
    }
    case "EDIT_TASK_SUCCEEDED": {
      const { payload } = action;
      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task.id === payload.task.id) {
            return Object.assign({}, task, payload.task);
          }
          return task;
        })
      };
    }
    case "FETCH_TASKS_FAILED": {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    }
    case "FETCH_TASKS_STARTED": {
      return {
        ...state,
        isLoading: true
      };
    }
    case "FETCH_TASKS_SUCCEEDED": {
      return {
        ...state,
        isLoading: false,
        tasks: action.payload.tasks
      };
    }
    case "CREATE_TASK_SUCCEEDED": {
      return {
        ...state,
        tasks: state.tasks.concat(action.payload.task)
      };
    }
    case "TIMER_INCREMENT": {
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
