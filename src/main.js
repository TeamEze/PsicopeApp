const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const localidadRepository = require('./data-access/repository/localidad.repository.js');
const LocalidadService = require('./services/localidad.service.js');
const localidadService = new LocalidadService(localidadRepository);
const centroMedicoRepository = require('./data-access/repository/centroMedico.repository.js');
const CentroMedicoMapper = require('./mappers/centroMedicoMapper.js');
const CentroMedicoService = require('./services/centroMedico.service.js');
const centroMedicoService = new CentroMedicoService(centroMedicoRepository, CentroMedicoMapper);
const errorLogRepository = require('./data-access/repository/errorLog.repository.js');
const ErrorLogService = require('./services/errorLog.service.js');
const errorLogService = new ErrorLogService(errorLogRepository);

const CentroMedicoViewModel = require('./viewModels/centroMedico.viewModel.js');
const centroMedicoViewModel = new CentroMedicoViewModel(centroMedicoService, localidadService, errorLogService);



const {setupIpcHandlers} = require('./handlers/ipcHandlerCentroMedico.js');
const { createMainWindow, createNuevoCentroMedicoWindow } = require('./windowManager.js');

let mainWindow;
let nuevoCentroMedicoWindow;

app.whenReady().then(async () => {
  
  mainWindow = createMainWindow(); 
  nuevoCentroMedicoWindow = createNuevoCentroMedicoWindow(mainWindow);
  setupIpcHandlers(mainWindow, nuevoCentroMedicoWindow, centroMedicoViewModel, errorLogService);
  mainWindow.webContents.openDevTools();

});
