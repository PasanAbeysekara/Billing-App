const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.on('ready', () => {
  backendProcess = spawn('node', [path.join(__dirname, '../backend/server.js')]);
  backendProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  backendProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  backendProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    backendProcess.kill();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
