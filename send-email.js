const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "OK",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const requestData = JSON.parse(event.body);
    const { type } = requestData; // 'article' or 'contact'

    // Gmail configuration
    const GMAIL_USER = process.env.GMAIL_USER || "your-email@gmail.com";
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || "your-16-char-app-password";
    const TO_EMAIL = process.env.TO_EMAIL || "your-receiving-email@gmail.com";

    // Create Gmail transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    let mailOptions;

    if (type === 'article') {
      // Handle article submission
      const { authorName, authorEmail, articleTitle, articleContent, attachment } = requestData;

      if (!authorName || !authorEmail || !articleTitle || !articleContent) {
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ error: "Missing required fields" }),
        };
      }

      mailOptions = {
        from: `"ByteToBeacon Submissions" <${GMAIL_USER}>`,
        to: TO_EMAIL,
        replyTo: authorEmail,
        subject: `[ByteToBeacon] New Article: ${articleTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #00ab6c; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">📝 ByteToBeacon</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">New Article Submission</p>
            </div>

            <div style="padding: 30px;">
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #00ab6c;">
                <h2 style="margin-top: 0; color: #333;">${articleTitle}</h2>
                <p style="margin: 10px 0 5px 0; color: #666;"><strong>👤 Author:</strong> ${authorName}</p>
                <p style="margin: 5px 0; color: #666;"><strong>📧 Email:</strong> <a href="mailto:${authorEmail}" style="color: #00ab6c;">${authorEmail}</a></p>
              </div>

              <div style="margin: 20px 0;">
                <h3 style="color: #333; border-bottom: 2px solid #00ab6c; padding-bottom: 10px;">📖 Article Content</h3>
                <div style="background: #ffffff; border: 2px solid #e9ecef; padding: 20px; border-radius: 8px; white-space: pre-wrap; line-height: 1.6; color: #333;">${articleContent}</div>
              </div>

              ${attachment ? `
              <div style="background: #e7f3ff; border: 1px solid #b3d9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #0066cc;"><strong>📎 PDF Attachment:</strong> ${attachment.filename}</p>
              </div>
              ` : ''}

              <div style="background: #f1f1f1; padding: 15px; border-radius: 8px; margin-top: 30px; text-align: center;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  💡 <em>Reply to respond directly to ${authorName}</em><br>
                  🚀 <em>Powered by ByteToBeacon</em>
                </p>
              </div>
            </div>
          </div>
        `,
        attachments: [],
      };

      if (attachment && attachment.base64 && attachment.filename) {
        mailOptions.attachments.push({
          filename: attachment.filename,
          content: Buffer.from(attachment.base64, "base64"),
          contentType: "application/pdf",
        });
      }

    } else if (type === 'contact') {
      // Handle contact form submission
      const { name, email, subject, message } = requestData;

      if (!name || !email || !subject || !message) {
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ error: "Missing required fields" }),
        };
      }

      mailOptions = {
        from: `"ByteToBeacon Contact" <${GMAIL_USER}>`,
        to: TO_EMAIL,
        replyTo: email,
        subject: `[ByteToBeacon Contact] ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #00ab6c; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">📧 ByteToBeacon</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Contact Form Message</p>
            </div>

            <div style="padding: 30px;">
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #00ab6c;">
                <h2 style="margin-top: 0; color: #333;">${subject}</h2>
                <p style="margin: 10px 0 5px 0; color: #666;"><strong>👤 Name:</strong> ${name}</p>
                <p style="margin: 5px 0; color: #666;"><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #00ab6c;">${email}</a></p>
              </div>

              <div style="margin: 20px 0;">
                <h3 style="color: #333; border-bottom: 2px solid #00ab6c; padding-bottom: 10px;">💬 Message</h3>
                <div style="background: #ffffff; border: 2px solid #e9ecef; padding: 20px; border-radius: 8px; white-space: pre-wrap; line-height: 1.6; color: #333;">${message}</div>
              </div>

              <div style="background: #f1f1f1; padding: 15px; border-radius: 8px; margin-top: 30px; text-align: center;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  💡 <em>Reply to respond directly to ${name}</em><br>
                  🚀 <em>Powered by ByteToBeacon</em>
                </p>
              </div>
            </div>
          </div>
        `,
      };

    } else {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Invalid submission type" }),
      };
    }

    // Send email
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ 
        success: true, 
        message: type === 'article' 
          ? "✅ Article sent successfully! We'll review your submission." 
          : "✅ Message sent successfully! We'll get back to you soon."
      }),
    };

  } catch (error) {
    console.error("Email sending error:", error);

    let errorMessage = "Failed to send email";
    if (error.code === "EAUTH") {
      errorMessage = "❌ Gmail authentication failed. Please check email settings.";
    } else if (error.code === "ECONNECTION") {
      errorMessage = "❌ Connection failed. Please try again.";
    }

    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};