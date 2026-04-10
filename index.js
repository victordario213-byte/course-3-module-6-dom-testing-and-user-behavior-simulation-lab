// Step 1: Event Listeners
// Listen for DOMContentLoaded to ensure elements are available before attaching listeners
document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  const simulateClickBtn = document.getElementById('simulate-click');
  const userForm = document.getElementById('user-form');
  const userInput = document.getElementById('user-input');
  const dynamicContent = document.getElementById('dynamic-content');
  const errorMessage = document.getElementById('error-message');

  // Button click handler
  if (simulateClickBtn) {
    simulateClickBtn.addEventListener('click', () => {
      clearError();
      const message = createElement('p', {
        textContent: '🎉 Button was simulated clicked!',
        className: 'success-message'
      });
      dynamicContent.appendChild(message);
      
      // Auto-remove after 3 seconds
      setTimeout(() => {
        if (message && message.remove) message.remove();
      }, 3000);
    });
  }

  // Form submission handler
  if (userForm) {
    userForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();
      
      const inputValue = userInput.value.trim();
      
      if (!inputValue) {
        showError('❌ Please enter some text before submitting.');
        return;
      }
      
      if (inputValue.length < 2) {
        showError('❌ Input must be at least 2 characters long.');
        return;
      }
      
      if (inputValue.length > 100) {
        showError('❌ Input must be less than 100 characters.');
        return;
      }
      
      // Add the submitted content to the DOM
      addUserContent(inputValue);
      userInput.value = ''; // Clear input
    });
  }
});

// Step 2: DOM Manipulation Functions
// Functions to add, update, and remove DOM elements

/**
 * Creates a new DOM element with attributes and content
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes and properties
 * @returns {HTMLElement}
 */
function createElement(tag, attributes = {}) {
  const element = document.createElement(tag);
  
  Object.keys(attributes).forEach(key => {
    if (key === 'textContent') {
      element.textContent = attributes[key];
    } else if (key === 'innerHTML') {
      element.innerHTML = attributes[key];
    } else if (key === 'className') {
      element.className = attributes[key];
    } else if (key === 'style') {
      Object.assign(element.style, attributes[key]);
    } else if (key === 'dataset') {
      Object.assign(element.dataset, attributes[key]);
    } else {
      element.setAttribute(key, attributes[key]);
    }
  });
  
  return element;
}

/**
 * Adds user submitted content to the dynamic content area
 * @param {string} content - User input text
 */
function addUserContent(content) {
  const dynamicContent = document.getElementById('dynamic-content');
  if (!dynamicContent) {
    showError('Dynamic content area not found');
    return;
  }
  
  const contentCard = createElement('div', {
    className: 'content-card',
    style: {
      padding: '10px',
      margin: '10px 0',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px',
      borderLeft: '4px solid #007bff'
    }
  });
  
  const contentText = createElement('p', {
    textContent: content,
    style: { margin: '0 0 5px 0', wordWrap: 'break-word' }
  });
  
  const timestamp = createElement('small', {
    textContent: `📅 ${new Date().toLocaleString()}`,
    style: { color: '#6c757d', fontSize: '12px' }
  });
  
  const deleteBtn = createElement('button', {
    textContent: 'Delete',
    style: {
      marginTop: '8px',
      padding: '5px 10px',
      fontSize: '12px',
      backgroundColor: '#dc3545',
      display: 'inline-block'
    }
  });
  
  deleteBtn.addEventListener('click', () => {
    removeElement(contentCard);
    showTemporaryMessage('✅ Item deleted successfully');
  });
  
  contentCard.appendChild(contentText);
  contentCard.appendChild(timestamp);
  contentCard.appendChild(deleteBtn);
  dynamicContent.appendChild(contentCard);
}

/**
 * Removes an element from the DOM
 * @param {HTMLElement} element - Element to remove
 */
function removeElement(element) {
  if (element && element.remove) {
    element.remove();
  }
}

/**
 * Updates an existing element's content
 * @param {string} elementId - ID of element to update
 * @param {string} newContent - New content
 */
function updateElementContent(elementId, newContent) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = newContent;
    showTemporaryMessage(`✅ Updated ${elementId}`, 'info');
  } else {
    showError(`Element with ID '${elementId}' not found`);
  }
}

/**
 * Clears all content from dynamic content area
 */
