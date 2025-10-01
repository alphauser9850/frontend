import express from "express";
import * as controller from "../controllers/paymentController.js"

const router = express.Router();

router.post("/paypalCreateOrder", controller.paypalCreateOrder);
router.post("/paypalCaptureOrder", controller.paypalCaptureOrder);
router.post("/generateStripePaymentLink", controller.generateStripePaymentLink)
router.post("/getStripeWebhook", controller.receiveStripeWebHook);

export default router;