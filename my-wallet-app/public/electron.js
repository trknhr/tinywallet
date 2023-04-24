const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

// Add this line at the top of the file
const { execFile } = require('child_process');
const fs = require('fs'); // Add the 'fs' import here


// Add this event listener at the bottom of the file
ipcMain.handle('fetch-wallet-info', async () => {
  return new Promise((resolve, reject) => {
    const cliPath = path.join(__dirname, './../../tinywallet');

    execFile(cliPath, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Golang CLI: ${error}`);
        reject(error);
      } else if (stderr) {
        console.error(`Error in Golang CLI: ${stderr}`);
        reject(new Error(stderr));
      } else {
        console.log(stdout)
        console.log(stderr)
        const walletInfo = JSON.parse(stdout);
        resolve(walletInfo);
      }
    });
  });
});

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