function clearAllContent() {
  const dynamicContent = document.getElementById('dynamic-content');
  if (dynamicContent) {
    const confirmClear = confirm('Are you sure you want to clear all content?');
    if (confirmClear) {
      dynamicContent.innerHTML = '';
      showTemporaryMessage('🗑️ All content cleared', 'info');
    }
  }
}

// Step 3: Error Handling
// Display error messages in the DOM for invalid inputs or missing elements

/**
 * Shows error message in the DOM
 * @param {string} message - Error message to display
 */
function showError(message) {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
      if (errorDiv && !errorDiv.classList.contains('hidden')) {
        errorDiv.classList.add('hidden');
      }
    }, 4000);
  } else {
    console.error('Error element not found:', message);
  }
}

/**
 * Clears error message
 */
function clearError() {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.textContent = '';
    errorDiv.classList.add('hidden');
  }
}

/**
 * Shows temporary informational message in dynamic content area
 * @param {string} message - Message to display
 * @param {string} type - Message type ('success', 'info')
 */
function showTemporaryMessage(message, type = 'success') {
  const dynamicContent = document.getElementById('dynamic-content');
  if (!dynamicContent) return;
  
  const tempMessage = createElement('div', {
    className: `temp-message ${type}`,
    textContent: message,
    style: {
      padding: '8px',
      margin: '5px 0',
      backgroundColor: type === 'success' ? '#d4edda' : '#d1ecf1',
      color: type === 'success' ? '#155724' : '#0c5460',
      borderRadius: '4px',
      border: `1px solid ${type === 'success' ? '#c3e6cb' : '#bee5eb'}`,
      fontSize: '14px'
    }
  });
  
  dynamicContent.insertBefore(tempMessage, dynamicContent.firstChild);
  
  setTimeout(() => {
    if (tempMessage && tempMessage.remove) {
      tempMessage.remove();
    }
  }, 3000);
}

// Step 4: Reusable Utilities
// Modular utility functions following DRY principles

/**
 * Validates input based on rules
 * @param {string} value - Input value to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} - { isValid: boolean, message: string }
 */
function validateInput(value, rules = {}) {
  const { required = true, minLength = 1, maxLength = 100, pattern = null } = rules;
  
  if (required && (!value || value.trim() === '')) {
    return { isValid: false, message: 'This field is required' };
  }
  
  if (value && value.length < minLength) {
    return { isValid: false, message: `Must be at least ${minLength} characters` };
  }
  
  if (value && value.length > maxLength) {
    return { isValid: false, message: `Must be less than ${maxLength} characters` };
  }
  
  if (pattern && value && !pattern.test(value)) {
    return { isValid: false, message: 'Invalid format' };
  }
  
  return { isValid: true, message: '' };
}

/**
 * Debounce function to limit rapid event firing
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function}
 */
function debounce(func, delay = 300) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Batch DOM updates for performance
 * @param {Function} updateFn - Function containing DOM updates
 */
function batchDOMUpdates(updateFn) {
  requestAnimationFrame(() => {
    updateFn();
  });
}

/**
 * Creates multiple elements at once
 * @param {Array} elementsConfig - Array of element configurations
 * @returns {Array} - Array of created elements
 */
function createElements(elementsConfig) {
  return elementsConfig.map(config => {
    const { tag, attributes, children = [] } = config;
    const element = createElement(tag, attributes);
    
    children.forEach(childConfig => {
      const childElement = createElement(childConfig.tag, childConfig.attributes);
      element.appendChild(childElement);
    });
    
    return element;
  });
}

/**
 * Get form data as object
 * @param {HTMLFormElement} form - Form element
 * @returns {Object}
 */
function getFormData(form) {
  const formData = new FormData(form);
  const data = {};
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }
  return data;
}

/**
 * Reset form fields
 * @param {HTMLFormElement} form - Form element
 */
function resetForm(form) {
  if (form) {
    form.reset();
  }
}

// Add keyboard shortcut (Ctrl+Shift+C to clear all content)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'C') {
    e.preventDefault();
    clearAllContent();
  }
});

// Export for testing (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createElement,
    removeElement,
    updateElementContent,
    clearAllContent,
    showError,
    clearError,
    validateInput,
    debounce,
    batchDOMUpdates,
    createElements,
    addUserContent,
    getFormData,
    resetForm
  };
}