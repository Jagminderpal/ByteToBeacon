import os

# Create updated Netlify functions for both article and contact form submissions
os.makedirs("netlify/functions", exist_ok=True)

# Updated function to handle both article and contact submissions
email_handler_function = '''const nodemailer = require("nodemailer");

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
};'''

# Create updated package.json for the multi-page site
updated_package_json = '''{
  "name": "bytetobeacon-multipage",
  "version": "2.0.0",
  "description": "ByteToBeacon - Multi-page blog platform with navigation, articles, about, contact, and career pages",
  "private": true,
  "scripts": {
    "build": "echo 'Static multi-page site - no build required'",
    "dev": "echo 'Use live server for local development'"
  },
  "dependencies": {
    "nodemailer": "^6.9.7"
  },
  "keywords": [
    "blog",
    "multi-page",
    "articles",
    "netlify",
    "static-site",
    "navigation",
    "contact-form"
  ],
  "author": "ByteToBeacon Team",
  "license": "MIT"
}'''

# Create updated netlify.toml
updated_netlify_toml = '''[build]
  publish = "."
  
[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

# Redirect rules for client-side routing
[[redirects]]
  from = "/about"
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/contact" 
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/career"
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/article/*"
  to = "/index.html"
  status = 200

# Headers for security and caching
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.html"
  [headers.values]
    Cache-Control = "public, max-age=3600"'''

# Create comprehensive README for the multi-page site
multipage_readme = '''# ByteToBeacon - Multi-Page Blog Platform

A comprehensive Medium-style blog platform with full navigation, multiple pages, and enhanced functionality.

## 🌟 Features

### Navigation & Pages
- 📱 **Responsive Navigation Bar** with hamburger menu for mobile
- 🏠 **Home Page** - Article grid with clickable titles and shareable URLs
- ℹ️ **About Page** - Website information and code of conduct
- 📞 **Contact Page** - Contact form with email functionality
- 💼 **Career Page** - Job opportunities (currently no openings)

### Article Features
- 🔗 **Shareable Article URLs** - Each article has a unique, shareable link
- 📄 **Save as PDF** - Export any article as PDF
- 📝 **Article Submission** - Submit new articles via modal form
- 👤 **Author Information** - Display author names and contact details

### Enhanced Functionality
- 📧 **Dual Email System** - Handles both article submissions and contact messages
- 🎨 **Professional Design** - Consistent ByteToBeacon branding throughout
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🔍 **SEO Friendly** - Proper page titles and meta descriptions

## 🚀 Quick Deploy Guide

### 1. Upload to GitHub
Create a new repository and upload all files:
```
bytetobeacon-multipage/
├── index.html              (Main application)
├── styles.css              (Global styles) 
├── script.js               (JavaScript functionality)
├── package.json            (Dependencies)
├── netlify.toml            (Netlify configuration)
├── README.md               (This file)
└── netlify/
    └── functions/
        └── send-email.js   (Email handler for both forms)
```

### 2. Connect to Netlify
- Import repository to Netlify
- Auto-detects configuration from netlify.toml
- Includes redirect rules for client-side routing

### 3. Configure Gmail Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GMAIL_USER` | Your Gmail address | `your-email@gmail.com` |
| `GMAIL_APP_PASSWORD` | 16-character app password | `abcd efgh ijkl mnop` |
| `TO_EMAIL` | Where to receive emails | `admin@bytetobeacon.com` |

### 4. Gmail App Password Setup
1. Enable 2-Factor Authentication on Gmail
2. Go to Google Account → Security → 2-Step Verification
3. Click "App passwords" → Mail → Other (ByteToBeacon)
4. Copy the 16-character password

## 📄 Page Structure

### Home Page (/)
- **Navigation bar** with all menu items
- **Article grid** showing title, author, excerpt
- **Clickable article titles** that create shareable URLs
- **"Post an Article"** button opens submission modal
- **"Save as PDF"** button for each article

### About Page (/about)
- **Mission statement** and website purpose
- **Vision and values** of ByteToBeacon
- **Code of conduct** with community guidelines
- **Professional layout** with consistent branding

### Contact Page (/contact)
- **Contact form** with Name, Email, Subject, Message fields
- **Email integration** sends messages to site admin
- **Contact information** and response time expectations
- **Professional styling** matching site theme

### Career Page (/career)
- **Current status** - No open positions message
- **Future opportunities** information
- **Contact invitation** for interested candidates
- **Professional layout** ready for future job listings

### Article Detail View (/article/[id])
- **Full article content** with proper formatting
- **Author information** and publication date
- **Shareable URL** structure for direct linking
- **"Save as PDF"** functionality
- **Back to home** navigation

## 🔧 Technical Features

### Client-Side Routing
- Handles URLs like `/about`, `/contact`, `/career`, `/article/1`
- Proper browser history management
- SEO-friendly URL structure
- No page reloads when navigating

### Email Functionality
- **Dual handler** for article submissions and contact messages
- **Beautiful HTML emails** with ByteToBeacon branding
- **PDF attachment support** for article submissions
- **Reply-to functionality** for direct communication

### Responsive Design
- **Mobile-first approach** with breakpoints
- **Hamburger menu** for mobile navigation
- **Flexible grid layouts** that adapt to screen size
- **Touch-friendly** buttons and interactions

## 🎨 Customization

### Adding New Articles
Edit the `articles` array in the JavaScript:
```javascript
{
  id: 5,
  title: "Your New Article",
  author: "Author Name",
  date: "2025-10-15",
  slug: "your-new-article",
  excerpt: "Brief description...",
  content: "Full article content..."
}
```

### Styling Changes
- Edit CSS custom properties in `:root` for color scheme
- Modify component styles in the CSS file
- All colors use the `--primary-color` variable for consistency

### Navigation Menu
Update the navigation array to add/remove menu items:
```javascript
const navigation = [
  { name: "Home", url: "/" },
  { name: "About", url: "/about" },
  // Add new pages here
];
```

## 📧 Email Templates

### Article Submission Email
- **Professional header** with ByteToBeacon branding
- **Author information** section with contact details
- **Full article content** in readable format
- **PDF attachment** handling (if provided)
- **Reply-to** set to article author

### Contact Form Email
- **Clean header** with contact form identification
- **Sender details** with name and email
- **Subject line** preservation
- **Message content** with proper formatting
- **Direct reply** functionality

## 🔍 SEO & Performance

### SEO Features
- **Dynamic page titles** for each route
- **Meta descriptions** for better search visibility
- **Semantic HTML** structure throughout
- **Clean URL structure** for article sharing

### Performance Optimizations
- **Minimal JavaScript** for fast loading
- **CSS Grid/Flexbox** for efficient layouts
- **Optimized images** and assets
- **Client-side routing** for smooth navigation

## 🛠️ Development

### Local Development
1. Use any static file server (Live Server in VS Code)
2. Email functionality only works when deployed to Netlify
3. Test routing by manually changing URLs

### Adding New Pages
1. Add route to navigation array
2. Create page template in JavaScript
3. Add redirect rule to netlify.toml
4. Update router function

## 📞 Support

**Common Issues:**
- **Email not sending:** Check Gmail app password and environment variables
- **Navigation not working:** Verify netlify.toml redirect rules
- **Articles not displaying:** Check JavaScript console for errors

**Environment Variables Required:**
- `GMAIL_USER`: Your Gmail address
- `GMAIL_APP_PASSWORD`: Gmail app password (16 characters)
- `TO_EMAIL`: Recipient email for all submissions

---

Built with ❤️ for the ByteToBeacon community | Multi-page architecture ready for scaling
'''

