// Notification service for medication reminders and dialysis appointments

// Email notification service using EmailJS (free tier)
export const sendEmailNotification = async ({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) => {
  // In a real implementation, you would use EmailJS or a similar service
  // This is a placeholder implementation
  console.log(
    `Sending email to ${to}:\nSubject: ${subject}\nMessage: ${message}`,
  );

  // Example implementation with EmailJS would look like:
  // return emailjs.send(
  //   'service_id',
  //   'template_id',
  //   { to, subject, message },
  //   'user_id'
  // );

  return Promise.resolve({ status: "success" });
};

// SMS notification service using Twilio (free trial)
export const sendSMSNotification = async ({
  to,
  message,
}: {
  to: string;
  message: string;
}) => {
  // In a real implementation, you would use Twilio or a similar service
  // This is a placeholder implementation
  console.log(`Sending SMS to ${to}:\nMessage: ${message}`);

  // Example implementation with Twilio would look like:
  // const twilio = require('twilio');
  // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  // return client.messages.create({
  //   body: message,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to
  // });

  return Promise.resolve({ status: "success" });
};

// Schedule notifications for a specific time
export const scheduleNotification = (
  type: "email" | "sms",
  params: any,
  scheduledTime: Date,
) => {
  const now = new Date();
  const timeUntilNotification = scheduledTime.getTime() - now.getTime();

  if (timeUntilNotification <= 0) {
    console.log("Scheduled time is in the past");
    return null;
  }

  // Schedule the notification
  const timerId = setTimeout(() => {
    if (type === "email") {
      sendEmailNotification(params);
    } else if (type === "sms") {
      sendSMSNotification(params);
    }
  }, timeUntilNotification);

  return timerId;
};

// Cancel a scheduled notification
export const cancelScheduledNotification = (timerId: number | null) => {
  if (timerId) {
    clearTimeout(timerId);
    return true;
  }
  return false;
};
