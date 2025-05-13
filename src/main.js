const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

//Setup dependencies of ErrorLogService
const errorLogRepository = require('./data-access/repository/errorLog.repository.js');
const ErrorLogService = require('./services/errorLog.service.js');
const errorLogService = new ErrorLogService(errorLogRepository);

//Setup dependencies of CentroMedicoViewModel
const localidadRepository = require('./data-access/repository/localidad.repository.js');
const LocalidadService = require('./services/localidad.service.js');
const localidadService = new LocalidadService(localidadRepository);
const centroMedicoRepository = require('./data-access/repository/centroMedico.repository.js');
const CentroMedicoMapper = require('./mappers/centroMedicoMapper.js');
const CentroMedicoService = require('./services/centroMedico.service.js');
const centroMedicoService = new CentroMedicoService(centroMedicoRepository, CentroMedicoMapper);
const CentroMedicoViewModel = require('./viewModels/centroMedico.viewModel.js');
const centroMedicoViewModel = new CentroMedicoViewModel(centroMedicoService, localidadService, errorLogService);

//Setup dependencies of HistorialImportesViewModel
//const HistorialImportesRepository = require('./data-access/repository/historialImportes.repository.js');
//const HistorialImportesService = require('./services/historialImportes.service.js');
const tipoDescuentoRepository = require('./data-access/repository/tipoDescuento.repository.js');
const TipoDescuentoService = require('./services/tipoDescuento.service.js');
const tipoDescuentoService = new TipoDescuentoService(tipoDescuentoRepository);

const HistorialImportesViewModel = require('./viewModels/historialImportes.viewModel.js');
const historialImportesViewModel = new HistorialImportesViewModel(tipoDescuentoService, errorLogService);




const {setupIpcHandlers} = require('./handlers/ipcHandlerCentroMedico.js');
const {setupIpcHandlersHistorialImportes} = require('./handlers/ipcHandlerHistorialImportes.js');
const { createMainWindow, createNuevoCentroMedicoWindow } = require('./windowManager.js');
const { set } = require('@automapper/core');

let mainWindow;
let nuevoCentroMedicoWindow;

app.whenReady().then(async () => {
  
  mainWindow = createMainWindow(); 
  nuevoCentroMedicoWindow = createNuevoCentroMedicoWindow(mainWindow);
  setupIpcHandlers(mainWindow, nuevoCentroMedicoWindow, centroMedicoViewModel, errorLogService);
  setupIpcHandlersHistorialImportes(historialImportesViewModel, errorLogService);
  mainWindow.webContents.openDevTools();

});
