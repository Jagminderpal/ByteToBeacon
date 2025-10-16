// Article data with full content and metadata
const articles = [
  {
    id: 1,
    title: "Welcome to ByteToBeacon",
    author: "Editorial Team",
    date: "2025-10-15",
    slug: "welcome-to-bytetobeacon",
    excerpt: "ByteToBeacon is your destination for technology insights, coding tutorials, and digital innovation stories.",
    content: "Welcome to ByteToBeacon, where technology meets innovation! Our platform serves as a bridge between the technical world of bytes and the guiding light of knowledge beacons. Here, developers, tech enthusiasts, and innovators come together to share insights, tutorials, and breakthrough ideas that shape the future of technology.\n\nOur mission is simple: to democratize knowledge sharing in the tech community. Whether you're a seasoned developer looking to share your expertise or a newcomer eager to learn, ByteToBeacon provides the perfect platform to connect, learn, and grow together.\n\nWhat makes ByteToBeacon unique is our commitment to quality content and community-driven learning. Every article published here goes through a careful review process to ensure accuracy and value for our readers. We believe that knowledge shared is knowledge multiplied, and together we can push the boundaries of what's possible in technology."
  },
  {
    id: 2,
    title: "The Future of Web Development in 2025",
    author: "Sarah Chen",
    date: "2025-10-14",
    slug: "future-web-development-2025",
    excerpt: "Exploring the cutting-edge trends and technologies that will define web development in the coming years.",
    content: "As we progress through 2025, web development continues to evolve at an unprecedented pace. The landscape is being reshaped by several key trends that developers must understand to stay competitive and build the next generation of web applications.\n\nArtificial Intelligence integration has become more than just a buzzword. AI-powered development tools are now helping developers write better code, catch bugs earlier, and even generate entire components. Tools like GitHub Copilot and ChatGPT have transformed how we approach problem-solving in development.\n\nEdge computing is revolutionizing how we think about performance. By processing data closer to users, we're seeing dramatic improvements in load times and user experience. Frameworks like Next.js and Remix are leading the charge in making edge deployment accessible to all developers.\n\nWebAssembly (WASM) is finally hitting its stride, allowing developers to run high-performance applications directly in the browser. This opens up possibilities for complex applications that were previously impossible on the web, from image editing to 3D modeling tools.\n\nThe rise of micro-frontends is changing how large organizations structure their development teams and applications. This architectural approach allows different teams to work independently while maintaining a cohesive user experience."
  },
  {
    id: 3,
    title: "Understanding Serverless Architecture",
    author: "Mike Rodriguez",
    date: "2025-10-13",
    slug: "understanding-serverless-architecture",
    excerpt: "A deep dive into serverless computing, its benefits, challenges, and best practices for modern applications.",
    content: "Serverless architecture represents a paradigm shift in how we build and deploy applications. Despite its name, serverless doesn't mean there are no servers – rather, it means developers don't need to manage server infrastructure directly.\n\nThe core principle of serverless is that you write code in the form of functions, and the cloud provider handles all the underlying infrastructure concerns: scaling, availability, security updates, and resource management. This allows developers to focus purely on business logic rather than infrastructure management.\n\nKey benefits include automatic scaling, cost efficiency (pay only for actual usage), reduced operational overhead, and faster time to market. However, serverless also comes with challenges: cold starts, vendor lock-in, debugging complexity, and potential performance limitations for certain use cases.\n\nBest practices for serverless development include keeping functions small and focused, managing dependencies carefully, implementing proper monitoring and logging, and designing for statelessness. Understanding these principles is crucial for successfully adopting serverless architecture in your projects.\n\nPopular serverless platforms include AWS Lambda, Vercel Functions, Netlify Functions, and Cloudflare Workers, each with their own strengths and ideal use cases."
  },
  {
    id: 4,
    title: "Building Responsive UIs with Modern CSS",
    author: "Alex Thompson",
    date: "2025-10-12",
    slug: "building-responsive-uis-modern-css",
    excerpt: "Master the latest CSS features and techniques for creating beautiful, responsive user interfaces.",
    content: "Modern CSS has evolved far beyond simple styling. Today's CSS specifications provide powerful tools for creating responsive, accessible, and visually stunning user interfaces that adapt seamlessly across devices and screen sizes.\n\nCSS Grid and Flexbox have revolutionized layout design. Grid excels at two-dimensional layouts, allowing precise control over both rows and columns, while Flexbox handles one-dimensional layouts with ease. Understanding when and how to use each is crucial for modern web development.\n\nContainer Queries represent the next evolution in responsive design. Unlike media queries that respond to viewport size, container queries allow components to respond to their parent container's size, enabling truly modular responsive design.\n\nCSS Custom Properties (variables) enable dynamic theming and reduce code duplication. Combined with calc() functions, they provide powerful tools for creating flexible, maintainable stylesheets.\n\nModern CSS features like aspect-ratio, gap property, logical properties, and the :has() pseudo-class selector are changing how we approach common styling challenges. These features reduce the need for JavaScript solutions and create more performant, maintainable code.\n\nThe key to mastering modern CSS is understanding progressive enhancement – using cutting-edge features while providing fallbacks for older browsers, ensuring your designs work everywhere while taking advantage of modern capabilities where available."
  }
];

