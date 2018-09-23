const imagemin = require('imagemin');
const pngquant = require('imagemin-pngquant');
const pngcrush = require('imagemin-pngcrush');

imagemin(['src/assets/*.png'], 'dist/assets', {
  use: [
    pngquant({
      speed: 1,
      quality: '70-80',
      strip: true,
      verbose: true,
    }),
    pngcrush(),
  ],
}).then(() => {
  console.log('Optimized images.');
});