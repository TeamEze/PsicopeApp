const { BrowserWindow } = require('electron');
const path = require('path');

let nuevoCentroMedicoWindow = null;

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

  mainWindow.setMenu(null);
  mainWindow.loadFile(path.join(__dirname, '/renderer/views/index.html'));

  return mainWindow;
}

function createNuevoCentroMedicoWindow(mainWindow) {
  if (!nuevoCentroMedicoWindow) {
    nuevoCentroMedicoWindow = new BrowserWindow({
      width: 600,
      height: 700,
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
    nuevoCentroMedicoWindow.loadFile('renderer/views/NuevoCentroMedico.html');

    // Evitar que la ventana se destruya al cerrarla
    nuevoCentroMedicoWindow.on('close', (event) => {
      event.preventDefault();
      nuevoCentroMedicoWindow.hide();
    });

    //nuevoCentroMedicoWindow.webContents.openDevTools();
  }

  return nuevoCentroMedicoWindow;
}

module.exports = {
  createMainWindow,
  createNuevoCentroMedicoWindow
};