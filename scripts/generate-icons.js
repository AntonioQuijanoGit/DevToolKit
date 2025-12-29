/**
 * Script to generate PWA icons
 * Run with: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Simple SVG template for icon
const iconSVG = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.125}" fill="#0070f3"/>
  <text x="${size / 2}" y="${size * 0.625}" font-family="Arial, sans-serif" font-size="${size * 0.375}" font-weight="bold" fill="white" text-anchor="middle">DT</text>
</svg>`;

const publicDir = path.join(__dirname, '../public');

// Generate icons
const sizes = [192, 512];

sizes.forEach(size => {
  const svg = iconSVG(size);
  const filename = `icon-${size}.svg`;
  fs.writeFileSync(path.join(publicDir, filename), svg);
  console.log(`✓ Created ${filename}`);
});

console.log('\nNote: For production, convert these SVG files to PNG format.');
console.log('You can use online tools or ImageMagick: convert icon-192.svg icon-192.png');



