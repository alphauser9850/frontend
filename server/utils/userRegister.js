import {
    TransactionalEmailsApi,
    SendSmtpEmail,
    TransactionalEmailsApiApiKeys
} from '@getbrevo/brevo';
import { BREVO_KEY } from '../env.js';
import { userRegisterEmail } from '../assests/userRegisterEmail.js';

export const newRegisterEmail = async (params) => {
    try {
        const apiInstance = new TransactionalEmailsApi();
        apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, BREVO_KEY);

        const sendSmtpEmail = new SendSmtpEmail();
        sendSmtpEmail.subject = `New Student Registered: ${params.name}`;
        sendSmtpEmail.htmlContent = userRegisterEmail(params);
        sendSmtpEmail.sender = { name: "CCIE Lab", email: "ccielab.net@gmail.com" };
        // Admin email
        sendSmtpEmail.to = [{ email: "sales@ccielab.net", name: "CCIE New Registration" }, { email: "vishnu.bharath@berkut.cloud", name: "CCIE New Registration" }];
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Admin email sent successfully:", response.body);
        return response;
    } catch (error) {
        console.error("Error sending admin email:", JSON.stringify(error, null, 2));
        throw error;
    }
};
