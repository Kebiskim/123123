document.addEventListener('DOMContentLoaded', () => {
    // Set the input vars
    const memberNumberInput = document.getElementById('memberNumber');
    const passwordInput = document.getElementById('password');
    const startLocationInput = document.getElementById('startLocation');
    const endLocationInput = document.getElementById('endLocation');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const startAutomationButton = document.getElementById('startAutomationButton');

    // Get references to the custom alert elements
    const customAlert = document.getElementById('customAlert');
    const customAlertTitle = document.getElementById('customAlertTitle');
    const customAlertMessage = document.getElementById('customAlertMessage');
    const customAlertClose = document.getElementById('customAlertClose');

    // Get references to dropdown elements
    const startLocationDropdown = document.getElementById('startLocationDropdown');
    const endLocationDropdown = document.getElementById('endLocationDropdown');
    const dateOptionsDropdown = document.getElementById('dateOptions');
    const timeDropdown = document.getElementById('timeDropdown'); // Added for time

    // Array of location options
    const locations = [
        '서울', '용산', '영등포', '광명', '수원', '평택', '천안아산', '천안', '오송', '조치원',
        '대전', '서대전', '김천', '구미', '김천구미', '대구', '동대구', '경주', '포항', '밀양',
        '구포', '부산', '태화강', '울산(통도사)', '마산', '창원중앙', '경산', '논산', '익산',
        '정읍', '광주송정', '목포', '전주', '순천', '여수EXPO(구,여수역)', '대천', '청량리',
        '춘천', '제천', '동해', '강릉', '행신', '남춘천', '부전', '신탄진', '영동', '왜관',
        '원주', '정동진', '홍성', '나주', '정읍', '남원'
    ];

    /**
     * Populates a dropdown element with a list of items.
     * @param {HTMLElement} dropdownElement - The dropdown container element.
     * @param {Array<string>} items - Array of item strings to populate the dropdown.
     */
    function populateDropdown(dropdownElement, items) {
        dropdownElement.innerHTML = ''; // Clear existing items
        items.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('dropdown-item');
            div.textContent = item;
            div.addEventListener('click', () => {
                const input = dropdownElement.previousElementSibling;
                input.value = item; // Set the input field value to the selected item
                dropdownElement.style.display = 'none'; // Hide the dropdown
            });
            dropdownElement.appendChild(div);
        });
    }

    /**
     * Filters dropdown items based on the input value.
     * @param {HTMLElement} inputElement - The input field element.
     * @param {HTMLElement} dropdownElement - The dropdown container element.
     * @param {Array<string>} items - Array of item strings to filter.
     */
    function filterDropdown(inputElement, dropdownElement, items) {
        inputElement.addEventListener('input', () => {
            const filter = inputElement.value.toLowerCase(); // Get lowercase filter text
            const itemsToShow = items.filter(item => item.toLowerCase().includes(filter)); // Filter items
            const dropdownItems = dropdownElement.querySelectorAll('.dropdown-item');
            dropdownItems.forEach(item => {
                item.style.display = itemsToShow.includes(item.textContent) ? 'block' : 'none'; // Show or hide items
            });
        });
    }

    /**
     * Populates a date dropdown with a range of dates.
     * @param {string} startDate - The start date in YYYY-MM-DD format.
     * @param {string} endDate - The end date in YYYY-MM-DD format.
     * @param {HTMLElement} datalistElement - The dropdown container element.
     */
    function populateDateDatalist(startDate, endDate, datalistElement) {
        const dateOptions = [];
        let currentDate = new Date(startDate);
        const endDateObj = new Date(endDate);

        while (currentDate <= endDateObj) {
            const formattedDate = currentDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
            dateOptions.push(formattedDate);
            currentDate.setDate(currentDate.getDate() + 1); // Move to the next date
        }

        datalistElement.innerHTML = ''; // Clear existing options
        dateOptions.forEach(date => {
            const div = document.createElement('div');
            div.classList.add('dropdown-item');
            div.textContent = date;
            div.addEventListener('click', () => {
                const input = datalistElement.previousElementSibling;
                input.value = date; // Set the input field value to the selected date
                datalistElement.style.display = 'none'; // Hide the dropdown
            });
            datalistElement.appendChild(div);
        });
    }

    /**
     * Filters date dropdown items based on the input value.
     * @param {HTMLElement} inputElement - The input field element.
     * @param {HTMLElement} dropdownElement - The dropdown container element.
     * @param {Array<string>} items - Array of date strings to filter.
     */
    function filterDateDropdown(inputElement, dropdownElement, items) {
        inputElement.addEventListener('input', () => {
            const filter = inputElement.value.toLowerCase(); // Get lowercase filter text
            const itemsToShow = items.filter(item => item.toLowerCase().includes(filter)); // Filter items
            const dropdownItems = dropdownElement.querySelectorAll('.dropdown-item');
            dropdownItems.forEach(item => {
                item.style.display = itemsToShow.includes(item.textContent) ? 'block' : 'none'; // Show or hide items
            });
        });
    }

    /**
     * Populates a time dropdown with times from 오전00 to 오후11.
     * @param {HTMLElement} dropdownElement - The dropdown container element.
     */
    function populateTimeDropdown(dropdownElement) {
        const times = [];
        for (let i = 0; i < 24; i++) {
            const period = i < 12 ? '오전' : '오후';
            const hour = i % 12 === 0 ? '12' : (i % 12).toString().padStart(2, '0');
            times.push(`${period}${hour}`); // Format time as 오전00, 오후01, etc.
        }

        dropdownElement.innerHTML = ''; // Clear existing options
        times.forEach(time => {
            const div = document.createElement('div');
            div.classList.add('dropdown-item');
            div.textContent = time;
            div.addEventListener('click', () => {
                const input = dropdownElement.previousElementSibling;
                input.value = time; // Set the input field value to the selected time
                dropdownElement.style.display = 'none'; // Hide the dropdown
            });
            dropdownElement.appendChild(div);
        });
    }

        /**
         * Filters time dropdown items based on the input value.
    * @param {HTMLElement} inputElement - The input field element.
    * @param {HTMLElement} dropdownElement - The dropdown container element.
    * @param {Array} items - Array of time strings to filter.
    */
    function filterTimeDropdown(inputElement, dropdownElement, items) {
        inputElement.addEventListener('input', () => {
        const filter = inputElement.value.toLowerCase(); // Get lowercase filter text
        const itemsToShow = items.filter(item => item.toLowerCase().includes(filter)); // Filter items
        const dropdownItems = dropdownElement.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
        item.style.display = itemsToShow.includes(item.textContent) ? 'block' : 'none'; // Show or hide items
        });
        });
        }
    
    /**
     * Toggles the visibility of a dropdown when the input field is focused or blurred.
     * @param {HTMLElement} inputElement - The input field element.
     * @param {HTMLElement} dropdownElement - The dropdown container element.
     */
    function toggleDropdown(inputElement, dropdownElement) {
        inputElement.addEventListener('focus', () => {
            dropdownElement.style.display = 'block'; // Show the dropdown
        });
    
        inputElement.addEventListener('blur', () => {
            setTimeout(() => {
                dropdownElement.style.display = 'none'; // Hide the dropdown after a delay
            }, 200);
        });
    }

    // Event listener for the custom alert close button
    customAlertClose.addEventListener('click', () => {
        customAlert.style.display = 'none';
    });

    // Populate dropdowns with location options
    populateDropdown(startLocationDropdown, locations);
    populateDropdown(endLocationDropdown, locations);
    
    // Add filtering functionality to location dropdowns
    filterDropdown(document.getElementById('startLocation'), startLocationDropdown, locations);
    filterDropdown(document.getElementById('endLocation'), endLocationDropdown, locations);
    
    // Set up date range for the dropdown
    const today = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(today.getMonth() + 1);
    
    const todayString = today.toISOString().split('T')[0];
    const oneMonthLaterString = oneMonthLater.toISOString().split('T')[0];
    
    // Populate and filter date dropdown
    populateDateDatalist(todayString, oneMonthLaterString, dateOptionsDropdown);
    filterDateDropdown(document.getElementById('date'), dateOptionsDropdown, Array.from(dateOptionsDropdown.querySelectorAll('.dropdown-item')).map(item => item.textContent));
    
    // Populate and filter time dropdown
    populateTimeDropdown(timeDropdown);
    filterTimeDropdown(document.getElementById('time'), timeDropdown, Array.from(timeDropdown.querySelectorAll('.dropdown-item')).map(item => item.textContent));
    
    // Toggle dropdown visibility for all inputs
    toggleDropdown(document.getElementById('startLocation'), startLocationDropdown);
    toggleDropdown(document.getElementById('endLocation'), endLocationDropdown);
    toggleDropdown(document.getElementById('date'), dateOptionsDropdown);
    toggleDropdown(document.getElementById('time'), timeDropdown); // Added for time
    });