const nodemailer = require("nodemailer"); // Import the nodemailer library
const { SMTPConfig } = require("../config/config"); // Import the SMTP configuration
class EmailService {
  #transport; // Private field to hold the transport instance
  constructor() { // Constructor to initialize the EmailService class
    try {
      const config = {
        host: SMTPConfig.host,
        port: SMTPConfig.port,
        auth: {
          user: SMTPConfig.user,
          pass: SMTPConfig.pass,
        },
      };
      if (SMTPConfig.provider === "gmail") {
        config.service = SMTPConfig.provider; // Set the service to Gmail if the provider is Gmail
      }

      this.#transport = nodemailer.createTransport(config);
      console.log("SMTP server connected successfully");
    } catch (error) {
      throw {
        message: "SMTP server connection failed",
        status: "Connection Error",
      }; // Handle errors during initialization
    }
  }

  sendEmail = async ({ to, sub, msg, cc = null, bcc = null, attachment = null }) => {
    try {

      let msgBody = {
        from: SMTPConfig.from,
        to: to,
        subject: sub, // Set the subject of the email
        html: msg, // Set the HTML content of the email
      }
      if (cc) {
        msgBody('cc') = cc; // Add CC if provided
      }
      if (bcc) {
        msgBody('bcc') = bcc; // Add BCC if provided
      }
      if (attachment) {
        msgBody('attachment') = attachment; // Add attachments if provided
      }
      let response = await this.#transport.sendMail(msgBody)

      console.log("Email sent successfully", response); // Log the response from the email server
      return response; // Return the response from the email server

    } catch (error) {
      console.log("Email sending failed", error); // Log any errors that occur during email sending
      throw {
        message: "Email sending failed",
        status: "Email Error",
      }; // Handle errors during email sending
    }
  }
}

const emailService = new EmailService();
module.exports = emailService; // Export the EmailService instance for use in other modules