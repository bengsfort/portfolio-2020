'use strict';

/**
 * @typedef GridItem
 * @property {number} top
 * @property {number} left
 * @property {number} height
 * @property {number} width
 */

let grid = [];

/**
 * @param {HTMLCollectionOf[HTMLElement]} items 
 */
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

/**
 * 
 * @param {HTMLElement} item 
 * @param {number} index 
 */
export const setGridItemPosition = (item, index) => {
  const position = grid[index];
  item.style.position = 'absolute';
  item.style.top = position.top + 'px';
  item.style.left = position.left + 'px';
  item.style.height = position.height + 'px';
  item.style.width = position.width + 'px';
};
