console.log('ticketBuyer script loaded');
const puppeteer = require('puppeteer');
const { getMainWindow } = require('../ui/windowManager');

const { 
  viewportWidth, 
  viewportHeight, 
  korailUrl, 
  maxRetries, 
  emailTo 
} = require('../config');
const { sendMail, logMessage 
} = require('./utils');
const { setInputValue, selectDropdownOption, 
    clickElement, clickRadioButtonById, clickElementByAlt
} = require('./actions');

// Define the sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Wait for mainWindow to be defined
async function waitForMainWindow() {
    return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
            const mainWindow = getMainWindow();
            if (mainWindow && mainWindow.webContents) {
                clearInterval(checkInterval);
                resolve(mainWindow);
            }
        }, 100);

        setTimeout(() => {
            clearInterval(checkInterval);
            reject(new Error('mainWindow is not defined.'));
        }, 5000); // 5초 후에 타임아웃
    });
}

// Main function for running automation
async function runAutomation(data) {
    const { memberNumber, password, startLocation, endLocation, dateId, departureTime } = data;

    // await logMessage('[ticketBuyer.js, runAutomation] Running automation with data:', {
    //     viewportWidth, 
    //     viewportHeight, 
    //     korailUrl, 
    //     memberNumber, 
    //     password, 
    //     startLocation, 
    //     endLocation, 
    //     dateId, 
    //     departureTime, 
    //     maxRetries, 
    //     emailTo
    // });

    let browser;
    let page;

    try {
        await logMessage('***** Start Process *****');
        const mainWindow = await waitForMainWindow();
        mainWindow.webContents.send('log', '코레일 예약 작업을 시작합니다.');

        browser = await puppeteer.launch({ headless: false });
        page = await browser.newPage();

        // Set viewport size
        await page.setViewport({ width: viewportWidth, height: viewportHeight });

        // Navigate to the URL
        await page.goto(korailUrl);

        // Fill in member number and password
        await setInputValue(page, 'input[title="회원번호 열자리 입력"]', memberNumber);
        await setInputValue(page, 'input[title="8자리이상 영문 숫자 특수문자"]', password);

        // Click login button
        await clickElement(page, 'li.btn_login');
        await page.waitForNavigation();
        await logMessage('Login Success');
        mainWindow.webContents.send('log', '로그인 성공');

        await page.goto('https://www.letskorail.com/ebizprd/prdMain.do'); 

        // Set start and end locations
        await setInputValue(page, '#txtGoStart', startLocation);
        await setInputValue(page, '#txtGoEnd', endLocation);
        mainWindow.webContents.send('log', '목적지 입력 성공: ' + startLocation + ' -> ' + endLocation);

        // Click calendar popup
        await clickElement(page, '[title="달력 팝업창이 뜹니다."]');

        // Select the date on popup
        const pages = await browser.pages();
        const popupPage = pages[pages.length - 1];
        
        // dateId를 dYYYYMMDD 형식으로 변환
        const formattedDateId = `d${dateId.replace(/-/g, '')}`;
        
        await popupPage.waitForSelector(`#${formattedDateId}`);
        await popupPage.click(`#${formattedDateId}`);

        await logMessage('Date selected: ' + dateId);
        mainWindow.webContents.send('log', '날짜 입력 성공' + dateId);

        await page.bringToFront();
        await logMessage('Moved to main page');

        // Select departure time and train type
        await selectDropdownOption(page, '[title="출발일시:시"]', departureTime);
        await logMessage('Selected Departure Time: ' + departureTime);
        mainWindow.webContents.send('log', '출발시간: ' + departureTime);

        // Click search button
        await clickElement(page, '[alt="승차권예매"]');

        // Select KTX & 조회하기 hit 버튼
        await clickRadioButtonById(page, 'selGoTrainRa00');
        await clickElementByAlt(page, '조회하기');

        await logMessage('=== Start finding an available seat ===');
        mainWindow.webContents.send('log', '가능한 좌석이 있는지 확인합니다.');

        // Start the retry loop
        let find_retryCnt = 0;

        while (find_retryCnt < maxRetries) {
            // Check CAPTCHA and retry
            if (find_retryCnt % 50 === 0) {
                await logMessage('Current ticket find retry count: ' + find_retryCnt);
                mainWindow.webContents.send('log', '가능한 좌석이 있는지 확인중입니다... 새로고침 횟수' + find_retryCnt);
            }

            await page.waitForSelector('#tableResult');
            const rows = await page.$$('#tableResult tr');

            let imageClicked = false;

            for (let index = 0; index < rows.length; index++) {
                const row = rows[index];

                const imgSrc = await page.evaluate((row) => {
                    const td = row.children[5];
                    if (td) {
                        const img = td.querySelector('img');
                        return img ? img.src : null;
                    }
                    return null;
                }, row);

                if (imgSrc && !imgSrc.includes('/docs/2007/img/common/btn_selloff.gif')) {
                    await page.evaluate((row) => {
                        const td = row.children[5];
                        if (td) {
                            const img = td.querySelector('img');
                            if (img) {

                                setTimeout(() => {
                                    console.log('60 seconds have passed.');
                                }, 60000);
                                // ★ TEST
                                img.click();
                                mainWindow.webContents.send('log', '티켓 구매가 완료되었습니다.');
                            }
                        }
                    }, row);

                    imageClicked = true;
                    break;
                }
            }

            if (imageClicked) {
                await logMessage('티켓 예매 성공');
                // ★ TEST
                await sendMail(
                    emailTo,
                    '코레일 티켓 예매 성공 메일',
                    '티켓 구매가 성공적으로 완료되었습니다.'
                );
                break;
            }

            await page.reload({ waitUntil: 'networkidle0' });
            // wait to avoid CAPTCHA
            await sleep(5000); 
            find_retryCnt += 1;
        }
    } catch (error) {
        await logMessage('Error during automation: ' + error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

/**
 * Retries the automation process up to a specified number of attempts.
 * This function will attempt to run the automation and handle any errors by retrying.
 *
 * @async
 * @function executeWithRetries
 * @param {Object} data - The data required for automation, including member number, password, and other settings.
 * @param {number} maxAttempts - The maximum number of attempts to retry the automation.
 * @returns {Promise<void>} A promise that resolves when the automation completes successfully or when max attempts are reached.
 */
async function executeWithRetries(data, maxAttempts) {
    // console.log('work starts from ticketBuyer.js')
    // console.log('[ticketBuyer.js, executeWithRetries] Automation start requested with data:', data);

    let attempt = 0;
    while (attempt < maxAttempts) {
        try {
            await runAutomation(data);
            break; // Exit if successful
        } catch (error) {
            attempt += 1;
            await logMessage(`※ Run failed (attempt ${attempt}/${maxAttempts}). Retrying...`);
            await sleep(5000); // Wait before retrying
        }
    }
}

module.exports = { executeWithRetries };
