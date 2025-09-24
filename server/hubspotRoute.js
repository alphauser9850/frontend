import express from 'express';
import * as controller from "./hubspotController.js"

const router = express.Router();

router.post('/create-contact', controller.createContact);
router.post('/associate-contact-to-course', controller.associateContactToCourse);
router.post('/create-enrollment', controller.createEnrollment);
router.patch('/update-enrollment/:id', controller.updateEnrollment);

export default router;
