import express from "express";
import hubspotRouter from "./hubspotRoute.js";
import paymentRouter from "./paymentRoute.js";
import { deployToProduction, getLastDeployment, getDeploymentHistory, getCommitHistory, saveDeploymentNotes, getDeploymentNotes } from "../controllers/deploymentController.js";

const router = express.Router();

router.use("/hubspot", hubspotRouter);
router.use("/payment", paymentRouter);

// Deployment routes
router.post("/deployment/deploy", deployToProduction);
router.get("/deployment/last", getLastDeployment);
router.get("/deployment/history", getDeploymentHistory);
router.get("/deployment/commits", getCommitHistory);
router.post("/deployment/notes", saveDeploymentNotes);
router.get("/deployment/notes", getDeploymentNotes);

export default router;