// DOM Elements
const articlesGrid = document.getElementById('articlesGrid');
const postModalOverlay = document.getElementById('postModalOverlay');
const postArticleBtn = document.getElementById('postArticleBtn');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const articleForm = document.getElementById('articleForm');
const successMessage = document.getElementById('successMessage');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');
const submitBtn = document.getElementById('submitBtn');

// Navigation elements
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const homeLink = document.getElementById('homeLink');

// Page elements
const pages = {
  home: document.getElementById('homePage'),
  about: document.getElementById('aboutPage'),
  contact: document.getElementById('contactPage'),
  career: document.getElementById('careerPage'),
  article: document.getElementById('articleDetailPage')
};

// Contact form elements
const contactForm = document.getElementById('contactForm');
const contactSubmitBtn = document.getElementById('contactSubmitBtn');

// Article detail elements
const articleDetailContent = document.getElementById('articleDetailContent');

// Current page state
let currentPage = 'home';
let currentArticleId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeRouter();
  renderArticles();
  setupEventListeners();
  setupNavigation();
  setupMobileMenu();
});

// Router functionality
function initializeRouter() {
  // Handle initial page load
  const path = window.location.pathname;
  const hash = window.location.hash;
  
  if (hash.startsWith('#article-')) {
    const articleId = parseInt(hash.replace('#article-', ''));
    showArticleDetail(articleId);
  } else {
    handleRoute(path);
  }
  
  // Handle browser back/forward buttons
  window.addEventListener('popstate', function(e) {
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    if (hash.startsWith('#article-')) {
      const articleId = parseInt(hash.replace('#article-', ''));
      showArticleDetail(articleId);
    } else {
      handleRoute(path);
    }
  });
}

function handleRoute(path) {
  // Remove leading slash and handle empty path
  const route = path.replace('/', '') || 'home';
  
  // Map routes to pages
  const routeMap = {
    '': 'home',
    'home': 'home',
    'about': 'about',
    'contact': 'contact',
    'career': 'career'
  };
  
  const page = routeMap[route] || 'home';
  showPage(page);
}

function showPage(pageName) {
  // Hide all pages
  Object.values(pages).forEach(page => {
    if (page) page.classList.add('hidden');
  });
  
  // Show selected page
  if (pages[pageName]) {
    pages[pageName].classList.remove('hidden');
  }
  
  // Update current page
  currentPage = pageName;
  currentArticleId = null;
  
  // Update navigation
  updateNavigation(pageName);
  
  // Update page title
  updatePageTitle(pageName);
}

