let mainWindow;

function setMainWindow(window) {
    mainWindow = window;
}

function getMainWindow() {
    return mainWindow;
}

module.exports = { setMainWindow, getMainWindow };