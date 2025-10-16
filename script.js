// ByteToBeacon - Main JavaScript File
// Handles routing, search, article management, and form submissions

// Global state management
let allArticles = [];
let currentRoute = '/';
let searchQuery = '';
let searchTimeout = null;

// Configuration
const CONFIG = {
  SEARCH_DEBOUNCE_DELAY: 300,
  MIN_SEARCH_LENGTH: 2,
  ARTICLES_DATA_URL: '/data/articles.json',
  EMAIL_ENDPOINT: '/.netlify/functions/send-email'
};

// Site content data
const SITE_DATA = {
  about: {
    mission: "ByteToBeacon serves as a bridge between the technical world of bytes and the guiding light of knowledge beacons. We empower developers, engineers, and technology enthusiasts with cutting-edge insights, practical tutorials, and innovative solutions that drive the future of software development.",
    vision: "To become the premier destination for high-quality technical content, fostering a global community where knowledge flows freely and innovation thrives through collaboration and shared learning.",
    values: [
      "Quality: Every article undergoes rigorous review to ensure accuracy and practical value",
      "Innovation: We embrace emerging technologies and forward-thinking development practices", 
      "Community: Building connections through shared knowledge and collaborative learning",
      "Accessibility: Making complex technical concepts understandable for all skill levels",
      "Integrity: Maintaining honest, unbiased, and transparent technical discussions"
    ],
    codeOfConduct: [
      {
        title: "Respectful Communication",
        description: "Treat all community members with respect regardless of experience level, background, or technical opinions. Personal attacks and discriminatory language are strictly prohibited."
      },
      {
        title: "Quality Content Standards", 
        description: "Submit original, well-researched content that provides genuine value. Plagiarism, spam, or deliberately misleading information will result in content removal."
      },
      {
        title: "Constructive Feedback",
        description: "Focus feedback on content rather than individuals. Provide specific, actionable suggestions that help improve technical accuracy and clarity."
      },
      {
        title: "Professional Conduct",
        description: "Maintain professional standards in all interactions. Avoid excessive self-promotion and focus on contributing meaningful technical discussions."
      },
      {
        title: "Intellectual Property Respect",
        description: "Always credit original sources and respect copyright. When sharing code or concepts, ensure proper attribution and licensing compliance."
      },
      {
        title: "Relevance and Focus",
        description: "Keep discussions relevant to technology, software development, and innovation. Off-topic content may be moderated to maintain community focus."
      }
    ]
  },
  contact: {
    description: "Connect with the ByteToBeacon team for partnerships, content submissions, or technical discussions.",
    email: "team@bytetobeacon.com",
    responseTime: "We typically respond within 24-48 hours during business days",
    officeHours: "Monday - Friday, 9:00 AM - 5:00 PM GMT"
  },
  career: {
    status: "No Open Positions Currently",
    headline: "Join Our Growing Tech Community",
    message: "While we don't have open positions at the moment, we're always interested in connecting with talented developers, technical writers, and innovation leaders who share our passion for cutting-edge technology.",
    futureOpportunities: [
      "Senior Full-Stack Developers",
      "Technical Content Writers", 
      "Developer Relations Engineers",
      "Community Managers"
    ],
    inquiryMessage: "Interested in future opportunities? We'd love to hear from you through our contact form."
  }
};

// DOM elements
let elements = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

async function initializeApp() {
  try {
    // Cache DOM elements
    cacheElements();

    // Load articles data
    await loadArticles();

    // Set up event listeners
    setupEventListeners();

    // Initialize routing
    initializeRouter();

    // Handle initial route
    handleRoute();

    console.log('ByteToBeacon initialized successfully');
  } catch (error) {
    console.error('Failed to initialize ByteToBeacon:', error);
    showError('Failed to load the application. Please refresh the page.');
  }
}

