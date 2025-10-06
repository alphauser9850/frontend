import axios from 'axios';
import { sendWelcomeEmail } from '../utils/welcomeEmail.js';
import { OnboardEmail } from '../utils/userOnbarded.js';
import { HUBSPOT_TOKEN } from '../env.js';
import { paymentSuccess } from '../utils/paymentSuccess.js';
import { newRegisterEmail } from '../utils/userRegister.js';
import { newEnquiryEmail } from '../utils/UserEnquairy.js';
import { newMettingEmail } from '../utils/MettingRegister.js';


export const getContact = async (req, res) => {
    try {
        const response = await axios.post("https://api.hubapi.com/crm/v3/objects/contacts/search",
            req.body,
            {
                headers: {
                    Authorization: `Bearer ${HUBSPOT_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        res.status(200).json({
            status: "Success",
            data: response.data,
            message: "Contact get Successfully"
        });
    } catch (error) {
        console.log()
        return res.status(500).json({
            status: "Failure",
            error: error,
            message: "Internal Server Error"
        });
    }
}


export const createContact = async (req, res) => {
    try {
        const response = await axios.post("https://api.hubapi.com/crm/v3/objects/contacts",
            req.body,
            {
                headers: {
                    Authorization: `Bearer ${HUBSPOT_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        await newRegisterEmail({
            name: req.body.properties.firstname,
            email: req.body.properties.email,
            contact_number: req.body.properties.phone,
            course_name: req.body.properties.course_name,
            message: req.body.properties.message,
            course_plan: req.body.properties.course_plan,
            form_name: req.body.properties.form_name,
            utm_url: req.body.properties.utm_url

        });
        await sendWelcomeEmail({ name: req.body.properties.firstname, email: req.body.properties.email, packageName: req.body.properties.course_name, package_plan: req.body.properties.course_plan });
        res.status(201).json({
            status: "Success",
            data: response.data,
            message: "Contact Created Successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: "Failure",
            error: error,
            message: "Internal Server Error"
        });
    }
}

export const updateDetails = async (req, res) => {
    try {
        await axios.patch(`https://api.hubapi.com/crm/v3/objects/contacts/${req.body.hubspot.contactId}`,
            {
                properties: {
                    leads_status: req.body.hubspot.leads_status,
                    hs_lead_status: req.body.hubspot.hs_lead_status
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${HUBSPOT_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        await axios.post('https://api.hubapi.com/crm/v3/objects/deals',
            {
                properties: {
                    dealname: "CCIE Course",
                    pipeline: "default",
                    dealstage: "2009368270",
                    email: req.body.hubspot.email,
                    course_time_zone: req.body.hubspot.course_time_zone || '',
                    course_start_time: req.body.hubspot.course_start_time || '',
                    name: req.body.hubspot.firstname,
                    contact_number: req.body.hubspot.phone,
                    course_name: req.body.hubspot.course_name,
                    message: req.body.hubspot.message,
                    course_status: req.body.hubspot.course_status,
                    course_start_date: req.body.hubspot.course_start_date || '',
                    instructor_name: req.body.hubspot.instructor_name || '',
                    lead_status: req.body.hubspot.leads_status,
                    amount: req.body.hubspot.paid_amount,
                    payment_status: req.body.hubspot.payment_status,
                    payment_id: req.body.hubspot.payment_id,
                    payment_type: req.body.hubspot.payment_type,
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${HUBSPOT_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        await OnboardEmail({
            name: req.body.hubspot.firstname,
            email: req.body.hubspot.email,
            contact_number: req.body.hubspot.phone,
            course_name: req.body.hubspot.course_name,
            course_plan: req.body.hubspot.course_plan,
            form_name: req.body.hubspot.form_name,
            utm_url: req.body.hubspot.utm_url,
            message: req.body.hubspot.message,
            course_status: req.body.hubspot.course_status,
            course_start_date: req.body.hubspot.course_start_date || '',
            instructor_name: req.body.hubspot.instructor_name || '',
            lead_status: req.body.hubspot.leads_status,
            amount: req.body.hubspot.paid_amount,
            payment_status: req.body.hubspot.payment_status,
            payment_id: req.body.hubspot.payment_id,
            payment_type: req.body.hubspot.payment_type,
        });
        const { name, email, packageName, duration } = req.body.email;

        await paymentSuccess({ name, email, packageName, duration, payment_id: req.body.hubspot.payment_id, amount: req.body.hubspot.paid_amount, package_plan: req.body.hubspot.course_plan });
        res.status(200).json({
            status: "Success",
            data: null,
            message: "Contact Updated Successfully"

        });
    } catch (error) {
        return res.status(500).json({
            status: "Failure",
            error: error,
            message: "Internal Server Error"
        });
    }
}


export const createMeetting = async (req, res) => {
    try {
        const response = await axios.post("https://api.hubapi.com/crm/v3/objects/contacts",
            req.body,
            {
                headers: {
                    Authorization: `Bearer ${HUBSPOT_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        await newMettingEmail({
            name: req.body.properties.firstname,
            email: req.body.properties.email,
            contact_number: req.body.properties.phone,
            course_name: req.body.properties.course_name,
            message: req.body.properties.message,
            course_plan: req.body.properties.course_plan,
            form_name: req.body.properties.form_name,
            utm_url: req.body.properties.utm_url

        });
        res.status(201).json({
            status: "Success",
            data: response.data,
            message: "Contact Created Successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: "Failure",
            error: error,
            message: "Internal Server Error"
        });
    }
}



export const createEnquiry = async (req, res) => {
    try {
        const response = await axios.post("https://api.hubapi.com/crm/v3/objects/contacts",
            req.body,
            {
                headers: {
                    Authorization: `Bearer ${HUBSPOT_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        await newEnquiryEmail({
            name: req.body.properties.firstname,
            email: req.body.properties.email,
            contact_number: req.body.properties.phone,
            country: req.body.properties.country,
            message: req.body.properties.message,
            subject: req.body.properties.subject,
            form_name: req.body.properties.form_name,
            utm_url: req.body.properties.utm_url
        });
        res.status(201).json({
            status: "Success",
            data: response.data,
            message: "Contact Created Successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: "Failure",
            error: error,
            message: "Internal Server Error"
        });
    }
}
