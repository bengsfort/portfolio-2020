'use strict';

// Throttles a function so it doesn't go too wild
export const throttle = (time, fn) => {
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