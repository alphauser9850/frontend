import {
  TransactionalEmailsApi,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys
} from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();
import { userOnboardEmail } from '../assests/userOnboardEmail.js';

export const OnboardEmail = async (params) => {
  try {
    const apiInstance = new TransactionalEmailsApi();
    apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_KEY);

    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.subject = `New Student Onboarded: ${params.name}`;
    sendSmtpEmail.htmlContent = userOnboardEmail(params);
    sendSmtpEmail.sender = { name: "CCIE Lab", email: "ccielab.net@gmail.com" };

    // Admin email
    sendSmtpEmail.to = [{ email: "nrai5154@gmail.com", name: "CCIE New Onboarded" }];

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Admin email sent successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Error sending admin email:", JSON.stringify(error, null, 2));
    throw error;
  }
};
