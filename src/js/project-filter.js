(function(window, undefined) {
  const ACTIVE_CLASS = 'active';
  const DEFAULT_FILTER = 'All';
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
    const length = projectNodes.length;
    
    // Iterate over each node, determining it's type and cacheing it
    for (let i = 0, node, filters; i < length; i++) {
      node = projectNodes[i];
      node.classList.add(ACTIVE_CLASS); // Everything visible by default
      filters = node.dataset.projectTags.split('|');
      addProjectToDictionary('All', node);
      filters.map(filter => addProjectToDictionary(filter, node));
    }
  };

  /**
   * 
   * @param {MouseEvent} ev 
   */
  const onFilterChanged = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();

    // Remove old active filter
    activeFilter.classList.remove(ACTIVE_CLASS);
    const oldFilter = activeFilter.dataset.filter;
    dictionary[oldFilter].map(node => node.classList.remove(ACTIVE_CLASS));
    
    // Setup new active filter
    activeFilter = ev.target;
    activeFilter.classList.add(ACTIVE_CLASS);
    const filter = activeFilter.dataset.filter;
    dictionary[filter].map(node => node.classList.add(ACTIVE_CLASS));
  };

  const setup = () => {
    cacheProjects();
    // Setup event handlers
    const filterNodes = document.getElementsByClassName('project-filter');
    const filterCount = filterNodes.length;
    for (let i = 0; i < filterCount; i++) {
      filterNodes[i].addEventListener('click', onFilterChanged);
    }
    // Setup default
    activeFilter = filterNodes[0];
    activeFilter.classList.add(ACTIVE_CLASS);
  };
  
  // Start everything when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})(window);