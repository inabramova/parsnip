import React from 'react';

const Header = props => {
  const projectOptions = props.projects.map(project => (
    <option key={project.id} value={project.id}>
      {project.name}
    </option>
  ));

  return (
    <div className="project-item">
      Project:
      <select onChange={props.onCurrentProjectChange} className="project-menu">
        {projectOptions}
      </select>
    </div>
  );
};

export default Header;
