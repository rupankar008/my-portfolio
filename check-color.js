const Jimp = require('jimp');
const path = require('path');

async function getBgColor() {
  const imagePath = path.join(__dirname, 'public', 'sequence', 'frame_000_delay-0.066s.png');
  const image = await Jimp.read(imagePath);
  // Get color of top-left pixel (x=0, y=0)
  const hex = image.getPixelColor(0, 0);
  console.log(hex.toString(16).toUpperCase());
}

getBgColor().catch(console.error);
