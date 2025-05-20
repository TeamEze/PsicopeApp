const { BrowserWindow } = require('electron');
const path = require('path');

let nuevoCentroMedicoWindow = null;
let nuevoHistorialImporteWindow = null;

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // Mantener el aislamiento del contexto
      nodeIntegration: false // Deshabilitar Node.js en el renderizador
    }
  });
  
  mainWindow.maximize(); // <-- Esto hace que se abra maximizada
  mainWindow.setMenu(null);
  mainWindow.loadFile(path.join(__dirname, '/renderer/views/index.html'));

  return mainWindow;
}

function createNuevoCentroMedicoWindow(mainWindow) {
  if (!nuevoCentroMedicoWindow) {
    nuevoCentroMedicoWindow = new BrowserWindow({
      width: 450,
      height: 650,
      parent: mainWindow,
      modal: true,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    });

    nuevoCentroMedicoWindow.setMenu(null);
    nuevoCentroMedicoWindow.loadFile(path.join(__dirname, '/renderer/views/NuevoCentroMedico.html'));
    // Evitar que la ventana se destruya al cerrarla
    nuevoCentroMedicoWindow.on('close', (event) => {
      event.preventDefault();
      nuevoCentroMedicoWindow.hide();
    });

    nuevoCentroMedicoWindow.webContents.openDevTools();
  }

  return nuevoCentroMedicoWindow;
}

function createNuevoHistorialimporteWindow(mainWindow) {
  if (!nuevoHistorialImporteWindow) {
    nuevoHistorialImporteWindow = new BrowserWindow({
      width: 450,
      height: 720,
      parent: mainWindow,
      modal: true,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    });

    nuevoHistorialImporteWindow.setMenu(null);
    nuevoHistorialImporteWindow.loadFile(path.join(__dirname, '/renderer/views/NuevoHistorialImporte.html'));
    // Evitar que la ventana se destruya al cerrarla
    nuevoHistorialImporteWindow.on('close', (event) => {
      event.preventDefault();
      nuevoHistorialImporteWindow.hide();
    });

    nuevoHistorialImporteWindow.webContents.openDevTools();
  }

  return nuevoHistorialImporteWindow;
}

module.exports = {
  createMainWindow,
  createNuevoCentroMedicoWindow,
  createNuevoHistorialimporteWindow
};