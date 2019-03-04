import React, { Component } from "react";
import { connect } from "react-redux";
import TasksPage from "./components/TasksPage";
import FlashMessage from "./components/FlashMessage";
// import { createTask, editTask, fetchTasks } from "./actions";
import { createTask, editTask, fetchTasksStarted, filterTasks } from "./actions";
import { tasksByStatus } from './reducers';

class App extends Component {
  componentDidMount() {
    this.props.dispatch(fetchTasksStarted());
  }
  onCreateTask = ({ title, description }) => {
    this.props.dispatch(createTask({ title, description }));
  };

  onStatusChange = (id, status) => {
    this.props.dispatch(editTask(id, { status }));
  };

  onSearch = searchTerm => {
    this.props.dispatch(filterTasks(searchTerm));
  }

  render() {
    return (
      <div className="container">
        {this.props.error && <FlashMessage message={this.props.error} />}
        <div className="main-content">
          <TasksPage
            tasks={this.props.tasks}
            onCreateTask={this.onCreateTask}
            onStatusChange={this.onStatusChange}
            isLoading={this.props.isLoading}
            onSearch = {this.onSearch}
          />
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  const {isLoading, error} = state.tasks;
  return { tasks:tasksByStatus(state), isLoading, error };
}

export default connect(mapStateToProps)(App);