function cacheElements() {
  elements = {
    // Navigation
    hamburgerBtn: document.getElementById('hamburgerBtn'),
    mobileMenu: document.getElementById('mobileMenu'),
    navLinks: document.querySelectorAll('.nav-link'),

    // Search
    searchInput: document.getElementById('searchInput'),
    searchResults: document.getElementById('searchResults'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),

    // Main content
    mainContent: document.getElementById('mainContent'),
    articlesGrid: document.getElementById('articlesGrid'),

    // Modals
    articleModal: document.getElementById('articleModal'),
    contactModal: document.getElementById('contactModal'),

    // Forms
    articleForm: document.getElementById('articleForm'),
    contactForm: document.getElementById('contactForm'),

    // Buttons
    postArticleBtn: document.getElementById('postArticleBtn'),
    closeModalBtns: document.querySelectorAll('.close-modal')
  };
}

async function loadArticles() {
  try {
    const response = await fetch(CONFIG.ARTICLES_DATA_URL);
    if (!response.ok) {
      throw new Error(`Failed to load articles: ${response.status}`);
    }

    const data = await response.json();
    allArticles = data.articles || [];

    console.log(`Loaded ${allArticles.length} articles`);
    return allArticles;
  } catch (error) {
    console.error('Error loading articles:', error);
    // Fallback to empty array with error message
    allArticles = [];
    showError('Failed to load articles. Please check your connection and refresh the page.');
    throw error;
  }
}

function setupEventListeners() {
  // Navigation
  if (elements.hamburgerBtn) {
    elements.hamburgerBtn.addEventListener('click', toggleMobileMenu);
  }

  elements.navLinks.forEach(link => {
    link.addEventListener('click', handleNavClick);
  });

  // Search
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', handleSearchInput);
    elements.searchInput.addEventListener('keydown', handleSearchKeydown);
  }

  if (elements.clearSearchBtn) {
    elements.clearSearchBtn.addEventListener('click', clearSearch);
  }

  // Modal controls
  if (elements.postArticleBtn) {
    elements.postArticleBtn.addEventListener('click', openArticleModal);
  }

  elements.closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeModals);
  });

  // Forms
  if (elements.articleForm) {
    elements.articleForm.addEventListener('submit', handleArticleSubmission);
  }

  if (elements.contactForm) {
    elements.contactForm.addEventListener('submit', handleContactSubmission);
  }

  // Global event listeners
  window.addEventListener('popstate', handleRoute);
  window.addEventListener('click', handleGlobalClick);

  // Close modals on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModals();
    }
  });
}

// Navigation functions
function toggleMobileMenu() {
  if (elements.mobileMenu) {
    elements.mobileMenu.classList.toggle('active');
  }
}

function handleNavClick(e) {
  e.preventDefault();
  const href = e.target.getAttribute('href');
  if (href) {
    navigateTo(href);
    toggleMobileMenu(); // Close mobile menu after navigation
  }
}

function handleGlobalClick(e) {
  // Close mobile menu when clicking outside
  if (elements.mobileMenu && 
      elements.mobileMenu.classList.contains('active') && 
      !elements.mobileMenu.contains(e.target) && 
      !elements.hamburgerBtn.contains(e.target)) {
    toggleMobileMenu();
  }

  // Handle article links
  if (e.target.closest('.article-title-link')) {
    e.preventDefault();
    const href = e.target.closest('.article-title-link').getAttribute('href');
    navigateTo(href);
  }

  // Handle PDF generation
  if (e.target.closest('.generate-pdf-btn')) {
    e.preventDefault();
    const articleId = e.target.closest('.generate-pdf-btn').dataset.articleId;
    generateArticlePDF(parseInt(articleId));
  }
}

// Router functions
function initializeRouter() {
  // Update current route based on URL
  currentRoute = window.location.pathname;
}

function navigateTo(path) {
  if (path !== currentRoute) {
    currentRoute = path;
    window.history.pushState(null, '', path);
    handleRoute();
  }
}

