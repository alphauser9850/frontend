import {
    TransactionalEmailsApi,
    SendSmtpEmail,
    TransactionalEmailsApiApiKeys
} from '@getbrevo/brevo';
// import { userOnboardEmail } from '../assests/userOnboardEmail.js';
import { BREVO_KEY } from '../env.js';
import { paymentSuccessEmail } from '../assests/paymnetSuccessful.js';

export const paymentSuccess = async (params) => {
    try {
        const apiInstance = new TransactionalEmailsApi();
        apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, BREVO_KEY);

        const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.subject = "Welcome aboard! You are officially enrolled in the CCIE Course – Let’s get started";
        sendSmtpEmail.htmlContent = paymentSuccessEmail();
        sendSmtpEmail.sender = { name: "CCIE Lab", email: "ccielab.net@gmail.com" };

        sendSmtpEmail.to = [{ email: params.email, name: params.name ,}];
        sendSmtpEmail.params = { name: params.name , package: params.packageName, duration:params.duration,amount:params.amount,payment_id:params.payment_id,package_plan:params.package_plan };

        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Admin email sent successfully:", response.body);
        return response;
    } catch (error) {
        console.error("Error sending admin email:", JSON.stringify(error, null, 2));
        throw error;
    }
};
