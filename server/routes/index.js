import express from "express";
import hubspotRouter from "./hubspotRoute.js";
import paymentRouter from "./paymentRoute.js";
import deploymentRouter from "./deploymentRoute.js";
const router = express.Router();

router.use("/hubspot", hubspotRouter);
router.use("/payment", paymentRouter);
router.use("/admin", deploymentRouter);

export default router;
