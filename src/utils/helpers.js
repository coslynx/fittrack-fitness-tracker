/**
 * @module helpers
 * @description Utility functions for the application, including date formatting and input validation.
 */

/**
 * Formats a date string into a more readable format (YYYY-MM-DD).
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string or an empty string if the input is invalid.
 * @example formatDate('2024-07-20T10:30:00Z') => '2024-07-20'
 * @throws {Error} If the dateString is invalid or cannot be parsed.
 */
const formatDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') {
    console.error('Invalid input: dateString must be a non-empty string.');
    return '';
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date)) {
      console.error('Invalid date string format.');
      return '';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return ${year}-${month}-${day};
  } catch (error) {
     console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Validates if a given value is a non-empty string.
 * @param {string} value - The value to validate.
 * @returns {boolean} True if the value is a non-empty string, false otherwise.
 * @example isValidString('test') => true
 * @example isValidString('') => false
 * @example isValidString(123) => false
 */
const isValidString = (value) => {
  return typeof value === 'string' && value.trim() !== '';
};


/**
 * Validates if a given value is a valid positive number.
 * @param {number} value - The value to validate.
 * @returns {boolean} True if the value is a valid positive number, false otherwise.
  * @example isValidNumber(10) => true
 * @example isValidNumber(0) => false
 * @example isValidNumber(-10) => false
 * @example isValidNumber('abc') => false
 */
const isValidNumber = (value) => {
    return typeof value === 'number' && value > 0 && !isNaN(value);
};


/**
 * Validates if a given value is a valid email address.
 * @param {string} email - The email to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 * @example isValidEmail('test@example.com') => true
 * @example isValidEmail('test') => false
 * @example isValidEmail('test@example') => false
 */
const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.toLowerCase());
};

/**
 * Validates if a given value is a valid password string.
 * @param {string} password - The password to validate.
 * @returns {boolean} True if the password is valid, false otherwise.
 * @description  Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.
 * @example isValidPassword('Test123!') => true
 * @example isValidPassword('test123!') => false
 * @example isValidPassword('Test123') => false
 * @example isValidPassword('Test!@#') => false
 * @example isValidPassword('Test123!@#') => true
 */
const isValidPassword = (password) => {
    if (!password || typeof password !== 'string') {
        return false;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    return passwordRegex.test(password);
};


/**
 * Generates a random string of specified length
 * @param {number} length - length of random string
 * @returns {string} random string
 * @example generateRandomString(10) => 'aBc12@#xYz'
 */
const generateRandomString = (length) => {
    if(!isValidNumber(length)){
         console.error('Invalid input: length must be a valid positive number.');
         return '';
    }
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]:;<>,.?~\\/-';
    let result = '';
    for(let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result;
}


export { formatDate, isValidString, isValidNumber, isValidEmail, isValidPassword, generateRandomString };