function updateNavigation(activePage) {
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === activePage) {
      link.classList.add('active');
    }
  });
}

function updatePageTitle(pageName) {
  const titles = {
    home: 'ByteToBeacon - Bridging Technology and Innovation',
    about: 'About - ByteToBeacon',
    contact: 'Contact - ByteToBeacon',
    career: 'Careers - ByteToBeacon'
  };
  
  document.title = titles[pageName] || titles.home;
}

function navigateToPage(pageName, pushState = true) {
  const routes = {
    home: '/',
    about: '/about',
    contact: '/contact',
    career: '/career'
  };
  
  const url = routes[pageName] || '/';
  
  if (pushState) {
    history.pushState({ page: pageName }, '', url);
  }
  
  showPage(pageName);
}

function setupNavigation() {
  // Handle navigation clicks
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.dataset.page;
      navigateToPage(page);
      closeMobileMenu();
    });
  });
  
  // Handle home link in logo
  if (homeLink) {
    homeLink.addEventListener('click', function(e) {
      e.preventDefault();
      navigateToPage('home');
    });
  }
  
  // Handle contact links in career page
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('contact-link')) {
      e.preventDefault();
      navigateToPage('contact');
    }
  });
}

function setupMobileMenu() {
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }
}

function closeMobileMenu() {
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.classList.remove('active');
    navMenu.classList.remove('active');
  }
}

// Render articles in the grid
function renderArticles() {
  if (!articlesGrid) return;
  
  articlesGrid.innerHTML = '';
  
  articles.forEach((article, index) => {
    const articleCard = document.createElement('div');
    articleCard.className = 'article-card';
    articleCard.innerHTML = `
      <h3 class="article-title">
        <a href="#article-${article.id}" class="article-link" data-article-id="${article.id}">
          ${escapeHtml(article.title)}
        </a>
      </h3>
      <p class="article-author">By ${escapeHtml(article.author)} • ${formatDate(article.date)}</p>
      <p class="article-preview">${escapeHtml(article.excerpt)}</p>
      <div class="article-actions">
        <button class="pdf-btn" onclick="generatePDF(${index})">
          Save as PDF
        </button>
      </div>
    `;
    articlesGrid.appendChild(articleCard);
  });
  
  // Add click handlers for article links
  const articleLinks = document.querySelectorAll('.article-link');
  articleLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const articleId = parseInt(this.dataset.articleId);
      showArticleDetail(articleId);
    });
  });
}

// Show article detail view
function showArticleDetail(articleId) {
  const article = articles.find(a => a.id === articleId);
  if (!article) return;
  
  // Update URL
  history.pushState({ page: 'article', articleId }, '', `#article-${articleId}`);
  
  // Hide all pages and show article detail
  Object.values(pages).forEach(page => {
    if (page) page.classList.add('hidden');
  });
  
  if (pages.article) {
    pages.article.classList.remove('hidden');
  }
  
  // Update current state
  currentPage = 'article';
  currentArticleId = articleId;
  
  // Update page title
  document.title = `${article.title} - ByteToBeacon`;
  
  // Render article content
  if (articleDetailContent) {
    articleDetailContent.innerHTML = `
      <div class="article-detail-header">
        <h1 class="article-detail-title">${escapeHtml(article.title)}</h1>
        <div class="article-detail-meta">
          By ${escapeHtml(article.author)} • ${formatDate(article.date)}
        </div>
      </div>
      
      <div class="article-detail-content">
        ${formatArticleContent(article.content)}
      </div>
      
      <div class="article-detail-actions">
        <button class="btn back-btn" onclick="goBack()">← Back to Articles</button>
        <button class="btn btn--primary" onclick="generateArticlePDF(${articleId})">
          Save as PDF
        </button>
      </div>
      
      <div class="share-url">
        <label for="shareUrlInput">Share this article:</label>
        <input type="text" id="shareUrlInput" value="${window.location.origin}#article-${articleId}" readonly onclick="this.select()">
      </div>
    `;
  }
}

