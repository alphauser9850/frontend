import {
  TransactionalEmailsApi,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys
} from '@getbrevo/brevo';
import { userOnboardEmail } from '../assests/userOnboardEmail.js';
import { BREVO_KEY } from '../env.js';

export const OnboardEmail = async (params) => {
  try {
    const apiInstance = new TransactionalEmailsApi();
    apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, BREVO_KEY);

    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.subject = `New Student Onboarded: ${params.name}`;
    sendSmtpEmail.htmlContent = userOnboardEmail(params);
    sendSmtpEmail.sender = { name: "CCIE Lab", email: "ccielab.net@gmail.com" };

    // Admin email
    sendSmtpEmail.to = [{ email: "sales@ccielab.net", name: "CCIE New Onboarded" },{ email: "nrai5154@gmail.com", name: "CCIE New Onboarded" }];

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Admin email sent successfully:", response.body);
    return response;
  } catch (error) {
    console.error("Error sending admin email:", JSON.stringify(error, null, 2));
    throw error;
  }
};
