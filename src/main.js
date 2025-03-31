const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Repositorios
const centroMedicoRepository = require('./data-access/repository/centroMedico.repository.js');
// Mappers
const CentroMedicoMapper = require('./mappers/centroMedicoMapper.js');
// Servicios
const CentroMedicoService = require('./services/centroMedico.service.js');
const centroMedicoService = new CentroMedicoService(centroMedicoRepository, CentroMedicoMapper);
// View Models
const CentroMedicoViewModel = require('./viewModels/centroMedico.viewModel.js');
const centroMedicoViewModel = new CentroMedicoViewModel(centroMedicoService);

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
  return await centroMedicoViewModel.getCentrosMedicos();
});

ipcMain.handle('createCentroMedico', async (event, centroMedico) => {
  return await centroMedicoViewModel.createCentroMedico(centroMedico);
});

ipcMain.handle('getCentrosMedicosByFilters', async (event, filters) => {  
  return await centroMedicoViewModel.getCentrosMedicosByFilters(filters);
});
