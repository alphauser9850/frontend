import {
    TransactionalEmailsApi,
    SendSmtpEmail,
    TransactionalEmailsApiApiKeys
} from '@getbrevo/brevo';
import { BREVO_KEY } from '../env.js';
import { userMettitngEmail } from '../assests/mettingRegisterEmail.js';

export const newMettingEmail = async (params) => {
    try {
        const apiInstance = new TransactionalEmailsApi();
        apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, BREVO_KEY);
        const sendSmtpEmail = new SendSmtpEmail();
        sendSmtpEmail.subject = `New Mettning Registered: ${params.name}`;
        sendSmtpEmail.htmlContent = userMettitngEmail(params);
        sendSmtpEmail.sender = { name: "CCIE Lab", email: "ccielab.net@gmail.com" };
        // Admin email
        sendSmtpEmail.to = [{ email: "sales@ccielab.net", name: "CCIE New Metting Registration" },{ email: "vishnu.bharath@berkut.cloud", name: "CCIE New Metting Registration" }];

        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Admin email sent successfully:", response.body);
        return response;
    } catch (error) {
        console.error("Error sending admin email:", JSON.stringify(error, null, 2));
        throw error;
    }
};
