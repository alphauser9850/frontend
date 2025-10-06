import {
  TransactionalEmailsApi,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys
} from '@getbrevo/brevo';

import { welcomeEmail } from "../assests/welcomeEmail.js";
import { BREVO_KEY } from '../env.js';

export const sendWelcomeEmail = async ({ name, email, packageName, package_plan }) => {
  try {
    const apiInstance = new TransactionalEmailsApi();
    // Set API key
    apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, BREVO_KEY);

    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.subject = "Welcome  You are Registerd in the CCIE Course – Let’s get started ";
    sendSmtpEmail.htmlContent = welcomeEmail();
    sendSmtpEmail.sender = { name: "CCIE Lab", email: "ccielab.net@gmail.com" };
    sendSmtpEmail.to = [{ email, name }];
    sendSmtpEmail.params = { name, package: packageName, package_plan };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully:", response.body);
    return response;
  } catch (error) {
    console.error("Error sending email:", JSON.stringify(error, null, 2));
    throw error;
  }
};