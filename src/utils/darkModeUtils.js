/**
 * Utility functions for ensuring proper dark mode support in blog content
 */

/**
 * Processes HTML content to ensure proper dark mode styling
 * @param {string} html - The HTML content to process
 * @param {boolean} isDark - Whether dark mode is active
 * @returns {string} - Processed HTML with dark mode classes
 */
export const processContentForDarkMode = (html, isDark = false) => {
  if (!html) return html;
  
  // Add dark mode classes to common elements that might not be covered by prose
  let processedHtml = html
    .replace(/<p([^>]*)>/g, '<p$1 class="blog-paragraph">')
    .replace(/<h([1-6])([^>]*)>/g, '<h$1$2 class="blog-heading">')
    .replace(/<ul([^>]*)>/g, '<ul$1 class="blog-list">')
    .replace(/<ol([^>]*)>/g, '<ol$1 class="blog-list">')
    .replace(/<li([^>]*)>/g, '<li$1 class="blog-list-item">')
    .replace(/<blockquote([^>]*)>/g, '<blockquote$1 class="blog-blockquote">')
    .replace(/<code([^>]*)>/g, '<code$1 class="blog-code">')
    .replace(/<pre([^>]*)>/g, '<pre$1 class="blog-pre">')
    .replace(/<a([^>]*)>/g, '<a$1 class="blog-link">')
    .replace(/<strong([^>]*)>/g, '<strong$1 class="blog-strong">')
    .replace(/<em([^>]*)>/g, '<em$1 class="blog-em">');
  
  return processedHtml;
};

/**
 * Normalizes image URLs in HTML content
 * @param {string} html - The HTML content to process
 * @returns {string} - HTML with normalized image URLs
 */
export const normalizeContentImages = (html) => {
  if (!html) return html;
  const base = import.meta.env.VITE_API_URL || '';
  return html.replace(/src="\/api([^"]*)"/g, (_m, path) => `src="${base}${path}"`);
};

/**
 * Applies dark mode styling to a DOM element
 * @param {HTMLElement} element - The DOM element to style
 * @param {boolean} isDark - Whether dark mode is active
 */
export const applyDarkModeToElement = (element, isDark) => {
  if (!element) return;
  
  const textElements = element.querySelectorAll('p, li, span, div:not(.prose)');
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const links = element.querySelectorAll('a');
  const codeElements = element.querySelectorAll('code');
  const preElements = element.querySelectorAll('pre');
  const blockquotes = element.querySelectorAll('blockquote');
  const strongElements = element.querySelectorAll('strong, b');
  const emElements = element.querySelectorAll('em, i');
  
  if (isDark) {
    // Apply dark mode styles
    textElements.forEach(el => {
      el.style.color = '#e2e8f0'; // slate-200
    });
    
    headings.forEach(el => {
      el.style.color = '#ffffff';
    });
    
    links.forEach(el => {
      el.style.color = '#60a5fa'; // blue-400
    });
    
    codeElements.forEach(el => {
      el.style.color = '#60a5fa'; // blue-400
      el.style.backgroundColor = '#1e293b'; // slate-800
    });
    
    preElements.forEach(el => {
      el.style.backgroundColor = '#1e293b'; // slate-800
      el.style.color = '#e2e8f0'; // slate-200
    });
    
    blockquotes.forEach(el => {
      el.style.color = '#cbd5e1'; // slate-300
      el.style.borderLeftColor = '#3b82f6'; // blue-500
    });
    
    strongElements.forEach(el => {
      el.style.color = '#ffffff';
    });
    
    emElements.forEach(el => {
      el.style.color = '#e2e8f0'; // slate-200
    });
  } else {
    // Apply light mode styles
    textElements.forEach(el => {
      el.style.color = '#1e293b'; // slate-800
    });
    
    headings.forEach(el => {
      el.style.color = '#0f172a'; // slate-900
    });
    
    links.forEach(el => {
      el.style.color = '#2563eb'; // blue-600
    });
    
    codeElements.forEach(el => {
      el.style.color = '#2563eb'; // blue-600
      el.style.backgroundColor = '#f1f5f9'; // slate-100
    });
    
    preElements.forEach(el => {
      el.style.backgroundColor = '#f1f5f9'; // slate-100
      el.style.color = '#1e293b'; // slate-800
    });
    
    blockquotes.forEach(el => {
      el.style.color = '#475569'; // slate-600
      el.style.borderLeftColor = '#3b82f6'; // blue-500
    });
    
    strongElements.forEach(el => {
      el.style.color = '#0f172a'; // slate-900
    });
    
    emElements.forEach(el => {
      el.style.color = '#475569'; // slate-600
    });
  }
};

/**
 * Creates a comprehensive dark mode class string for prose content
 * @param {boolean} isDark - Whether dark mode is active
 * @returns {string} - Complete class string for prose content
 */
export const getProseClasses = (isDark) => {
  const baseClasses = 'prose prose-lg max-w-none';
  
  if (isDark) {
    return `${baseClasses} prose-invert prose-headings:text-white prose-p:text-slate-200 prose-strong:text-white prose-em:text-slate-200 prose-code:text-blue-400 prose-pre:bg-slate-800 prose-pre:text-slate-200 prose-blockquote:border-blue-500 prose-blockquote:text-slate-300 prose-a:text-blue-400 prose-li:text-slate-200 prose-ol:text-slate-200 prose-ul:text-slate-200 prose-table:text-slate-200 prose-th:text-white prose-td:text-slate-200 prose-hr:border-slate-700 prose-img:rounded-lg`;
  } else {
    return `${baseClasses} prose-headings:text-slate-900 prose-p:text-slate-800 prose-strong:text-slate-900 prose-em:text-slate-700 prose-code:text-blue-600 prose-pre:bg-slate-100 prose-pre:text-slate-800 prose-blockquote:border-blue-500 prose-blockquote:text-slate-600 prose-a:text-blue-600 prose-li:text-slate-800 prose-ol:text-slate-800 prose-ul:text-slate-800 prose-table:text-slate-800 prose-th:text-slate-900 prose-td:text-slate-800 prose-hr:border-slate-300 prose-img:rounded-lg`;
  }
};