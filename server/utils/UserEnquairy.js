import {
    TransactionalEmailsApi,
    SendSmtpEmail,
    TransactionalEmailsApiApiKeys
} from '@getbrevo/brevo';
import { BREVO_KEY } from '../env.js';
import { userEnquiryEmail } from '../assests/userEnquiryEmail.js';

export const newEnquiryEmail = async (params) => {
    try {
        const apiInstance = new TransactionalEmailsApi();
        apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, BREVO_KEY);

        const sendSmtpEmail = new SendSmtpEmail();
        sendSmtpEmail.subject = `New Enquiry Registered: ${params.name}`;
        sendSmtpEmail.htmlContent = userEnquiryEmail(params);
        sendSmtpEmail.sender = { name: "CCIE Lab", email: "ccielab.net@gmail.com" };
        // Admin email
        sendSmtpEmail.to = [{ email: "sales@ccielab.net", name: "CCIE New Registration" }, { email: "vishnu.bharath@berkut.cloud", name: "CCIE New Registration" }];
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        return response;
    } catch (error) {
        console.error("Error sending admin email:", JSON.stringify(error, null, 2));
        throw error;
    }
};
