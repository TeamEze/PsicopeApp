const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const centroMedicoRepository = require('./data-access/repository/centroMedico.repository.js');
const CentroMedicoMapper = require('./mappers/centroMedicoMapper.js');
const CentroMedicoService = require('./services/centroMedico.service.js');
const centroMedicoService = new CentroMedicoService(centroMedicoRepository, CentroMedicoMapper);
const CentroMedicoViewModel = require('./viewModels/centroMedico.viewModel.js');
const centroMedicoViewModel = new CentroMedicoViewModel(centroMedicoService);

const {setupIpcHandlers} = require('./handlers/ipcHandlerCentroMedico.js');
const { createMainWindow, createNuevoCentroMedicoWindow } = require('./windowManager.js');

let mainWindow;
let nuevoCentroMedicoWindow;

app.whenReady().then(async () => {
  
  mainWindow = createMainWindow(); 
  nuevoCentroMedicoWindow = createNuevoCentroMedicoWindow();
  setupIpcHandlers(mainWindow, nuevoCentroMedicoWindow, centroMedicoViewModel);
  mainWindow.webContents.openDevTools();

});
