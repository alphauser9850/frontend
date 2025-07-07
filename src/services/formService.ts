import toast from 'react-hot-toast';

// Base interface for form data
export interface BaseFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// CCIE Page form data
export interface CCIEFormData {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: 'ccie-page' | 'ccie-page-contact';
}

// Contact form data
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  source: 'contact-page' | 'home-page';
}

// About page form data
export interface AboutFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  source: 'about-page';
}

// Union type for all form data types
export type FormData = CCIEFormData | ContactFormData | AboutFormData;

// The URLs of your n8n webhooks
const UNIVERSAL_WEBHOOK_URL = 'http://n8n.ccielab.net/webhook/d38ef99e-3a07-44cc-8c9d-833c17391f05';

/**
 * Submits form data to n8n webhook
 * @param data The form data to submit
 * @returns A promise that resolves to the submission result
 */
export const submitFormToN8n = async (data: FormData): Promise<{ success: boolean; message: string }> => {
  try {
    // Add timestamp to the data
    const submissionData = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    // All forms now use the same webhook URL
    const webhookUrl = UNIVERSAL_WEBHOOK_URL;
    // All forms now use the same webhook URL
    const webhookUrl = UNIVERSAL_WEBHOOK_URL;

    // Add debugging logs
    console.log('Form submission details:');
    console.log('Source:', data.source);
    console.log('Using webhook URL:', webhookUrl);
    console.log('Submission data:', JSON.stringify(submissionData, null, 2));

    // Send the data to n8n webhook
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      // Log response details
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Could not read response text');
        console.error('Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
    } catch (fetchError) {
      console.error('Network error during fetch:', fetchError);
      if (fetchError instanceof TypeError && fetchError.message.includes('NetworkError')) {
        console.error('This appears to be a CORS or network connectivity issue');
      }
      throw fetchError; // Re-throw to be caught by the outer try-catch
    }

    // Show success toast
    toast.success('Form submitted successfully!');
    
    // Send confirmation email (optional)
    if ('email' in data) {
      await sendConfirmationEmail(data.email);
    }

    return {
      success: true,
      message: 'Form submitted successfully!',
    };
  } catch (error) {
    console.error('Error submitting form:', error);
    
    // Show error toast
    toast.error('Failed to submit form. Please try again later.');
    
    return {
      success: false,
      message: 'Failed to submit form',
    };
  }
};

/**
 * Sends a confirmation email to the user
 * This can be handled by n8n or implemented directly here
 * @param email User's email address
 */
const sendConfirmationEmail = async (email: string): Promise<void> => {
  // This could be implemented with EmailJS or another email service
  // For now, we'll just log it
  console.log(`Sending confirmation email to ${email}`);
};

/**
 * Test function to directly check webhook connectivity
 * Call this from the browser console to test: 
 * import { testWebhookConnectivity } from './services/formService';
 * testWebhookConnectivity('ccie');
 * 
 * @param webhookType The type of webhook to test ('ccie', 'contact', or 'home')
 */
export const testWebhookConnectivity = async (webhookType: 'ccie' | 'contact' | 'home'): Promise<void> => {
  // All tests now use the same webhook URL
  const webhookUrl = UNIVERSAL_WEBHOOK_URL;
  console.log(`Testing connectivity to universal webhook: ${webhookUrl}`);
  // All tests now use the same webhook URL
  const webhookUrl = UNIVERSAL_WEBHOOK_URL;
  console.log(`Testing connectivity to universal webhook: ${webhookUrl}`);
  
  try {
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'This is a test submission'
    };
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('Test response status:', response.status);
    console.log('Test response ok:', response.ok);
    
    if (response.ok) {
      console.log('Webhook connectivity test successful!');
    } else {
      const errorText = await response.text().catch(() => 'Could not read response text');
      console.error('Webhook test failed:', errorText);
    }
  } catch (error) {
    console.error('Webhook connectivity test error:', error);
  }
}; 