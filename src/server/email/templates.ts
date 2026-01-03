interface ApplicationEmailData {
  applicantName: string;
  dogName: string;
  email: string;
  phone: string;
  address?: string;
  applicationId: string;
}

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export function contactFormEmail(data: ContactEmailData): { subject: string; html: string } {
  return {
    subject: `Contact Form: Message from ${data.name}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 32px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h1 style="color: #333; margin-top: 0;">New Contact Form Message</h1>
    
    <div style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; margin: 24px 0;">
      <h2 style="color: #333; margin-top: 0; font-size: 18px;">Contact Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666; width: 80px;">Name:</td>
          <td style="padding: 8px 0; color: #333; font-weight: 500;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Email:</td>
          <td style="padding: 8px 0; color: #333;"><a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a></td>
        </tr>
        ${
          data.phone
            ? `
        <tr>
          <td style="padding: 8px 0; color: #666;">Phone:</td>
          <td style="padding: 8px 0; color: #333;"><a href="tel:${data.phone}" style="color: #2563eb;">${data.phone}</a></td>
        </tr>
        `
            : ""
        }
      </table>
    </div>
    
    <div style="margin: 24px 0;">
      <h2 style="color: #333; margin-top: 0; font-size: 18px;">Message</h2>
      <p style="color: #333; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
    </div>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
    
    <p style="color: #999; font-size: 12px; margin-bottom: 0;">
      Reply directly to this email to respond to ${data.name}.
    </p>
  </div>
</body>
</html>
    `.trim(),
  };
}

export function newApplicationAdminEmail(data: ApplicationEmailData): { subject: string; html: string } {
  return {
    subject: `New Application for ${data.dogName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 32px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h1 style="color: #333; margin-top: 0;">New Adoption Application</h1>
    <p style="color: #666; font-size: 16px;">A new application has been submitted for <strong>${data.dogName}</strong>.</p>
    
    <div style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; margin: 24px 0;">
      <h2 style="color: #333; margin-top: 0; font-size: 18px;">Applicant Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666; width: 120px;">Name:</td>
          <td style="padding: 8px 0; color: #333; font-weight: 500;">${data.applicantName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Email:</td>
          <td style="padding: 8px 0; color: #333;"><a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Phone:</td>
          <td style="padding: 8px 0; color: #333;"><a href="tel:${data.phone}" style="color: #2563eb;">${data.phone}</a></td>
        </tr>
        ${
          data.address
            ? `
        <tr>
          <td style="padding: 8px 0; color: #666; vertical-align: top;">Address:</td>
          <td style="padding: 8px 0; color: #333;">${data.address}</td>
        </tr>
        `
            : ""
        }
      </table>
    </div>
    
    <p style="color: #666; font-size: 14px; margin-bottom: 0;">
      View and manage this application in the <a href="https://sekhondogkennel.com/admin/applications" style="color: #2563eb;">admin dashboard</a>.
    </p>
  </div>
</body>
</html>
    `.trim(),
  };
}

export function applicationConfirmationEmail(data: { applicantName: string; dogName: string }): {
  subject: string;
  html: string;
} {
  return {
    subject: `Application Received for ${data.dogName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 32px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h1 style="color: #333; margin-top: 0;">Thank You for Your Application!</h1>
    <p style="color: #666; font-size: 16px;">Dear ${data.applicantName},</p>
    <p style="color: #666; font-size: 16px;">
      We've received your adoption application for <strong>${data.dogName}</strong>. Thank you for your interest in giving one of our dogs a loving home!
    </p>
    
    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 16px; margin: 24px 0;">
      <p style="color: #166534; margin: 0; font-size: 14px;">
        <strong>What's next?</strong><br>
        Our team will review your application and get back to you within 2-3 business days. We may reach out for additional information or to schedule a meet-and-greet with ${data.dogName}.
      </p>
    </div>
    
    <p style="color: #666; font-size: 16px;">
      If you have any questions in the meantime, feel free to contact us.
    </p>
    
    <p style="color: #666; font-size: 16px; margin-bottom: 0;">
      Best regards,<br>
      <strong>Sekhon Dog Kennel</strong>
    </p>
  </div>
</body>
</html>
    `.trim(),
  };
}
