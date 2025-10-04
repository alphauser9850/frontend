#!/usr/bin/env node

import { build } from 'vite';
import { resolve } from 'path';

const __dirname = resolve();

// Simple build script that bypasses permission issues
async function buildApp() {
  try {
    console.log('Building client...');
    await build({
      root: __dirname,
      build: {
        outDir: 'dist/client',
        emptyOutDir: true,
      },
    });
    
    console.log('Building server...');
    await build({
      root: __dirname,
      build: {
        outDir: 'dist/server',
        ssr: 'src/entry-server.tsx',
        emptyOutDir: true,
      },
    });
    
    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

buildApp();

