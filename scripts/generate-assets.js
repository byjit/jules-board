import fs from "fs";
import { Shrimp } from "lucide-react";
import path from "path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants for asset generation
const APP_NAME = "Jules Board";
const APP_DESCRIPTION = "Modern Kanban Board for Development Projects";
const COLOR = "#000000";

/**
 * Creates a React element for the logo using Lucide Shrimp icon
 */
const createLogoElement = (size) => {
  return React.createElement(Shrimp, {
    size: size,
    color: COLOR,
    strokeWidth: 2,
  });
};

/**
 * Generates SVG buffer for a given size
 */
const getSvgBuffer = (size) => {
  const element = createLogoElement(size);
  const svgString = renderToStaticMarkup(element);
  return Buffer.from(svgString);
};

async function generate() {
  const publicDir = path.resolve(__dirname, "../public");

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  console.log("Generating favicons and logos...");

  const sizes = [16, 32, 192, 512];

  for (const size of sizes) {
    const svgBuffer = getSvgBuffer(size);

    // Generate standard favicon PNGs
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, `favicon-${size}x${size}.png`));
    console.log(`Generated favicon-${size}x${size}.png`);

    // Generate manifest icons
    if (size === 192 || size === 512) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, `android-chrome-${size}x${size}.png`));
      console.log(`Generated android-chrome-${size}x${size}.png`);
    }

    // Special case for favicon.ico (using 32x32)
    if (size === 32) {
      await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(publicDir, "favicon.ico"));
      console.log("Generated favicon.ico (32x32 PNG)");
    }

    // Apple touch icon
    if (size === 192) {
      await sharp(svgBuffer)
        .resize(180, 180)
        .png()
        .toFile(path.join(publicDir, "apple-touch-icon.png"));
      console.log("Generated apple-touch-icon.png (180x180)");
    }
  }

  console.log("Generating OG Image...");

  const ogWidth = 1200;
  const ogHeight = 630;
  const logoSize = 240;

  // Create a composite SVG for OG Image
  const logoSvg = renderToStaticMarkup(createLogoElement(logoSize));

  const ogSvg = `
    <svg width="${ogWidth}" height="${ogHeight}" viewBox="0 0 ${ogWidth} ${ogHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f3f4f6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
      
      <!-- Logo background circle -->
      <circle cx="250" cy="315" r="160" fill="white" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))" />
      
      <g transform="translate(130, 195)">
        ${logoSvg}
      </g>
      
      <text x="460" y="300" font-family="sans-serif" font-size="80" font-weight="bold" fill="#000000">${APP_NAME}</text>
      <text x="460" y="370" font-family="sans-serif" font-size="32" fill="#4b5563">${APP_DESCRIPTION}</text>
      
      <!-- Accent line -->
      <rect x="460" y="395" width="100" height="8" rx="4" fill="#000000" />
    </svg>
  `;

  await sharp(Buffer.from(ogSvg)).png().toFile(path.join(publicDir, "og-image.png"));

  console.log("Generated og-image.png");
}

generate().catch((err) => {
  console.error("Error generating assets:", err);
  process.exit(1);
});
