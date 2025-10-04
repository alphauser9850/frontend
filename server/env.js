import dotenv from "dotenv";
dotenv.config();

export const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;
export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
export const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const BREVO_KEY = process.env.BREVO_KEY;