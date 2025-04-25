const fs = require('fs');
const path = require('path');
const https = require('https');

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath));
      } else {
        response.resume();
        reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`));
      }
    });
  });
};

const createDirectoryIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const downloadImages = async () => {
  const baseDir = path.join(__dirname, '../public/images');
  const directories = ['logos', 'illustrations', 'testimonials', 'social', 'integrations'];
  
  // Create directories
  directories.forEach(dir => createDirectoryIfNotExists(path.join(baseDir, dir)));

  // Define images to download
  const images = {
    logos: [
      { name: 'creovai-logo.svg', url: 'https://www.creovai.com/images/logo.svg' },
      { name: 'creovai-logo-white.svg', url: 'https://www.creovai.com/images/logo-white.svg' },
      { name: 'bcu.svg', url: 'https://www.creovai.com/images/customers/bcu.svg' },
      { name: 'twinstar-credit-union.svg', url: 'https://www.creovai.com/images/customers/twinstar.svg' },
      { name: 'connexus-credit-union.svg', url: 'https://www.creovai.com/images/customers/connexus.svg' },
      { name: 'first-bank-trust.svg', url: 'https://www.creovai.com/images/customers/first-bank.svg' },
      { name: 'city-national-bank.svg', url: 'https://www.creovai.com/images/customers/city-national.svg' },
    ],
    illustrations: [
      { name: 'agent-workflow.svg', url: 'https://www.creovai.com/images/illustrations/agent-workflow.svg' },
      { name: 'qa-automation.svg', url: 'https://www.creovai.com/images/illustrations/qa-automation.svg' },
      { name: 'conversation-intelligence.svg', url: 'https://www.creovai.com/images/illustrations/conversation-intelligence.svg' },
    ],
    testimonials: [
      { name: 'keith-parris.jpg', url: 'https://www.creovai.com/images/testimonials/keith-parris.jpg' },
    ],
    social: [
      { name: 'facebook.svg', url: 'https://www.creovai.com/images/social/facebook.svg' },
      { name: 'twitter.svg', url: 'https://www.creovai.com/images/social/twitter.svg' },
      { name: 'linkedin.svg', url: 'https://www.creovai.com/images/social/linkedin.svg' },
      { name: 'instagram.svg', url: 'https://www.creovai.com/images/social/instagram.svg' },
    ],
    integrations: [
      { name: 'five9.svg', url: 'https://www.creovai.com/images/integrations/five9.svg' },
      { name: 'salesforce.svg', url: 'https://www.creovai.com/images/integrations/salesforce.svg' },
      { name: 'zendesk.svg', url: 'https://www.creovai.com/images/integrations/zendesk.svg' },
      { name: 'twilio.svg', url: 'https://www.creovai.com/images/integrations/twilio.svg' },
      { name: 'genesys.svg', url: 'https://www.creovai.com/images/integrations/genesys.svg' },
      { name: 'nice-incontact.svg', url: 'https://www.creovai.com/images/integrations/nice-incontact.svg' },
      { name: 'freshworks.svg', url: 'https://www.creovai.com/images/integrations/freshworks.svg' },
      { name: 'zoho.svg', url: 'https://www.creovai.com/images/integrations/zoho.svg' },
      { name: '8x8.svg', url: 'https://www.creovai.com/images/integrations/8x8.svg' },
      { name: 'aws.svg', url: 'https://www.creovai.com/images/integrations/aws.svg' },
      { name: 'dynamics365.svg', url: 'https://www.creovai.com/images/integrations/dynamics365.svg' },
      { name: 'mitel.svg', url: 'https://www.creovai.com/images/integrations/mitel.svg' },
      { name: 'odigo.svg', url: 'https://www.creovai.com/images/integrations/odigo.svg' },
      { name: 'glia.svg', url: 'https://www.creovai.com/images/integrations/glia.svg' },
      { name: 'gladly.svg', url: 'https://www.creovai.com/images/integrations/gladly.svg' },
    ],
  };

  // Download all images
  for (const [directory, directoryImages] of Object.entries(images)) {
    for (const image of directoryImages) {
      const filepath = path.join(baseDir, directory, image.name);
      try {
        await downloadImage(image.url, filepath);
        console.log(`Downloaded: ${image.name}`);
      } catch (error) {
        console.error(`Error downloading ${image.name}:`, error.message);
      }
    }
  }
};

downloadImages().catch(console.error); 