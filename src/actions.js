const fs = require('fs');
const path = require('path');

// Click element by selector
async function clickElement(page, selector) {
    await page.waitForSelector(selector);
    await page.click(selector);
  }

// Click a radio button based on its id
async function clickRadioButtonById(page, id) {
    try {
      // Wait for the radio button to be available
      await page.waitForSelector(`input[type="radio"]#${id}`);
  
      // Click the radio button
      await page.click(`input[type="radio"]#${id}`);
  
      console.log(`Radio button with id '${id}' was clicked.`);
    } catch (error) {
      console.error(`Failed to click radio button with id '${id}':`, error);
    }
  }

// Click an element based on its alt attribute value
async function clickElementByAlt(page, altText) {
    try {
      // Construct the selector for the alt attribute
      const selector = `*[alt="${altText}"]`;
  
      // Wait for the element to be available
      await page.waitForSelector(selector);
  
      // Click the element
      await page.click(selector);
  
      console.log(`Element with alt '${altText}' was clicked.`);
    } catch (error) {
      console.error(`Failed to click element with alt '${altText}':`, error);
    }
  }

// Set value in input field by selector
async function setInputValue(page, selector, value) {
  await page.waitForSelector(selector);
  await page.evaluate(({selector, value}) => {
    document.querySelector(selector).value = value;
  }, { selector, value });
}

// Select an option from a dropdown
async function selectDropdownOption(page, dropdownSelector, optionText, closeSelector) {
    // Open the dropdown
    await page.waitForSelector(dropdownSelector);
    await page.click(dropdownSelector);
  
    // Wait for the options to be visible
    await page.waitForSelector('option');
    
    // Select the desired option
    await page.evaluate(({dropdownSelector, optionText}) => {
      const dropdown = document.querySelector(dropdownSelector);
      const options = Array.from(dropdown.querySelectorAll('option'));
      const targetOption = options.find(option => option.textContent.includes(optionText));
      if (targetOption) {
        targetOption.selected = true;
        dropdown.dispatchEvent(new Event('change', { bubbles: true })); // Trigger change event
      }
    }, { dropdownSelector, optionText });
  }
  

// Click a radio button based on its id
async function clickRadioButtonById(page, id) {
    try {
      // Wait for the radio button to be available
      await page.waitForSelector(`input[type="radio"]#${id}`);
  
      // Click the radio button
      await page.click(`input[type="radio"]#${id}`);
  
      console.log(`Radio button with id '${id}' was clicked.`);
    } catch (error) {
      console.error(`Failed to click radio button with id '${id}':`, error);
    }
  }

// Function to log messages to a file with UTC+9 time zone
// async function logMessage(message) {
//     // Get the log file path from environment variables
//     const logFilePath = process.env.LOG_FILE_PATH;

//     if (!logFilePath) {
//         console.error('LOG_FILE_PATH is not set in the environment variables.');
//         return;
//     }

//     // Ensure the directory exists
//     const dir = path.dirname(logFilePath);
//     if (!fs.existsSync(dir)) {
//         fs.mkdirSync(dir, { recursive: true });
//     }

//     // Get the current date and time adjusted to UTC+9
//     const date = new Date();
//     const utcOffset = 9 * 60 * 60 * 1000; // UTC+9 hours in milliseconds
//     const localDate = new Date(date.getTime() + utcOffset);

//     // Prepare the log message with timestamp
//     const timestamp = localDate.toISOString().replace('Z', '+09:00'); // Adjust format to include timezone offset
//     const logMessage = `[${timestamp}] ${message}\n`;

//     // Append the log message to the file
//     try {
//         fs.appendFileSync(logFilePath, logMessage, 'utf8');
//         console.log('Log message written to', logFilePath);
//     } catch (error) {
//         console.error('Error writing log message:', error);
//     }
// }

module.exports = {
  clickElement,
  clickElementByAlt,
  setInputValue,
  selectDropdownOption,
  clickRadioButtonById
};