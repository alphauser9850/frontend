import express from 'express';
import * as controller from "../controllers/hubspotController.js"

const router = express.Router();

router.post('/create-contact', controller.createContact);
router.post('/get-contact', controller.getContact);
router.patch('/update-contact/:id', controller.updateContact);

export default router;
