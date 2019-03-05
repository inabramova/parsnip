import React, { Component } from 'react';
import TaskList from './TaskList';

class TasksPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewCardForm: false,
      title: '',
      description: '',
    };
  }

  onSearch = e => {
    console.log('search term ', e.target.value);
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
    this.props.onCreateTask({
      title: this.state.title,
      description: this.state.description,
    });
    this.resetForm();
  };

  toggleForm = () => {
    this.setState({ showNewCardForm: !this.state.showNewCardForm });
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
          onStatusChange={this.props.onStatusChange}
        />
      );
    });
  }

  render() {
    return (
      <div className="tasks">
        <div className="tasks-header">
          <input type="text" placeholder="search.." onChange={this.onSearch} />
          <button className="button button-default" onClick={this.toggleForm}>
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

export default TasksPage;
