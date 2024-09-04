console.log('[renderer.js] loaded');
const { ipcRenderer, iconv } = window.electron;

document.addEventListener('DOMContentLoaded', () => {
    const startAutomationButton = document.getElementById('startAutomationButton');
    const customAlert = document.getElementById('customAlert');
    const customAlertTitle = document.getElementById('customAlertTitle');
    const customAlertMessage = document.getElementById('customAlertMessage');
    const customAlertClose = document.getElementById('customAlertClose');

    const passwordInput = document.getElementById('password');
    const capsLockWarning = document.getElementById('capsLockWarning');

    if (startAutomationButton) {
        startAutomationButton.addEventListener('click', () => {
            console.log('Start Automation Button Clicked');

            const memberNumberElem = document.getElementById('memberNumber').value;
            const passwordElem = document.getElementById('password').value;
            const startLocationElem = document.getElementById('startLocation').value;
            const endLocationElem = document.getElementById('endLocation').value;
            const dateElem = document.getElementById('date').value;
            const timeElem = document.getElementById('time').value;

            if (memberNumberElem && passwordElem && startLocationElem && endLocationElem && dateElem && timeElem) {
                const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Regular expression for YYYY-MM-DD format
                if (!datePattern.test(dateElem)) {
                    showAlert('입력 오류', '날짜 형식이 올바르지 않습니다. [ ex) 2024-01-01 ]');
                    return; // Exit function if date format is invalid
                }
                // Regular expression for time format HH:MM
                const timePattern = /^\d{2}:\d{2}$/; 
                // Check if the time format is valid
                if (!timePattern.test(timeElem)) {
                    showAlert('입력 오류', '시간 형식이 올바르지 않습니다. [ ex) 14:00 ]');
                    return; // Exit function if time format is invalid
                }
                
                const encoder = new TextEncoder();
                const data = {
                    memberNumber: memberNumberElem,
                    password: passwordElem,
                    startLocation: startLocationElem,
                    endLocation: endLocationElem,
                    date: dateElem,
                    time: timeElem
                };

                window.location.href = "ongoing.html";
                ipcRenderer.send('start-automation', data);
                ipcRenderer.on('automation-status', (event, status) => {
                    console.log('Automation status:', status);
                });
            } else {
                showAlert('입력 오류', '모든 항목을 정확히 입력하세요.');
            }
        });
    }

    function showAlert(title, message) {
        customAlertTitle.textContent = title;
        customAlertMessage.textContent = message;
        customAlert.style.display = 'flex';
    }

    customAlertClose.addEventListener('click', () => {
        customAlert.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === customAlert) {
            customAlert.style.display = 'none';
        }
    });

    passwordInput.addEventListener('keyup', (event) => {
        if (event.getModifierState('CapsLock')) {
            capsLockWarning.style.display = 'block';
        } else {
            capsLockWarning.style.display = 'none';
        }
    });

    passwordInput.addEventListener('keydown', (event) => {
        if (event.getModifierState('CapsLock')) {
            capsLockWarning.style.display = 'block';
        } else {
            capsLockWarning.style.display = 'none';
        }
    });



    // if (startAutomationButton) {
    //     startAutomationButton.addEventListener('click', () => {
    //         window.location.href = "ongoing.html";

    //         const data = {
    //             memberNumber: document.getElementById('memberNumber').value,
    //             password: document.getElementById('password').value,
    //             startLocation: iconv.encode(document.getElementById('startLocation').value, 'utf-8').toString('base64'), // UTF-8 인코딩 후 Base64로 변환
    //             endLocation: iconv.encode(document.getElementById('endLocation').value, 'utf-8').toString('base64'), // UTF-8 인코딩 후 Base64로 변환
    //             dateId: document.getElementById('dateId').value,
    //             departureTime: document.getElementById('departureTime').value
    //         };

    //         ipcRenderer.send('start-automation', data);
    //         ipcRenderer.on('automation-status', (event, status) => {
    //             console.log('Automation status:', status);
    //         });
    //     });
    // }

    // ★ TEST
    // if (startAutomationButton) {
    //     startAutomationButton.addEventListener('click', () => {
    //         window.location.href = "ongoing.html";

    //         const data = {
    //             memberNumber: '1041537669',
    //             password: '',
    //             startLocation:'서울',
    //             endLocation: '부산',
    //             dateId: '2024-09-15',
    //             departureTime: '오후01'
    //         };

    //         ipcRenderer.send('start-automation', data);
    //         ipcRenderer.on('automation-status', (event, status) => {
    //             console.log('Automation status:', status);
    //         });
    //     });
    // }

});