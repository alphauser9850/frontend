import express from 'express';
import { 
  deployToProduction, 
  getLastDeployment, 
  getDeploymentLogs 
} from '../controllers/deploymentController.js';

const router = express.Router();

// Admin deployment routes
router.post('/deploy', deployToProduction);
router.get('/last-deployment', getLastDeployment);
router.get('/logs', getDeploymentLogs);

export default router;
