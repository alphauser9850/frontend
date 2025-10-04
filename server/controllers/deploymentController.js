import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

// Deployment history file path
const DEPLOYMENT_HISTORY_FILE = path.join(process.cwd(), 'deployment-history.json');

// Load deployment history
async function loadDeploymentHistory() {
  try {
    const data = await fs.readFile(DEPLOYMENT_HISTORY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { deployments: [] };
  }
}

// Save deployment history
async function saveDeploymentHistory(history) {
  await fs.writeFile(DEPLOYMENT_HISTORY_FILE, JSON.stringify(history, null, 2));
}

// Add deployment record
async function addDeploymentRecord(status, message) {
  const history = await loadDeploymentHistory();
  const record = {
    timestamp: new Date().toISOString(),
    status,
    message
  };
  
  history.deployments.unshift(record);
  
  // Keep only last 10 deployments
  if (history.deployments.length > 10) {
    history.deployments = history.deployments.slice(0, 10);
  }
  
  await saveDeploymentHistory(history);
  return record;
}

// Execute deployment commands
async function executeDeployment() {
  const commands = [
    {
      name: 'Git Pull',
      command: 'cd /var/www/berkut-cloud && git pull origin main',
      timeout: 30000
    },
    {
      name: 'Build Application',
      command: 'cd /var/www/berkut-cloud && sudo npm run build',
      timeout: 120000
    },
    {
      name: 'Check Service Status',
      command: 'sudo systemctl is-active berkut-cloud.service',
      timeout: 5000
    }
  ];

  const results = [];
  
  for (const cmd of commands) {
    try {
      console.log(`Executing: ${cmd.name}`);
      const { stdout, stderr } = await execAsync(cmd.command, { 
        timeout: cmd.timeout,
        cwd: '/var/www/berkut-cloud'
      });
      
      results.push({
        step: cmd.name,
        success: true,
        output: stdout,
        error: stderr
      });
      
      console.log(`${cmd.name} completed successfully`);
    } catch (error) {
      console.error(`${cmd.name} failed:`, error);
      results.push({
        step: cmd.name,
        success: false,
        output: error.stdout || '',
        error: error.message
      });
      
      // If any step fails, stop the deployment
      throw new Error(`${cmd.name} failed: ${error.message}`);
    }
  }
  
  return results;
}

// API endpoint for deployment
export const deployToProduction = async (req, res) => {
  try {
    console.log('Starting production deployment...');
    
    // Execute deployment steps
    const results = await executeDeployment();
    
    // Check if service is running
    const serviceStatus = results.find(r => r.step === 'Check Service Status');
    if (!serviceStatus || !serviceStatus.success) {
      throw new Error('Service is not running after restart');
    }
    
    const message = `Deployment completed successfully. Service status: ${serviceStatus.output.trim()}`;
    
    // Save deployment record
    await addDeploymentRecord('success', message);
    
    res.status(200).json({
      success: true,
      message,
      results: results.map(r => ({
        step: r.step,
        success: r.success,
        output: r.output.substring(0, 200) // Limit output length
      }))
    });
    
  } catch (error) {
    console.error('Deployment failed:', error);
    
    // Save failed deployment record
    await addDeploymentRecord('error', error.message);
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// API endpoint to get last deployment
export const getLastDeployment = async (req, res) => {
  try {
    const history = await loadDeploymentHistory();
    const lastDeployment = history.deployments[0];
    
    if (!lastDeployment) {
      return res.status(404).json({
        message: 'No deployment history found'
      });
    }
    
    res.status(200).json(lastDeployment);
  } catch (error) {
    console.error('Failed to get last deployment:', error);
    res.status(500).json({
      message: 'Failed to retrieve deployment history'
    });
  }
};

// API endpoint to get deployment history
export const getDeploymentHistory = async (req, res) => {
  try {
    const history = await loadDeploymentHistory();
    res.status(200).json(history);
  } catch (error) {
    console.error('Failed to get deployment history:', error);
    res.status(500).json({
      message: 'Failed to retrieve deployment history'
    });
  }
};
