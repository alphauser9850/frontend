import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;


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
            error: error.response.data,
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
        res.status(201).json({
            status: "Success",
            data: response.data,
            message: "Contact Created Successfully"
        });
    } catch (error) {
        console.log()
        return res.status(500).json({
            status: "Failure",
            error: error.response.data,
            message: "Internal Server Error"
        });
    }
}

export const updateContact = async (req, res) => {
    try {
        const response = await axios.patch(`https://api.hubapi.com/crm/v3/objects/contacts/${req.params.id}`,
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
            message: "Contact Updated Successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: "Failure",
            error: error.response.data,
            message: "Internal Server Error"
        });
    }
}