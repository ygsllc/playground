const fs = require('fs');
const path = require('path');

const createPlaceholderSVG = (text, color = '#00E6CA') => `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100">
  <rect width="200" height="100" fill="white"/>
  <rect width="200" height="100" fill="${color}" opacity="0.1"/>
  <text x="100" y="50" font-family="Arial" font-size="14" fill="#333" text-anchor="middle" dominant-baseline="middle">
    ${text}
  </text>
</svg>
`;

const createDirectoryIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const createPlaceholderImages = () => {
  const baseDir = path.join(__dirname, '../public/images');
  const images = {
    logos: [
      'creovai-logo',
      'creovai-logo-white',
      'bcu',
      'twinstar-credit-union',
      'connexus-credit-union',
      'first-bank-trust',
      'city-national-bank',
    ],
    illustrations: [
      'agent-workflow',
      'qa-automation',
      'conversation-intelligence',
    ],
    social: [
      'facebook',
      'twitter',
      'linkedin',
      'instagram',
    ],
    integrations: [
      'five9', 'salesforce', 'zendesk', 'twilio', 'genesys',
      'nice-incontact', 'freshworks', 'zoho', '8x8', 'aws',
      'dynamics365', 'mitel', 'odigo', 'glia', 'gladly',
    ],
  };

  // Create directories
  Object.keys(images).forEach(dir => createDirectoryIfNotExists(path.join(baseDir, dir)));

  // Create placeholder images
  Object.entries(images).forEach(([directory, imageNames]) => {
    imageNames.forEach(name => {
      const filepath = path.join(baseDir, directory, `${name}.svg`);
      const svg = createPlaceholderSVG(name);
      fs.writeFileSync(filepath, svg);
      console.log(`Created: ${filepath}`);
    });
  });

  // Create testimonial image placeholder (JPG)
  const testimonialDir = path.join(baseDir, 'testimonials');
  createDirectoryIfNotExists(testimonialDir);
  
  // Create a simple HTML file that we'll convert to JPG manually
  const testimonialHTML = `
    <div style="width: 200px; height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 100%;">
      <span style="font-family: Arial; color: #333;">Keith Parris</span>
    </div>
  `;
  fs.writeFileSync(path.join(testimonialDir, 'keith-parris.html'), testimonialHTML);
  console.log('Created testimonial placeholder HTML');
};

createPlaceholderImages(); 