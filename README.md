# ByteToBeacon - Multi-Page Blog Platform

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