function goBack() {
  navigateToPage('home');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function formatArticleContent(content) {
  // Convert line breaks to paragraphs
  return content.split('\n\n').map(paragraph => 
    `<p>${escapeHtml(paragraph)}</p>`
  ).join('');
}

// Setup event listeners
function setupEventListeners() {
  // Modal controls
  if (postArticleBtn) postArticleBtn.addEventListener('click', openModal);
  if (closeModal) closeModal.addEventListener('click', closeModalHandler);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModalHandler);
  
  // Close modal when clicking outside
  if (postModalOverlay) {
    postModalOverlay.addEventListener('click', function(e) {
      if (e.target === postModalOverlay) {
        closeModalHandler();
      }
    });
  }
  
  // Form submissions
  if (articleForm) articleForm.addEventListener('submit', handleFormSubmit);
  if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);
  
  // Success message
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeSuccessMessage);
  
  // Close success message when clicking outside
  if (successMessage) {
    successMessage.addEventListener('click', function(e) {
      if (e.target === successMessage) {
        closeSuccessMessage();
      }
    });
  }
  
  // Escape key to close modals
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (postModalOverlay && postModalOverlay.classList.contains('active')) {
        closeModalHandler();
      }
      if (successMessage && successMessage.classList.contains('active')) {
        closeSuccessMessage();
      }
    }
  });
}

// Modal functions
function openModal() {
  postModalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  // Focus on the first input
  setTimeout(() => {
    document.getElementById('authorName').focus();
  }, 100);
}

function closeModalHandler() {
  postModalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  resetForm();
}

function resetForm() {
  articleForm.reset();
  submitBtn.textContent = 'Submit Article';
  submitBtn.disabled = false;
  submitBtn.classList.remove('loading');
}

