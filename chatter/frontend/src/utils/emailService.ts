// utils/emailService.ts
import emailjs from 'emailjs-com';

export const sendEmail = async (formData: {
  name: string;
  email: string;
  message: string;
}) => {
  try {
    const serviceId = 'service_tvpg25q';
    const templateId = 'template_8bc009g';
    const userId = 'vV1auqI9oqD0Iyqw6';

    const templateParams = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
    };

    const response = await emailjs.send(serviceId, templateId, templateParams, userId);
    console.log('Email sent successfully:', response.status, response.text);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};
