console.log('[ongoing.js] loaded');
const { ipcRenderer } = window.electron;

document.addEventListener('DOMContentLoaded', () => {
    const logArea = document.getElementById('logArea');
    const stopAutomationButton = document.getElementById('stopAutomationButton');

    // 로그 메시지 수신 및 표시
    ipcRenderer.on('log', (event, message) => {
        if (logArea) {
            // console.log('log message received:', message); // 메시지 수신 확인
            // console.log('logArea exists, appending message'); // logArea 존재 확인
            logArea.value += message + '\n';
            // console.log('Updated logArea value:', logArea.value); // 업데이트된 값 확인
        } else {
            // console.error('logArea not found'); // logArea가 존재하지 않는 경우
        }
    });
    
    // '작업 중지' 버튼 클릭 이벤트 처리
    if (stopAutomationButton) {
        stopAutomationButton.addEventListener('click', () => {
            // logInterval 변수가 정의되어 있다고 가정합니다.
            if (typeof logInterval !== 'undefined') {
                clearInterval(logInterval); // 로그 메시지 업데이트 중지
            }
            alert('자동화 작업이 중지되었습니다.');
            window.location.href = 'index.html'; // 실제 메인 페이지 경로로 변경
        });
    }
});

