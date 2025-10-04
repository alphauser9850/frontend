import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

// Deployment log file path
const DEPLOYMENT_LOG_FILE = path.join(process.cwd(), 'deployment.log');

// Store last deployment timestamp
let lastDeploymentTimestamp = null;

export const deployToProduction = async (req, res) => {
  try {
    const logs = [];
    
    // Add timestamp to logs
    const timestamp = new Date().toISOString();
    logs.push(`[${timestamp}] Starting deployment process...`);
    
    // Step 1: Navigate to project directory and pull latest changes
    logs.push('Step 1: Pulling latest changes from repository...');
    try {
      const { stdout: pullOutput, stderr: pullError } = await execAsync(
        'cd /var/www/berkut-cloud && git pull origin main'
      );
      logs.push(`Git pull output: ${pullOutput}`);
      if (pullError) logs.push(`Git pull warnings: ${pullError}`);
    } catch (error) {
      logs.push(`Git pull failed: ${error.message}`);
      throw new Error(`Git pull failed: ${error.message}`);
    }
    
    // Step 2: Install dependencies (if package.json changed)
    logs.push('Step 2: Installing dependencies...');
    try {
      const { stdout: installOutput, stderr: installError } = await execAsync(
        'cd /var/www/berkut-cloud && npm ci --production'
      );
      logs.push(`Dependencies installed successfully`);
      if (installError) logs.push(`Install warnings: ${installError}`);
    } catch (error) {
      logs.push(`Dependency installation failed: ${error.message}`);
      // Don't throw here, continue with build
    }
    
    // Step 3: Build the application
    logs.push('Step 3: Building application for production...');
    try {
      const { stdout: buildOutput, stderr: buildError } = await execAsync(
        'cd /var/www/berkut-cloud && npm run build'
      );
      logs.push('Build completed successfully');
      if (buildError) logs.push(`Build warnings: ${buildError}`);
    } catch (error) {
      logs.push(`Build failed: ${error.message}`);
      throw new Error(`Build failed: ${error.message}`);
    }
    
    // Step 4: Restart the service
    logs.push('Step 4: Restarting production service...');
    try {
      const { stdout: restartOutput, stderr: restartError } = await execAsync(
        'sudo systemctl restart berkut-cloud.service'
      );
      logs.push('Service restarted successfully');
      if (restartError) logs.push(`Restart warnings: ${restartError}`);
    } catch (error) {
      logs.push(`Service restart failed: ${error.message}`);
      throw new Error(`Service restart failed: ${error.message}`);
    }
    
    // Step 5: Check service status
    logs.push('Step 5: Verifying service status...');
    try {
      const { stdout: statusOutput, stderr: statusError } = await execAsync(
        'sudo systemctl is-active berkut-cloud.service'
      );
      logs.push(`Service status: ${statusOutput.trim()}`);
      
      if (statusOutput.trim() !== 'active') {
        throw new Error('Service is not active after restart');
      }
    } catch (error) {
      logs.push(`Service status check failed: ${error.message}`);
      throw new Error(`Service status check failed: ${error.message}`);
    }
    
    // Update last deployment timestamp
    lastDeploymentTimestamp = timestamp;
    
    // Save logs to file
    await fs.writeFile(DEPLOYMENT_LOG_FILE, logs.join('\n'));
    
    logs.push(`[${timestamp}] Deployment completed successfully!`);
    
    res.status(200).json({
      success: true,
      message: 'Deployment completed successfully',
      timestamp,
      logs
    });
    
  } catch (error) {
    const timestamp = new Date().toISOString();
    const errorLogs = [
      `[${timestamp}] Deployment failed: ${error.message}`,
      'Please check the logs and try again.'
    ];
    
    // Save error logs
    await fs.writeFile(DEPLOYMENT_LOG_FILE, errorLogs.join('\n'));
    
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp,
      logs: errorLogs
    });
  }
};

export const getLastDeployment = async (req, res) => {
  try {
    res.status(200).json({
      lastDeployment: lastDeploymentTimestamp,
      success: true
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get last deployment info',
      success: false
    });
  }
};

export const getDeploymentLogs = async (req, res) => {
  try {
    const logs = await fs.readFile(DEPLOYMENT_LOG_FILE, 'utf-8');
    res.status(200).json({
      logs: logs.split('\n'),
      success: true
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to read deployment logs',
      success: false
    });
  }
};
