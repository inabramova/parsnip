import React from 'react';
import { connect } from 'react-redux';
import { TASK_STATUSES } from '../constants';

export const Task = props => {
  function onStatusChange(e) {
    props.onStatusChange(props.task.id, e.target.value);
  }
  return (
    <div className="task">
      <div className="task-header">
        <div>{props.task.title}</div>
        <div className="select-style">
          <select value={props.task.status} onChange={onStatusChange}>
            {Object.values(TASK_STATUSES).map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      <hr />
      <div className="task-body">{props.task.description}</div>
      <div className="task-timer">{props.task.timer}s</div>
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    task: state.tasks.items[ownProps.taskId],
  };
}

export default connect(mapStateToProps)(Task);
