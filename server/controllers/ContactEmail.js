const transporter = require("../utils/nodemailerConfig");
const { getUserEmailTemplate, getAdminEmailTemplate } = require("../utils/emailTemplates");


const submitFranchiseEnquiry = async (req, res) => {
  try {
    const { name, location, mobile, email, date, time } = req.body;

    // Validate required fields
    if (!name || !location || !mobile || !email) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const formData = { name, location, mobile, email, date, time };

    // Email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank You for Your Franchise Enquiry",
      html: getUserEmailTemplate(formData),
    };

    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Add ADMIN_EMAIL to .env
      subject: "New Franchise Enquiry",
      html: getAdminEmailTemplate(formData),
    };

    // Send emails
    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    // Optional: Log success on server
    console.log("Emails sent successfully:", formData);

    return res.status(200).json({ message: "Enquiry submitted successfully" });
  } catch (error) {
    console.error("Error submitting franchise enquiry:", error);
    return res.status(500).json({ message: "Server error, please try again later" });
  }
};

module.exports = { submitFranchiseEnquiry };