import {
  TransactionalEmailsApi,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys
} from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

import { welcomeEmail } from "../assests/welcomeEmail.js";

export const sendWelcomeEmail = async (name, email, packageName, duration) => {
  try {
    const apiInstance = new TransactionalEmailsApi();
    // Set API key
    apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_KEY);

    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.subject = "Welcome aboard! You are officially enrolled in the CCIE Course – Let’s get started";
    sendSmtpEmail.htmlContent = welcomeEmail();
    sendSmtpEmail.sender = { name: "CCIE Lab", email: "ccielab.net@gmail.com" };
    sendSmtpEmail.to = [{ email, name }];
    sendSmtpEmail.params = { name, package: packageName, duration };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Error sending email:", JSON.stringify(error, null, 2));
    throw error;
  }
};