function handleRoute() {
  const path = window.location.pathname;
  currentRoute = path;

  // Update active nav link
  updateActiveNavLink(path);

  // Route to appropriate page
  if (path === '/' || path === '/home') {
    showHomePage();
  } else if (path === '/about') {
    showAboutPage();
  } else if (path === '/contact') {
    showContactPage();
  } else if (path === '/career') {
    showCareerPage();
  } else if (path.startsWith('/article/')) {
    const slug = path.split('/article/')[1];
    showArticlePage(slug);
  } else {
    show404Page();
  }
}

function updateActiveNavLink(path) {
  elements.navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if ((path === '/' && href === '/') || (path !== '/' && href === path)) {
      link.classList.add('active');
    }
  });
}

// Search functions
function handleSearchInput(e) {
  const query = e.target.value.trim();

  // Clear existing timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // Debounce search
  searchTimeout = setTimeout(() => {
    performSearch(query);
  }, CONFIG.SEARCH_DEBOUNCE_DELAY);

  // Show/hide clear button
  if (elements.clearSearchBtn) {
    elements.clearSearchBtn.style.display = query ? 'block' : 'none';
  }
}

function handleSearchKeydown(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const query = e.target.value.trim();
    performSearch(query);
  }
}

function performSearch(query) {
  searchQuery = query;

  if (query.length < CONFIG.MIN_SEARCH_LENGTH) {
    showAllArticles();
    return;
  }

  const filteredArticles = filterArticles(query);
  displaySearchResults(filteredArticles, query);
}

function filterArticles(query) {
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

  return allArticles.filter(article => {
    const searchableContent = [
      article.title,
      article.author,
      article.content,
      article.category,
      ...(article.tags || [])
    ].join(' ').toLowerCase();

    return searchTerms.every(term => searchableContent.includes(term));
  });
}

function displaySearchResults(articles, query) {
  if (!elements.articlesGrid) return;

  if (articles.length === 0) {
    elements.articlesGrid.innerHTML = `
      <div class="no-results">
        <h3>No articles found</h3>
        <p>No articles match your search for "${escapeHtml(query)}". Try different keywords or browse all articles.</p>
        <button onclick="clearSearch()" class="btn btn-primary">Show All Articles</button>
      </div>
    `;
    return;
  }

  displayArticles(articles, query);
}

function clearSearch() {
  if (elements.searchInput) {
    elements.searchInput.value = '';
  }
  if (elements.clearSearchBtn) {
    elements.clearSearchBtn.style.display = 'none';
  }
  searchQuery = '';
  showAllArticles();
}

// Page rendering functions
function showHomePage() {
  document.title = 'ByteToBeacon - Bridging Technology and Innovation';

  if (searchQuery) {
    const filteredArticles = filterArticles(searchQuery);
    displaySearchResults(filteredArticles, searchQuery);
  } else {
    showAllArticles();
  }

  // Update main content
  if (elements.mainContent) {
    elements.mainContent.innerHTML = `
      <section class="hero-section">
        <div class="hero-content">
          <h1>Welcome to ByteToBeacon</h1>
          <p class="hero-subtitle">Your destination for cutting-edge insights in software development, AI, and technology innovation</p>
        </div>
      </section>

      <section class="articles-section">
        <div class="section-header">
          <h2>Latest Articles</h2>
          <div class="article-stats">
            <span class="article-count">${allArticles.length} articles</span>
          </div>
        </div>
        <div id="articlesGrid" class="articles-grid">
          ${elements.articlesGrid ? elements.articlesGrid.innerHTML : ''}
        </div>
      </section>
    `;

    // Re-cache the articles grid element
    elements.articlesGrid = document.getElementById('articlesGrid');

    if (searchQuery) {
      const filteredArticles = filterArticles(searchQuery);
      displaySearchResults(filteredArticles, searchQuery);
    } else {
      showAllArticles();
    }
  }
}

function showAllArticles() {
  displayArticles(allArticles);
}

