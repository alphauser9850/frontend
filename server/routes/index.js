import express from "express";
import hubspotRouter from "./hubspotRoute.js";
import paymentRouter from "./paymentRoute.js";
import { deployToProduction, getLastDeployment, getDeploymentHistory } from "../controllers/deploymentController.js";

const router = express.Router();

router.use("/hubspot", hubspotRouter);
router.use("/payment", paymentRouter);

// Deployment routes
router.post("/deployment/deploy", deployToProduction);
router.get("/deployment/last", getLastDeployment);
router.get("/deployment/history", getDeploymentHistory);

export default router;
