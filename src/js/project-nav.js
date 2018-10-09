'use strict';

const ACTIVE_CLASS = 'active';

const projects = {};
let activeProject = null;

// Sets the given project page to active.
export const openProject = (id) => {
  closeProject();
  activeProject = projects[id];
  activeProject.classList.add(ACTIVE_CLASS);
  document.body.style.overflow = 'hidden';
}

// Closes all active projects, if any.
export const closeProject = () => {
  if (activeProject) {
    activeProject.classList.remove(ACTIVE_CLASS);
    activeProject = null;
    document.body.style.overflow = 'inherit';
  }
}

// Main project navigation function.
const projectNav = () => {
  const projs = document.getElementsByClassName('project-page');
  const count = projs.length;
  
  // Iterates through all projects and adds them to the project cache
  for (let i = 0, project, slug; i < count; i++) {
    project = projs[i];
    slug = project.id;
    projects[slug] = project;
    // Find close button
    const closeBtn = project.getElementsByClassName('project-close-btn')[0];
    if (closeBtn) {
      closeBtn.addEventListener('click', closeProject);
    }
  }
};

export default projectNav;
