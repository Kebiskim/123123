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

  async function handleDropdownSelection(page, dropdownSelector, timeValue) {
    // Mapping time values to the corresponding text labels in the dropdown
    const timeMap = {
        "00:00": "오전00",
        "01:00": "오전01",
        "02:00": "오전02",
        "03:00": "오전03",
        "04:00": "오전04",
        "05:00": "오전05",
        "06:00": "오전06",
        "07:00": "오전07",
        "08:00": "오전08",
        "09:00": "오전09",
        "10:00": "오전10",
        "11:00": "오전11",
        "12:00": "오후00",
        "13:00": "오후01",
        "14:00": "오후02",
        "15:00": "오후03",
        "16:00": "오후04",
        "17:00": "오후05",
        "18:00": "오후06",
        "19:00": "오후07",
        "20:00": "오후08",
        "21:00": "오후09",
        "22:00": "오후10",
        "23:00": "오후11"
    };

    // Get the text that corresponds to the selected time value
    const selectedText = timeMap[timeValue];

    if (!selectedText) {
        console.error('No matching time found for:', timeValue);
        return;
    }

    console.log('[actions.js] Selected Text:', selectedText); // Debugging

    // Open the dropdown
    await page.click(dropdownSelector);

    // Wait for the dropdown options to load
    await page.waitForSelector(`${dropdownSelector} option`, { timeout: 5000 }); // Increased timeout

    // Select the appropriate option
    const optionSelected = await page.evaluate((dropdownSelector, selectedText) => {
        const selectElement = document.querySelector(dropdownSelector);
        const options = Array.from(selectElement.querySelectorAll('option'));
        console.log('Options:', options.map(option => option.textContent)); // Debugging
        const targetOption = options.find(option => option.textContent.includes(selectedText));
        if (targetOption) {
            targetOption.selected = true;
            return true;
        }
        return false;
    }, dropdownSelector, selectedText);

    if (!optionSelected) {
        console.error('No matching dropdown item found for:', selectedText);
    } else {
        // Trigger the change event to reflect the selection
        await page.evaluate((dropdownSelector) => {
            const selectElement = document.querySelector(dropdownSelector);
            const event = new Event('change', { bubbles: true });
            selectElement.dispatchEvent(event);
        }, dropdownSelector);
    }
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

module.exports = {
  clickElement,
  clickElementByAlt,
  setInputValue,
  selectDropdownOption,
  handleDropdownSelection,
  clickRadioButtonById
};