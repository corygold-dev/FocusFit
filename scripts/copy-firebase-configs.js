#!/usr/bin/env node
/* global process, __dirname, console, require */
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');
const path = require('path');

// Auto-detect environment from EAS_BUILD_PROFILE or command line argument
const easProfile = process.env.EAS_BUILD_PROFILE; // EAS sets this automatically
const cliArg = process.argv[2]; // 'dev' or 'prod' from command line

let env;
if (cliArg && ['dev', 'prod'].includes(cliArg)) {
  env = cliArg;
} else if (easProfile) {
  // Map EAS profile names to our environment names
  env = easProfile === 'production' ? 'prod' : 'dev';
} else {
  console.error('❌ Could not determine environment');
  console.error('Usage: node scripts/copy-firebase-configs.js [dev|prod]');
  console.error(
    'Or run via EAS Build (EAS_BUILD_PROFILE will be auto-detected)'
  );
  process.exit(1);
}

console.log(
  `📦 Copying ${env} Firebase configs... (profile: ${easProfile || 'local'})`
);

const configs = [
  {
    src: `google-services.${env}.json`,
    dest: 'google-services.json',
  },
  {
    src: `GoogleService-Info.${env}.plist`,
    dest: `GoogleService-Info.plist`,
  },
];

try {
  configs.forEach(({ src, dest }) => {
    const srcPath = path.resolve(__dirname, '..', src);
    const destPath = path.resolve(__dirname, '..', dest);

    // Check if source file exists
    if (!fs.existsSync(srcPath)) {
      console.error(`❌ Source file not found: ${src}`);
      process.exit(1);
    }

    fs.copyFileSync(srcPath, destPath);
    console.log(`   ✓ ${src} → ${dest}`);
  });

  console.log(`✅ ${env} configs copied successfully`);

  // Verify the copied files (helpful for debugging EAS builds)
  console.log('\n🔍 Verifying copied Firebase configs...');
  const plistContent = fs.readFileSync(
    path.resolve(__dirname, '..', 'GoogleService-Info.plist'),
    'utf8'
  );
  const plistProjectId = plistContent.match(
    /<key>PROJECT_ID<\/key>\s*<string>(.*?)<\/string>/
  );
  if (plistProjectId) {
    console.log(`   iOS PROJECT_ID: ${plistProjectId[1]}`);
  }

  const androidContent = fs.readFileSync(
    path.resolve(__dirname, '..', 'google-services.json'),
    'utf8'
  );
  const androidConfig = JSON.parse(androidContent);
  console.log(
    `   Android project_id: ${androidConfig.project_info.project_id}`
  );
} catch (error) {
  console.error(`❌ Failed to copy configs:`, error.message);
  process.exit(1);
}
