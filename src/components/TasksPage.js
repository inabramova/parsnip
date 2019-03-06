import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createTask, editTask, filterTasks } from '../actions';
import TaskList from './TaskList';
import { getGroupedAndFilteredTasks } from '../reducers';

class TasksPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewCardForm: false,
      title: '',
      description: '',
    };
  }

  onCreateTask = ({ title, description }) => {
    this.props.dispatch(
      createTask({ title, description, projectId: this.props.currentProjectId })
    );
  };

  onStatusChange = (id, status) => {
    this.props.editTask(id, { status, projectId: this.props.currentProjectId });
  };

  onSearch = e => {
    this.props.onSearch(e.target.value);
  };

  onTitleChange = e => {
    this.setState({ title: e.target.value });
  };

  onDescriptionChange = e => {
    this.setState({ description: e.target.value });
  };

  onCreateTask = e => {
    e.preventDefault();
    this.props.createTask({
      title: this.state.title,
      description: this.state.description,
    });
    this.resetForm();
  };

  toggleForm = () => {
    this.setState(prevstate => ({
      showNewCardForm: !prevstate.showNewCardForm,
    }));
  };

  resetForm() {
    this.setState({
      showNewCardForm: false,
      title: '',
      description: '',
    });
  }

  renderTaskLists() {
    if (this.props.isLoading) {
      return <div className="tasks-loading">Loading...</div>;
    }
    const { tasks } = this.props;
    return Object.keys(tasks).map(status => {
      const statusTasks = tasks[status];
      return (
        <TaskList
          key={status}
          status={status}
          tasks={statusTasks}
          onStatusChange={this.onStatusChange}
        />
      );
    });
  }

  render() {
    return (
      <div className="tasks">
        <div className="tasks-header">
          <input type="text" placeholder="search.." onChange={this.onSearch} />
          <button
            type="button"
            className="button button-default"
            onClick={this.toggleForm}
          >
            + New task
          </button>
        </div>
        {this.state.showNewCardForm && (
          <form className="task-list-form" onSubmit={this.onCreateTask}>
            <input
              className="full-width-input"
              onChange={this.onTitleChange}
              value={this.state.title}
              type="text"
              placeholder="title"
            />
            <input
              className="full-width-input"
              onChange={this.onDescriptionChange}
              value={this.state.description}
              type="text"
              placeholder="description"
            />
            <button className="button" type="submit">
              Save
            </button>
          </form>
        )}

        <div className="task-lists">{this.renderTaskLists()}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isLoading } = state.projects;

  return {
    isLoading,
    tasks: getGroupedAndFilteredTasks(state),
    currentProjectId: state.page.currentProjectId,
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createTask,
      editTask,
      onSearch: filterTasks,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TasksPage);