# Write all the updated files
files_to_create = [
    ("netlify/functions/send-email.js", email_handler_function),
    ("package.json", updated_package_json),
    ("netlify.toml", updated_netlify_toml),
    ("README.md", multipage_readme)
]

for filename, content in files_to_create:
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)

print("✅ Multi-page ByteToBeacon site ready!")
print("\n🌟 New Features Added:")
print("  📱 Responsive navigation bar with hamburger menu")
print("  🏠 Home page with shareable article URLs")
print("  ℹ️ About page with mission and code of conduct")
print("  📞 Contact page with email form")
print("  💼 Career page (no current openings)")
print("  🔗 Clickable article titles with shareable links")
print("  📧 Dual email system for articles and contact")
print("\n🎯 Enhanced Functionality:")
print("  ✅ Client-side routing (/about, /contact, /career, /article/1)")
print("  ✅ Shareable article URLs")
print("  ✅ Mobile-responsive design")
print("  ✅ Professional navigation")
print("  ✅ SEO-friendly structure")
print("  ✅ Gmail integration for all forms")
print("\n📁 Directory Structure:")
print("  / (from web app + enhanced files)")
print("  ├── index.html")
print("  ├── styles.css") 
print("  ├── script.js")
print("  ├── package.json")
print("  ├── netlify.toml")
print("  ├── README.md")
print("  └── netlify/functions/send-email.js")
print("\n🚀 Ready to deploy with full navigation and shareable articles!")