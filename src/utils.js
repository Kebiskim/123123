const nodemailer = require('nodemailer');
require('dotenv').config(); // 환경 변수 로드
const { ipcRenderer } = require('electron');

// /window 객체는 브라우저 환경에서만 사용 가능하며, Node.js 환경에서는 사용할 수 없습니다. 
// 따라서 utils.js 파일에서 window 객체를 참조하면 오류가 발생합니다. 
// 이를 해결하기 위해 logMessage 함수를 렌더러 프로세스에서만 호출하도록 하고, 
// 메인 프로세스에서는 다른 방법으로 로그 메시지를 처리해야 합니다

/**
 * Sends an email using the configured transporter.
 * @param {string} to - Recipient's email address.
 * @param {string} subject - Email subject.
 * @param {string} text - Email body.
 */
async function sendMail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // 이메일 서비스 제공자
    auth: {
      user: process.env.EMAIL_USER, // 발신자 이메일 주소
      pass: process.env.EMAIL_PASS  // 발신자 이메일 비밀번호
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // 발신자 이메일 주소
    to: to, // 수신자 이메일 주소
    subject: subject, // 이메일 제목
    text: text // 이메일 본문
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email successfully sent.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

async function logMessage(message) {
  console.log(message);
  // if (typeof window !== 'undefined' && window.electron && window.electron.ipcRenderer) {
  //   window.electron.ipcRenderer.send('log-message', message);
  // } else {
  //   console.error('ipcRenderer is undefined or not in renderer process');
  // }
}

module.exports = { logMessage };

module.exports = { sendMail, logMessage };