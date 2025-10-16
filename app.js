// Articles will be loaded from external file
// Global variable to store all articles
let allArticles = [];
let filteredArticles = [];
let currentSearchQuery = '';
let currentCategory = 'all';

// DOM Elements
const articlesGrid = document.getElementById('articlesGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchClear = document.getElementById('searchClear');
const articlesTitle = document.getElementById('articlesTitle');
const articlesCount = document.getElementById('articlesCount');
const categoryFilters = document.getElementById('categoryFilters');
const searchResultsInfo = document.getElementById('searchResultsInfo');
const noResults = document.getElementById('noResults');
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
  loadArticles();
  initializeRouter();
  setupEventListeners();
  setupNavigation();
  setupMobileMenu();
  setupSearch();
});

// Load articles from external file
function loadArticles() {
  if (typeof articles !== 'undefined') {
    allArticles = [...articles];
    filteredArticles = [...articles];
    renderArticles();
    setupCategoryFilters();
    updateArticlesCount();
  } else {
    console.error('Articles data not found. Make sure articles.js is loaded.');
  }
}

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
  
  // Show/hide no results message
  if (filteredArticles.length === 0) {
    if (noResults) noResults.style.display = 'block';
    return;
  } else {
    if (noResults) noResults.style.display = 'none';
  }
  
  filteredArticles.forEach((article) => {
    const articleCard = document.createElement('div');
    articleCard.className = 'article-card';
    
    // Highlight search terms in title and excerpt
    const highlightedTitle = highlightSearchTerms(article.title, currentSearchQuery);
    const highlightedExcerpt = highlightSearchTerms(article.excerpt, currentSearchQuery);
    const highlightedAuthor = highlightSearchTerms(article.author, currentSearchQuery);
    
    articleCard.innerHTML = `
      <div class="article-meta">
        <span class="article-category">${escapeHtml(article.category)}</span>
        <span class="article-read-time">${escapeHtml(article.readTime)} read</span>
      </div>
      <h3 class="article-title">
        <a href="#article-${article.id}" class="article-link" data-article-id="${article.id}">
          ${highlightedTitle}
        </a>
      </h3>
      <p class="article-author">By ${highlightedAuthor} • ${formatDate(article.date)}</p>
      <div class="article-tags">
        ${article.tags.map(tag => `<span class="article-tag">${escapeHtml(tag)}</span>`).join('')}
      </div>
      <p class="article-preview">${highlightedExcerpt}</p>
      <div class="article-actions">
        <button class="pdf-btn" onclick="generatePDFById(${article.id})">
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
  const article = allArticles.find(a => a.id === articleId);
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
  // Restore previous search and filters
  if (currentSearchQuery) {
    setTimeout(() => {
      if (searchInput) {
        searchInput.value = currentSearchQuery;
        searchClear.style.display = 'flex';
        searchBtn.style.display = 'none';
      }
    }, 100);
  }
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
function generatePDFById(articleId) {
  const article = allArticles.find(a => a.id === articleId);
  if (!article) {
    alert('Article not found.');
    return;
  }
  
  createPrintWindow(article);
}

function generateArticlePDF(articleId) {
  const article = allArticles.find(a => a.id === articleId);
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

// Search functionality
function setupSearch() {
  if (!searchInput) return;
  
  let searchTimeout;
  
  // Real-time search with debouncing
  searchInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    const query = this.value.trim();
    
    searchTimeout = setTimeout(() => {
      performSearch(query);
    }, 300);
    
    // Show/hide clear button
    if (query.length > 0) {
      searchClear.style.display = 'flex';
      searchBtn.style.display = 'none';
    } else {
      searchClear.style.display = 'none';
      searchBtn.style.display = 'flex';
    }
  });
  
  // Clear search
  if (searchClear) {
    searchClear.addEventListener('click', function() {
      clearSearch();
    });
  }
  
  // Search on button click
  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      performSearch(searchInput.value.trim());
    });
  }
  
  // Search on Enter key
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch(this.value.trim());
    }
  });
}

// Perform search
function performSearch(query) {
  currentSearchQuery = query;
  
  if (query.length === 0) {
    // Show all articles in current category
    applyFilters();
    updateSearchResults();
    return;
  }
  
  if (query.length < 2) {
    return; // Don't search for very short queries
  }
  
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
  
  filteredArticles = allArticles.filter(article => {
    // Apply category filter first
    if (currentCategory !== 'all' && article.category !== currentCategory) {
      return false;
    }
    
    // Search in title, author, content, tags, and category
    const searchableText = [
      article.title,
      article.author,
      article.content,
      article.excerpt,
      article.category,
      ...article.tags
    ].join(' ').toLowerCase();
    
    // All search terms must be found
    return searchTerms.every(term => searchableText.includes(term));
  });
  
  renderArticles();
  updateSearchResults();
  updateArticlesCount();
}

// Clear search
function clearSearch() {
  searchInput.value = '';
  currentSearchQuery = '';
  searchClear.style.display = 'none';
  searchBtn.style.display = 'flex';
  applyFilters();
  updateSearchResults();
  updateArticlesCount();
  searchInput.focus();
}

// Global function for no results button
window.clearSearch = clearSearch;

// Setup category filters
function setupCategoryFilters() {
  if (!categoryFilters || !allArticles.length) return;
  
  // Get unique categories
  const categories = ['all', ...new Set(allArticles.map(article => article.category))];
  
  categoryFilters.innerHTML = '';
  
  categories.forEach(category => {
    const filterBtn = document.createElement('button');
    filterBtn.className = `category-filter ${category === 'all' ? 'active' : ''}`;
    filterBtn.textContent = category === 'all' ? 'All Articles' : category;
    filterBtn.addEventListener('click', () => filterByCategory(category));
    categoryFilters.appendChild(filterBtn);
  });
}

// Filter by category
function filterByCategory(category) {
  currentCategory = category;
  
  // Update active filter button
  document.querySelectorAll('.category-filter').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Apply filters
  applyFilters();
  updateArticlesCount();
  updateSearchResults();
}

// Apply current filters
function applyFilters() {
  let articles = [...allArticles];
  
  // Apply category filter
  if (currentCategory !== 'all') {
    articles = articles.filter(article => article.category === currentCategory);
  }
  
  // Apply search filter
  if (currentSearchQuery.length >= 2) {
    const searchTerms = currentSearchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
    articles = articles.filter(article => {
      const searchableText = [
        article.title,
        article.author,
        article.content,
        article.excerpt,
        article.category,
        ...article.tags
      ].join(' ').toLowerCase();
      
      return searchTerms.every(term => searchableText.includes(term));
    });
  }
  
  filteredArticles = articles;
  renderArticles();
}

// Update search results info
function updateSearchResults() {
  if (!searchResultsInfo) return;
  
  if (currentSearchQuery.length >= 2) {
    searchResultsInfo.style.display = 'block';
    searchResultsInfo.innerHTML = `
      <h3>Search Results</h3>
      <p>Found ${filteredArticles.length} article${filteredArticles.length !== 1 ? 's' : ''} for "${escapeHtml(currentSearchQuery)}"${currentCategory !== 'all' ? ` in ${currentCategory}` : ''}</p>
    `;
  } else {
    searchResultsInfo.style.display = 'none';
  }
}

// Update articles count
function updateArticlesCount() {
  if (!articlesCount) return;
  
  const count = filteredArticles.length;
  const total = currentCategory === 'all' ? allArticles.length : allArticles.filter(a => a.category === currentCategory).length;
  
  if (currentSearchQuery.length >= 2 || currentCategory !== 'all') {
    articlesCount.textContent = `${count} of ${total} articles`;
  } else {
    articlesCount.textContent = `${total} articles`;
  }
}

// Highlight search terms in text
function highlightSearchTerms(text, query) {
  if (!query || query.length < 2) {
    return escapeHtml(text);
  }
  
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
  let highlightedText = escapeHtml(text);
  
  searchTerms.forEach(term => {
    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<span class="search-highlight">$1</span>');
  });
  
  return highlightedText;
}

// Escape regex special characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

// Update page title based on current state
function updatePageTitleDynamic() {
  let title = 'ByteToBeacon - Bridging Technology and Innovation';
  
  if (currentSearchQuery.length >= 2) {
    title = `Search: "${currentSearchQuery}" - ByteToBeacon`;
  } else if (currentCategory !== 'all') {
    title = `${currentCategory} Articles - ByteToBeacon`;
  }
  
  document.title = title;
}