import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config();
const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;

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
        res.status(201).json({
            status: "Success",
            data: response.data,
            message: "Contact Created Successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: "Failure",
            error: error.response.data,
            message: "Internal Server Error"
        });
    }
}

export const associateContactToCourse = async (req, res) => {
    try {
        const response = await axios.post("https://api.hubapi.com/crm/v3/associations/p243884800_course_1/0-1/batch/create",
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
            message: "Contact Associated to Course Successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: "Failure",
            error: error.response.data,
            message: "Internal Server Error"
        });
    }
}

export const createEnrollment = async (req, res) => {
    try {
        const response = await axios.post("https://api.hubapi.com/crm/v3/objects/p243884800_enrollment",
            req.body,
            {
                headers: {
                    Authorization: `Bearer ${HUBSPOT_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        res.status(201).json({
            status: "Success",
            data: response.data,
            message: "Enrollment Created Successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: "Failure",
            error: error.response.data,
            message: "Internal Server Error"
        });
    }
}

export const updateEnrollment = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await axios.patch(`https://api.hubapi.com/crm/v3/objects/p243884800_enrollment/${id}`,
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
            message: "Enrollment Updated Successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: "Failure",
            error: error.response.data,
            message: "Internal Server Error"
        });
    }
}