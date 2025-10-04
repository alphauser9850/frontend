import express from "express";
import * as controller from "../controllers/paymentController.js"

const router = express.Router();

router.post("/paypalCreateOrder", controller.paypalCreateOrder);
router.post("/paypalCaptureOrder", controller.paypalCaptureOrder);
router.post("/create-payment-intent", controller.createStripeIntent);


export default router;