const { app, BrowserWindow } = require('electron');
const { exec, execFile } = require('child_process');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  // index.html dosyasını yükleyin
  win.loadFile('index.html');

  // Console uygulamanızı çalıştırın
  const consoleApp = exec("node "+path.join(__dirname, 'console-app.js')); // Optional: Preload script kullanabilirsiniz,


  // Console çıktısını pencerede göstermek isterseniz:
  consoleApp.stdout.on('data', (data) => {
    win.webContents.send('console-log', data);
  });

  // Uygulama kapandığında pencereyi temizleyin
  win.on('closed', () => {
    win = null;
  });
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
