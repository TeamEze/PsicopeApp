const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const centroMedicoService = require('./services/centroMedico.service.js')

let mainWindow;

app.whenReady().then(async () => {
  
  //await initializeDatabase();  // Inicializa la BD al abrir la app

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.setMenu(null);
  mainWindow.loadFile(path.join(__dirname, '/renderer/views/index.html'));

  mainWindow.webContents.openDevTools();

});

// Comunicación IPC
ipcMain.handle('getCentrosMedicos', async () => await centroMedicoService.getAllCentrosMedicos());