// Success message functions
function showSuccessMessage() {
  successMessage.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSuccessMessage() {
  successMessage.classList.remove('active');
  document.body.style.overflow = '';
}

// Form submission handler
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(articleForm);
  const submitButton = submitBtn;
  
  // Validate required fields
  const authorName = formData.get('authorName').trim();
  const authorEmail = formData.get('authorEmail').trim();
  const articleTitle = formData.get('articleTitle').trim();
  const articleContent = formData.get('articleContent').trim();
  
  if (!authorName || !authorEmail || !articleTitle || !articleContent) {
    alert('Please fill in all required fields.');
    return;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(authorEmail)) {
    alert('Please enter a valid email address.');
    return;
  }
  
  // Show loading state
  submitButton.textContent = 'Submitting...';
  submitButton.disabled = true;
  submitButton.classList.add('loading');
  
  try {
    // Prepare form data for submission
    const submissionData = new FormData();
    submissionData.append('authorName', authorName);
    submissionData.append('authorEmail', authorEmail);
    submissionData.append('articleTitle', articleTitle);
    submissionData.append('articleContent', articleContent);
    
    // Add PDF file if selected
    const pdfFile = formData.get('pdfFile');
    if (pdfFile && pdfFile.size > 0) {
      submissionData.append('pdfFile', pdfFile);
    }
    
    // Submit to Netlify function
    const response = await fetch('/.netlify/functions/send-article-email', {
      method: 'POST',
      body: submissionData
    });
    
    if (response.ok) {
      // Success - close modal and show success message
      closeModalHandler();
      setTimeout(() => {
        showSuccessMessage();
      }, 300);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('There was an error submitting your article. Please try again later.');
  } finally {
    // Reset button state
    submitButton.textContent = 'Submit Article';
    submitButton.disabled = false;
    submitButton.classList.remove('loading');
  }
}

// PDF generation functions
function generatePDF(articleIndex) {
  const article = articles[articleIndex];
  if (!article) {
    alert('Article not found.');
    return;
  }
  
  createPrintWindow(article);
}

function generateArticlePDF(articleId) {
  const article = articles.find(a => a.id === articleId);
  if (!article) {
    alert('Article not found.');
    return;
  }
  
  createPrintWindow(article);
}

function createPrintWindow(article) {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow popups to generate PDF.');
    return;
  }
  
  // Create the print-friendly HTML
  const printContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${escapeHtml(article.title)} - ByteToBeacon</title>
        <style>
            body {
                font-family: 'Times New Roman', serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
            }
            .header {
                border-bottom: 3px solid #00ab6c;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .site-name {
                color: #00ab6c;
                font-size: 18px;
                font-weight: bold;
                margin: 0;
            }
            .article-title {
                font-size: 28px;
                font-weight: bold;
                color: #2c3e50;
                margin: 20px 0 10px 0;
                line-height: 1.3;
            }
            .article-meta {
                color: #666;
                font-style: italic;
                margin-bottom: 30px;
                font-size: 14px;
            }
            .article-content {
                font-size: 16px;
                line-height: 1.8;
                color: #444;
            }
            .article-content p {
                margin-bottom: 16px;
            }
            .footer {
                margin-top: 50px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                text-align: center;
                color: #888;
                font-size: 12px;
            }
            @media print {
                body { margin: 0; padding: 20px; }
                .header { page-break-inside: avoid; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <p class="site-name">ByteToBeacon</p>
        </div>
        <h1 class="article-title">${escapeHtml(article.title)}</h1>
        <p class="article-meta">By ${escapeHtml(article.author)} • ${formatDate(article.date)}</p>
        <div class="article-content">
            ${formatArticleContent(article.content)}
        </div>
        <div class="footer">
            <p>Downloaded from ByteToBeacon - Bridging Technology and Innovation</p>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
    </body>
    </html>
  `;
  
  // Write content to the new window
  printWindow.document.write(printContent);
  printWindow.document.close();
  
  // Wait for the content to load, then trigger print
  printWindow.onload = function() {
    setTimeout(() => {
      printWindow.print();
      // Close the window after printing
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    }, 500);
  };
}

// Contact form submission handler
async function handleContactSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(contactForm);
  const submitButton = contactSubmitBtn;
  
  // Validate required fields
  const name = formData.get('contactName').trim();
  const email = formData.get('contactEmail').trim();
  const subject = formData.get('contactSubject').trim();
  const message = formData.get('contactMessage').trim();
  
  if (!name || !email || !subject || !message) {
    alert('Please fill in all required fields.');
    return;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }
  
  // Show loading state
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Sending...';
  submitButton.disabled = true;
  submitButton.classList.add('loading');
  
  try {
    // Prepare form data for submission
    const submissionData = new FormData();
    submissionData.append('name', name);
    submissionData.append('email', email);
    submissionData.append('subject', subject);
    submissionData.append('message', message);
    submissionData.append('formType', 'contact');
    
    // Submit to contact endpoint
    const response = await fetch('/.netlify/functions/send-contact-email', {
      method: 'POST',
      body: submissionData
    });
    
    if (response.ok) {
      // Success - show success message and reset form
      alert('Message sent successfully! We\'ll get back to you within 24-48 hours.');
      contactForm.reset();
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
  } catch (error) {
    console.error('Error submitting contact form:', error);
    alert('There was an error sending your message. Please try again later.');
  } finally {
    // Reset button state
    submitButton.textContent = originalText;
    submitButton.disabled = false;
    submitButton.classList.remove('loading');
  }
}

// Utility function to escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Smooth scrolling for better UX
function smoothScrollTo(element) {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

// Add some visual feedback for form interactions
document.addEventListener('DOMContentLoaded', function() {
  const inputs = document.querySelectorAll('.form-control');
  
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
    });
  });
});

// Handle hash changes for direct article links
window.addEventListener('hashchange', function() {
  const hash = window.location.hash;
  if (hash.startsWith('#article-')) {
    const articleId = parseInt(hash.replace('#article-', ''));
    showArticleDetail(articleId);
  }
});