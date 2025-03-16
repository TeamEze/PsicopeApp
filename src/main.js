import { app, BrowserWindow, ipcMain } from 'electron';
import centroMedicoService from './services/centroMedico.service.js';
import path from 'path';
import { fileURLToPath } from 'url';

let mainWindow;

// Necesario para __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.setMenu(null);
  mainWindow.loadFile('../src/renderer/views/index.html');

  mainWindow.webContents.openDevTools();

});

// Comunicación IPC
ipcMain.handle('getCentrosMedicos', async () => await centroMedicoService.getAllCentrosMedicos());