function displayArticles(articles, highlightQuery = '') {
  if (!elements.articlesGrid) return;

  if (articles.length === 0) {
    elements.articlesGrid.innerHTML = `
      <div class="no-articles">
        <h3>No articles available</h3>
        <p>Articles are being loaded. Please check back soon.</p>
      </div>
    `;
    return;
  }

  const articlesHTML = articles.map(article => createArticleCard(article, highlightQuery)).join('');
  elements.articlesGrid.innerHTML = articlesHTML;
}

function createArticleCard(article, highlightQuery = '') {
  const highlightedTitle = highlightQuery ? 
    highlightText(article.title, highlightQuery) : 
    escapeHtml(article.title);

  const highlightedAuthor = highlightQuery ? 
    highlightText(article.author, highlightQuery) : 
    escapeHtml(article.author);

  const highlightedExcerpt = highlightQuery ? 
    highlightText(article.excerpt, highlightQuery) : 
    escapeHtml(article.excerpt);

  return `
    <article class="article-card">
      <div class="article-content">
        <div class="article-meta">
          <span class="article-category">${escapeHtml(article.category)}</span>
          <span class="article-date">${formatDate(article.date)}</span>
        </div>

        <h3 class="article-title">
          <a href="/article/${article.slug}" class="article-title-link">
            ${highlightedTitle}
          </a>
        </h3>

        <div class="article-author">
          By ${highlightedAuthor}
        </div>

        <p class="article-excerpt">${highlightedExcerpt}</p>

        <div class="article-tags">
          ${(article.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
        </div>

        <div class="article-footer">
          <span class="read-time">${escapeHtml(article.readTime)}</span>
          <button class="btn btn-secondary generate-pdf-btn" data-article-id="${article.id}">
            Save as PDF
          </button>
        </div>
      </div>
    </article>
  `;
}

function showAboutPage() {
  document.title = 'About - ByteToBeacon';

  if (elements.mainContent) {
    elements.mainContent.innerHTML = `
      <div class="page-content">
        <div class="page-header">
          <h1>About ByteToBeacon</h1>
          <p class="page-subtitle">Bridging Technology and Innovation</p>
        </div>

        <section class="content-section">
          <h2>Our Mission</h2>
          <p>${SITE_DATA.about.mission}</p>
        </section>

        <section class="content-section">
          <h2>Our Vision</h2>
          <p>${SITE_DATA.about.vision}</p>
        </section>

        <section class="content-section">
          <h2>Our Values</h2>
          <ul class="values-list">
            ${SITE_DATA.about.values.map(value => `<li>${escapeHtml(value)}</li>`).join('')}
          </ul>
        </section>

        <section class="content-section">
          <h2>Community Code of Conduct</h2>
          <div class="code-of-conduct">
            ${SITE_DATA.about.codeOfConduct.map(item => `
              <div class="conduct-item">
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.description)}</p>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;
  }
}

function showContactPage() {
  document.title = 'Contact - ByteToBeacon';

  if (elements.mainContent) {
    elements.mainContent.innerHTML = `
      <div class="page-content">
        <div class="page-header">
          <h1>Contact Us</h1>
          <p class="page-subtitle">${SITE_DATA.contact.description}</p>
        </div>

        <div class="contact-content">
          <div class="contact-info">
            <h2>Get in Touch</h2>
            <div class="contact-details">
              <p><strong>Email:</strong> ${SITE_DATA.contact.email}</p>
              <p><strong>Response Time:</strong> ${SITE_DATA.contact.responseTime}</p>
              <p><strong>Office Hours:</strong> ${SITE_DATA.contact.officeHours}</p>
            </div>
          </div>

          <div class="contact-form-section">
            <h2>Send us a Message</h2>
            <form id="contactForm" class="contact-form">
              <div class="form-group">
                <label for="contactName">Name *</label>
                <input type="text" id="contactName" name="name" required>
              </div>

              <div class="form-group">
                <label for="contactEmail">Email *</label>
                <input type="email" id="contactEmail" name="email" required>
              </div>

              <div class="form-group">
                <label for="contactSubject">Subject *</label>
                <input type="text" id="contactSubject" name="subject" required>
              </div>

              <div class="form-group">
                <label for="contactMessage">Message *</label>
                <textarea id="contactMessage" name="message" rows="6" required></textarea>
              </div>

              <button type="submit" class="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    `;

    // Re-attach contact form event listener
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', handleContactSubmission);
    }
  }
}

