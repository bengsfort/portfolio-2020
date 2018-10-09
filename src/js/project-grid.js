'use strict';

let grid = [];

// Caches the positions (relative to the parent) of a list of items.
export const cacheGridLocations = (items) => {
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
export const setGridItemPosition = (item, index) => {
  const position = grid[index];
  item.style.position = 'absolute';
  item.style.top = position.top + 'px';
  item.style.left = position.left + 'px';
  item.style.height = position.height + 'px';
  item.style.width = position.width + 'px';
};
