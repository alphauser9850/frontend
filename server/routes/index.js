import express from "express";
import hubspotRouter from "./hubspotRoute.js";
import paymentRouter from "./paymentRoute.js";
const router = express.Router();

router.use("/hubspot", hubspotRouter);
router.use("/payment", paymentRouter);

export default router;