function showCareerPage() {
  document.title = 'Careers - ByteToBeacon';

  if (elements.mainContent) {
    elements.mainContent.innerHTML = `
      <div class="page-content">
        <div class="page-header">
          <h1>${SITE_DATA.career.headline}</h1>
          <p class="page-subtitle">${SITE_DATA.career.message}</p>
        </div>

        <section class="content-section">
          <div class="career-status">
            <h2 class="status-badge">${SITE_DATA.career.status}</h2>
            <p>We're currently not hiring, but we're always interested in connecting with talented individuals.</p>
          </div>
        </section>

        <section class="content-section">
          <h2>Future Opportunities</h2>
          <p>As we grow, we may have openings for:</p>
          <ul class="opportunities-list">
            ${SITE_DATA.career.futureOpportunities.map(role => `<li>${escapeHtml(role)}</li>`).join('')}
          </ul>
        </section>

        <section class="content-section">
          <h2>Stay Connected</h2>
          <p>${SITE_DATA.career.inquiryMessage}</p>
          <a href="/contact" class="btn btn-primary">Contact Us</a>
        </section>
      </div>
    `;
  }
}

function showArticlePage(slug) {
  const article = allArticles.find(a => a.slug === slug);

  if (!article) {
    show404Page();
    return;
  }

  document.title = `${article.title} - ByteToBeacon`;

  if (elements.mainContent) {
    elements.mainContent.innerHTML = `
      <div class="article-page">
        <nav class="article-nav">
          <a href="/" class="back-link">← Back to Articles</a>
        </nav>

        <article class="article-full">
          <header class="article-header">
            <div class="article-meta">
              <span class="article-category">${escapeHtml(article.category)}</span>
              <span class="article-date">${formatDate(article.date)}</span>
              <span class="read-time">${escapeHtml(article.readTime)}</span>
            </div>

            <h1 class="article-title">${escapeHtml(article.title)}</h1>

            <div class="article-author-info">
              <span class="author-name">By ${escapeHtml(article.author)}</span>
            </div>

            <div class="article-tags">
              ${(article.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
          </header>

          <div class="article-content">
            ${formatArticleContent(article.content)}
          </div>

          <footer class="article-footer">
            <div class="article-actions">
              <button class="btn btn-primary generate-pdf-btn" data-article-id="${article.id}">
                Save as PDF
              </button>
              <button class="btn btn-secondary" onclick="navigator.share ? navigator.share({title: '${escapeHtml(article.title)}', url: window.location.href}) : copyToClipboard(window.location.href)">
                Share Article
              </button>
            </div>
          </footer>
        </article>
      </div>
    `;
  }
}

function show404Page() {
  document.title = 'Page Not Found - ByteToBeacon';

  if (elements.mainContent) {
    elements.mainContent.innerHTML = `
      <div class="error-page">
        <div class="error-content">
          <h1>404 - Page Not Found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <a href="/" class="btn btn-primary">Go Home</a>
        </div>
      </div>
    `;
  }
}

