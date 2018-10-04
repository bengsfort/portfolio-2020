'use strict';

const ACTIVE_CLASS = 'active';

const projects = {};
let activeProject = null;

export const openProject = (id) => {
  closeProject();
  activeProject = projects[id];
  activeProject.classList.add(ACTIVE_CLASS);
  document.body.style.overflow = 'hidden';
}

export const closeProject = () => {
  if (activeProject) {
    activeProject.classList.remove(ACTIVE_CLASS);
    activeProject = null;
    document.body.style.overflow = 'inherit';
  }
}

const projectNav = () => {
  const projs = document.getElementsByClassName('project-page');
  const count = projs.length;
  for (let i = 0, project, slug, closeBtn; i < count; i++) {
    project = projs[i];
    slug = project.id;
    projects[slug] = project;
    // Find close button
    closeBtn = project.getElementsByClassName('project-close-btn')[0];
    if (closeBtn) {
      closeBtn.addEventListener('click', closeProject);
    }    
  }
};

export default projectNav;
