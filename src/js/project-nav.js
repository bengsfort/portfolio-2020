'use strict';

const ACTIVE_CLASS = 'active';

const projects = {};
let activeProject = null;

export const openProject = (id) => {
  activeProject.classList.remove(ACTIVE_CLASS);
  activeProject = projects[id];
  activeProject.classList.add(ACTIVE_CLASS);
}

const projectNav = () => {
  const projs = document.getElementsByClassName('project-page');
  const count = projs.length;
  for (let i = 0, project, slug; i < count; i++) {
    project = projs[i];
    slug = project.id;
    projects[slug] = project;
  }
};

export default projectNav;