// Form handling functions
async function handleArticleSubmission(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const submitBtn = e.target.querySelector('button[type="submit"]');

  // Prepare submission data
  const submissionData = {
    type: 'article',
    authorName: formData.get('authorName'),
    authorEmail: formData.get('authorEmail'),
    articleTitle: formData.get('articleTitle'),
    articleContent: formData.get('articleContent')
  };

  // Handle file attachment
  const file = formData.get('articleFile');
  if (file && file.size > 0) {
    try {
      const base64 = await fileToBase64(file);
      submissionData.attachment = {
        filename: file.name,
        base64: base64
      };
    } catch (error) {
      showError('Failed to process file attachment');
      return;
    }
  }

  // Submit form
  await submitForm(submissionData, submitBtn, 'Article submitted successfully!');

  // Close modal and reset form on success
  closeModals();
  e.target.reset();
}

async function handleContactSubmission(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const submitBtn = e.target.querySelector('button[type="submit"]');

  const submissionData = {
    type: 'contact',
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message')
  };

  await submitForm(submissionData, submitBtn, 'Message sent successfully!');

  // Reset form on success
  e.target.reset();
}

async function submitForm(data, submitBtn, successMessage) {
  const originalText = submitBtn.textContent;

  try {
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const response = await fetch(CONFIG.EMAIL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      showSuccess(result.message || successMessage);
    } else {
      throw new Error(result.error || 'Submission failed');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    showError(`Failed to send: ${error.message}`);
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// Modal functions
function openArticleModal() {
  if (elements.articleModal) {
    elements.articleModal.style.display = 'flex';
  }
}

function closeModals() {
  if (elements.articleModal) {
    elements.articleModal.style.display = 'none';
  }
  if (elements.contactModal) {
    elements.contactModal.style.display = 'none';
  }
}

// PDF generation function
function generateArticlePDF(articleId) {
  const article = allArticles.find(a => a.id === articleId);
  if (!article) return;

  // Create a new window with the article content for printing
  const printWindow = window.open('', '_blank', 'width=800,height=600');

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${escapeHtml(article.title)}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          color: #333;
        }
        h1 {
          color: #00ab6c;
          border-bottom: 2px solid #00ab6c;
          padding-bottom: 10px;
        }
        .article-meta {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .article-meta span {
          display: inline-block;
          margin-right: 15px;
        }
        .article-content {
          white-space: pre-wrap;
          line-height: 1.8;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="article-meta">
        <span><strong>Category:</strong> ${escapeHtml(article.category)}</span>
        <span><strong>Author:</strong> ${escapeHtml(article.author)}</span>
        <span><strong>Date:</strong> ${formatDate(article.date)}</span>
      </div>

      <h1>${escapeHtml(article.title)}</h1>

      <div class="article-content">
${escapeHtml(article.content)}
      </div>

      <div class="footer">
        <p>Generated from ByteToBeacon - ${window.location.origin}</p>
        <p>Article URL: ${window.location.origin}/article/${article.slug}</p>
      </div>

      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() {
            window.close();
          }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(printContent);
  printWindow.document.close();
}

// Utility functions
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function highlightText(text, query) {
  if (!query) return escapeHtml(text);

  const escapedText = escapeHtml(text);
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

  let highlightedText = escapedText;
  searchTerms.forEach(term => {
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });

  return highlightedText;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
  return content
    .split('\n\n')
    .map(paragraph => `<p>${escapeHtml(paragraph.trim())}</p>`)
    .join('');
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    showSuccess('Link copied to clipboard!');
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showSuccess('Link copied to clipboard!');
  }
}

// Notification functions
function showError(message) {
  showNotification(message, 'error');
}

function showSuccess(message) {
  showNotification(message, 'success');
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Style the notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '15px 20px',
    borderRadius: '5px',
    color: 'white',
    fontWeight: 'bold',
    zIndex: '10000',
    maxWidth: '400px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    backgroundColor: type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'
  });

  // Add to page
  document.body.appendChild(notification);

  // Remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);

  // Allow manual dismissal
  notification.addEventListener('click', () => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  });
}

// Export functions for global access
window.ByteToBeacon = {
  navigateTo,
  clearSearch,
  generateArticlePDF,
  openArticleModal,
  closeModals,
  copyToClipboard
};
