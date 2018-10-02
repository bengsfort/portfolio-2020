'use strict';

import projectFilter from './project-filter';

const setup = () => {
  projectFilter();
}

// Start everything when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}