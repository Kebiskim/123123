console.log('[renderer.js] loaded');
const { ipcRenderer, iconv } = window.electron;

document.addEventListener('DOMContentLoaded', () => {
    const startAutomationButton = document.getElementById('startAutomationButton');

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
    if (startAutomationButton) {
        startAutomationButton.addEventListener('click', () => {
            window.location.href = "ongoing.html";

            const data = {
                memberNumber: '1041537669',
                password: '',
                startLocation:'서울',
                endLocation: '부산',
                dateId: '2024-09-15',
                departureTime: '오후01'
            };

            ipcRenderer.send('start-automation', data);
            ipcRenderer.on('automation-status', (event, status) => {
                console.log('Automation status:', status);
            });
        });
    }

});