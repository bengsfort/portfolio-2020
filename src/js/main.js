'use strict';

import projectFilter from './project-filter';
import projectNav from './project-nav';

const setup = () => {
  projectFilter();
  projectNav();
}

// Start everything when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}