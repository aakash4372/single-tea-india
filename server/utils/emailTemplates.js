// Email template for the sender (user)
const getUserEmailTemplate = (formData) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #ff6200;">Thank You for Your Franchise Enquiry!</h2>
    <p>Dear ${formData.name},</p>
    <p>Thank you for reaching out to us regarding a franchise opportunity with Single Tea India. We have received your details and will get back to you soon.</p>
    <h3 style="color: #333;">Your Submitted Details:</h3>
    <ul style="list-style: none; padding: 0;">
      <li><strong>Name:</strong> ${formData.name}</li>
      <li><strong>Location:</strong> ${formData.location}</li>
      <li><strong>Mobile:</strong> ${formData.mobile}</li>
      <li><strong>Email:</strong> ${formData.email}</li>
      <li><strong>Preferred Date:</strong> ${formData.date || "Not provided"}</li>
      <li><strong>Preferred Time:</strong> ${formData.time || "Not provided"}</li>
    </ul>
    <p style="color: #555;">We look forward to discussing this opportunity with you!</p>
    <p>Best regards,<br />Single Tea India Team</p>
  </div>
`;

// Email template for the receiver (admin)
const getAdminEmailTemplate = (formData) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #ff6200;">New Franchise Enquiry Received</h2>
    <p>A new franchise enquiry has been submitted through the website.</p>
    <h3 style="color: #333;">Enquiry Details:</h3>
    <ul style="list-style: none; padding: 0;">
      <li><strong>Name:</strong> ${formData.name}</li>
      <li><strong>Location:</strong> ${formData.location}</li>
      <li><strong>Mobile:</strong> ${formData.mobile}</li>
      <li><strong>Email:</strong> ${formData.email}</li>
      <li><strong>Preferred Date:</strong> ${formData.date || "Not provided"}</li>
      <li><strong>Preferred Time:</strong> ${formData.time || "Not provided"}</li>
    </ul>
    <p style="color: #555;">Please follow up with the user at the earliest convenience.</p>
    <p>Best regards,<br />Single Tea India System</p>
  </div>
`;

module.exports = { getUserEmailTemplate, getAdminEmailTemplate };