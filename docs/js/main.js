(function () {
  'use strict';

  let grid = [];

  // Caches the positions (relative to the parent) of a list of items.
  const cacheGridLocations = (items) => {
    grid = []; // reset the grid
    const itemCount = items.length;
    for (let i = 0, item; i < itemCount; i++) {
      item = items[i];
      item.removeAttribute('style');
      grid.push({
        top: item.offsetTop,
        left: item.offsetLeft,
        height: item.offsetHeight,
        width: item.offsetWidth,
      });
    }
  };

  // Sets a given item to the grid position at the given index.
  const setGridItemPosition = (item, index) => {
    const position = grid[index];
    item.style.position = 'absolute';
    item.style.top = position.top + 'px';
    item.style.left = position.left + 'px';
    item.style.height = position.height + 'px';
    item.style.width = position.width + 'px';
  };

  const ACTIVE_CLASS = 'active';

  const projects = {};
  let activeProject = null;

  // Sets the given project page to active.
  const openProject = (id) => {
    closeProject();
    activeProject = projects[id];
    activeProject.classList.add(ACTIVE_CLASS);
    document.body.style.overflow = 'hidden';
  };

  // Closes all active projects, if any.
  const closeProject = () => {
    if (activeProject) {
      activeProject.classList.remove(ACTIVE_CLASS);
      activeProject = null;
      document.body.style.overflow = 'inherit';
    }
  };

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

  // Throttles a function so it doesn't go too wild
  const throttle = (time, fn) => {
    let timeout = -1;
    return (...args) => {
      if (timeout > -1) {
        return;
      }
      fn(...args);
      timeout = window.setTimeout(() => {
        timeout = -1;
      }, time);
    };
  };

  const RESIZE_THROTTLE = 100;
  const ACTIVE_CLASS$1 = 'active';

  const dictionary = {};
  let activeFilter;

  // Adds the given project to the dictionary under the given filter,
  // creating an array for the filter in the dictionary if needed.
  const addProjectToDictionary = (filter, project) => {
    if (!dictionary.hasOwnProperty(filter)) {
      dictionary[filter] = [];
    }
    dictionary[filter].push(project);
  };

  // Iterates through all of the projects, adding them to the dictionary.
  const cacheProjects = () => {
    const projectNodes = document.getElementsByClassName('preview-wrapper');
    
    const parent = projectNodes[0].parentElement;
    parent.style.height = parent.offsetHeight + 'px';

    const length = projectNodes.length;
    cacheGridLocations(projectNodes);
    // Iterate over each node, determining it's type and cacheing it
    for (let i = 0, node, filters, link; i < length; i++) {
      node = projectNodes[i];
      link = node.children[0];
      link.addEventListener('click', () => onClickProject(link));
      node.classList.add(ACTIVE_CLASS$1); // Everything visible by default
      filters = node.dataset.projectTags.split('|');
      addProjectToDictionary('All', node);
      filters.map(filter => addProjectToDictionary(filter, node));
    }
  };

  // Sets the current project
  const onClickProject = (proj) => {
    const href = proj.href;
    const pathComponents = href.split('/');
    const path = pathComponents[pathComponents.length - 1];
    const id = path.slice('#project-'.length);
    openProject(id);
  };

  // Sets the current active filter
  const onFilterChanged = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();

    // Remove old active filter
    activeFilter.classList.remove(ACTIVE_CLASS$1);
    const oldFilter = activeFilter.dataset.filter;
    dictionary[oldFilter].map(node => node.classList.remove(ACTIVE_CLASS$1));
    
    // Setup new active filter
    activeFilter = ev.target;
    activeFilter.classList.add(ACTIVE_CLASS$1);
    const filter = activeFilter.dataset.filter;
    dictionary[filter].map((node, i) => {
      node.classList.add(ACTIVE_CLASS$1);
      setGridItemPosition(node, i);
    });
  };

  // Main setup function
  const projectFilter = () => {
    cacheProjects();
    // Setup event handlers
    const filterNodes = document.getElementsByClassName('project-filter');
    const filterCount = filterNodes.length;
    for (let i = 0; i < filterCount; i++) {
      filterNodes[i].addEventListener('click', onFilterChanged);
    }
    // Reset the grid locations on resize, throttled to 200ms
    window.addEventListener('resize', throttle(RESIZE_THROTTLE, () => 
      cacheGridLocations(dictionary.All)
    ));
    // Setup default
    activeFilter = filterNodes[0];
    activeFilter.classList.add(ACTIVE_CLASS$1);
  };

  const setup = () => {
    projectFilter();
    projectNav();
  };

  // Start everything when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

}());
