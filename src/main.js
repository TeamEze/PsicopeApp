const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const CentroMedicoViewModel = require('./viewModels/centroMedico.viewModel.js');

let mainWindow;

app.whenReady().then(async () => {
  
  //await initializeDatabase();  // Inicializa la BD al abrir la app

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // Mantener el aislamiento del contexto
      nodeIntegration: false // Deshabilitar Node.js en el renderizador
    }
  });
  mainWindow.setMenu(null);
  mainWindow.loadFile(path.join(__dirname, '/renderer/views/index.html'));

  mainWindow.webContents.openDevTools();

});

// Comunicación IPC
ipcMain.handle('getCentrosMedicos', async () => {
  return await CentroMedicoViewModel.getCentrosMedicos();
});

ipcMain.handle('createCentroMedico', async (event, centroMedico) => {
  return await CentroMedicoViewModel.createCentroMedico(centroMedico);
});
