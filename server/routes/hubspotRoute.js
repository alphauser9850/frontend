import express from 'express';
import * as controller from "../controllers/hubspotController.js"

const router = express.Router();

router.post('/create-contact', controller.createContact);
router.post('/get-contact', controller.getContact);
router.post('/update-details', controller.updateDetails);

export default router;