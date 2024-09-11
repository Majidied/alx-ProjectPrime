// utils/emailService.ts
import emailjs from 'emailjs-com';

/**
 * Sends an email using the EmailJS service.
 *
 * @param formData - An object containing the name, email, and message to be sent.
 * @returns A promise that resolves to a boolean indicating whether the email was sent successfully.
 */
export const sendEmail = async (formData: {
  name: string;     // Name of the person sending the email
  email: string;    // Email address of the person sending the email
  message: string;  // The message content to be sent
}) => {
  try {
    const serviceId = 'service_tvpg25q';  // EmailJS service ID
    const templateId = 'template_8bc009g'; // EmailJS template ID
    const userId = 'vV1auqI9oqD0Iyqw6';   // EmailJS user ID

    const templateParams = {
      name: formData.name,      // Name to be passed to the email template
      email: formData.email,    // Email to be passed to the email template
      message: formData.message // Message to be passed to the email template
    };

    // Send email using EmailJS
    const response = await emailjs.send(serviceId, templateId, templateParams, userId);
    console.log('Email sent successfully:', response.status, response.text);
    return true; // Return true if the email was sent successfully
  } catch (error) {
    console.error('Failed to send email:', error);
    return false; // Return false if there was an error sending the email
  }
};
