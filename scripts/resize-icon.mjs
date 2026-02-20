import sharp from 'sharp';
import { resolve } from 'path';

const input = resolve('public/icon-512x512.jpg');

// Generate 192x192 for manifest
await sharp(input)
  .resize(192, 192)
  .jpeg({ quality: 95 })
  .toFile(resolve('public/icon-192x192.jpg'));

// Generate 180x180 for Apple touch icon
await sharp(input)
  .resize(180, 180)
  .png()
  .toFile(resolve('public/apple-icon.png'));

// Generate 32x32 for favicon
await sharp(input)
  .resize(32, 32)
  .png()
  .toFile(resolve('public/favicon.png'));

console.log('All icon sizes generated successfully');
