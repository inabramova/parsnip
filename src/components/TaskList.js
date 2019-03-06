import React from 'react';
import ConnectedTask from './Task';

const TaskList = props => (
  <div className="task-list">
    <div className="task-list-title">
      <strong>{props.status}</strong>
    </div>
    {props.taskIds.map(taskId => (
      <ConnectedTask
        key={taskId}
        taskId={taskId}
        onStatusChange={props.onStatusChange}
      />
    ))}
  </div>
);

export default TaskList;
