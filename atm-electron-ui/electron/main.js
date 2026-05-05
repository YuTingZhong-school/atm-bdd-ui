const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 760,
        minWidth: 980,
        minHeight: 640,
        backgroundColor: '#f4f7fb',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    const useDist = process.env.ELECTRON_USE_DIST === '1';
    const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:5173';

    if (!app.isPackaged && !useDist) {
        win.loadURL(startUrl);

        if (process.env.ELECTRON_E2E !== '1') {
            win.webContents.openDevTools({ mode: 'detach' });
        }
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
