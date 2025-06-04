// Este archivo contiene funciones auxiliares para el manejo de errores y la creación de mensajes de error en la aplicación.
class ViewModelAPIError extends Error {
  constructor(message = "Error interno en llamada a la API", details = null) {
    super(message);
    this.name = 'ViewModelAPIError';
    this.details = details; // Información adicional sobre el error
  }
}

const mensajeriaErrores = {    
  INDEX_CARGAR_LOCALIDADES: {
      methodAPI: 'getAllLocalidades',
      origen: 'index.js - cargarLocalidades',
      mensajeError: 'Ocurrió un error al cargar las localidades. Por favor, contacte al administrador.',
      mensajeErrorGenerico: 'Error inesperado al cargar las localidades. Por favor, contacte al administrador.'
  },
  INDEX_FILTRAR_CENTROS_MEDICOS: {
      methodAPI: 'getPaginatedFilteredCentrosMedicos',
      origen: 'index.js - filtrarCentrosMedicos',
      mensajeError: 'Ocurrió un error al filtrar los centros médicos. Por favor, contacte al administrador.',
      mensajeErrorGenerico: 'Error inesperado al filtrar los centros médicos. Por favor, contacte al administrador.'
  },
  INDEX_CREAR_CENTRO_MEDICO: {
      methodAPI: 'createCentroMedico',
      origen: 'index.js - crearCentroMedico',
      mensajeError: 'Ocurrió un error al crear el centro médico. Por favor, contacte al administrador.',
      mensajeErrorGenerico: 'Error inesperado al crear el centro médico. Por favor, contacte al administrador.'
  },
  INDEX_CARGAR_CENTROS_MEDICOS: {
      methodAPI: 'getPaginatedActiveCentrosMedicos',
      origen: 'index.js - cargarCentrosMedicos',
      mensajeError: 'Ocurrió un error al cargar los centros médicos. Por favor, contacte al administrador.',
      mensajeErrorGenerico: 'Error inesperado al cargar los centros médicos. Por favor, contacte al administrador.'
  },
  INDEX_REACTIVAR_CENTRO_MEDICO: {
      methodAPI: 'updateEstadoCentroMedico',
      origen: 'index.js - reactivarCentroMedico',
      mensajeError: 'Ocurrió un error al reactivar el centro médico. Por favor, contacte al administrador.',
      mensajeErrorGenerico: 'Error inesperado al reactivar el centro médico. Por favor, contacte al administrador.'        
  },
  INDEX_INACTIVAR_CENTRO_MEDICO: {
      methodAPI: 'updateEstadoCentroMedico',
      origen: 'index.js - manejarConfirmacionInactivacion',
      mensajeError: 'Ocurrió un error al inactivar el centro médico. Por favor, contacte al administrador.',
      mensajeErrorGenerico: 'Error inesperado al inactivar el centro médico. Por favor, contacte al administrador.'
  },
  NUEVOCENTROMEDICO_MODAL_ON_EDITAR_CENTRO_MEDICO: {
      methodAPI: 'getCentroMedicoById',
      origen: 'NuevoCentroMedico.js - onEditarCentroMedico',
      mensajeError: 'Error al obtener datos del centro médico. Por favor, contacte al administrador.',
      mensajeErrorGenerico: 'Error inesperado al al obtener datos del centro médico. Por favor, contacte al administrador.'
  },
  NUEVOCENTROMEDICO_MODAL_CARGAR_LOCALIDADES: {
      methodAPI: 'getAllLocalidades',
      origen: 'NuevoCentroMedico.js - cargarLocalidades',
      mensajeError: 'Ocurrió un error al cargar las localidades. Por favor, contacte al administrador.',
      mensajeErrorGenerico: 'Error inesperado al cargar las localidades. Por favor, contacte al administrador.'
  },
  NUEVOCENTROMEDICO_MODAL_SUBMIT_FORMULARIO: {
      methodAPI: 'updateCentroMedico',
      origen: 'NuevoCentroMedico.js - manejarEnvioFormularioCentroMedico',
      mensajeError: 'Ocurrió un error al procesar el formulario. Por favor, contacte al administrador.',
      mensajeErrorGenerico: 'Error inesperado al procesar el formulario. Por favor, contacte al administrador.'
  },
  IMPORTES_CARGAR_CENTROS_MEDICOS: {
      methodAPI: 'getActiveCentroMedico',
      origen: 'importes.js/NuevoHistorialImporte.js - cargarCentrosMedicos',
      mensajeError: 'Ocurrió un error al cargar los centros médicos. Por favor, contacte al administrador.',
      mensajeErrorGenerico: 'Error inesperado al cargar los centros médicos. Por favor, contacte al administrador.'
  },
  IMPORTES_CARGAR_TIPOS_DESCUENTO: {
      methodAPI: 'getAllTiposDescuento',
      origen: 'importes.js/NuevoHistorialImporte.js - cargarTiposDescuento',
      mensajeError: 'Ocurrió un error al cargar los tipos de descuento. Por favor, contacte al administrador.',
      mensajeErrorGenerico: 'Error inesperado al cargar los tipos de descuento. Por favor, contacte al administrador.'
  },
  IMPORTES_CARGAR_ESTADOS: {
      methodAPI: 'getAllEstados',
      origen: 'importes.js/NuevoHistorialImporte.js - cargarEstados',
      mensajeError: 'Ocurrió un error al cargar los estados. Por favor, contacte al administrador.',
      mensajeErrorGenerico: 'Error inesperado al cargar los estados. Por favor, contacte al administrador.'
  },
  IMPORTES_CARGAR__HISTORIAL_IMPORTES: {
        methodAPI: 'getPaginatedHistorialImportes',
        origen: 'importes.js - cargarHistorialImportes',
        mensajeError: 'Ocurrió un error al cargar el historial de importes. Por favor, contacte al administrador.',
        mensajeErrorGenerico: 'Error inesperado al cargar el historial de importes. Por favor, contacte al administrador.'
  },
  IMPORTES_FILTRAR__HISTORIAL_IMPORTES: {
        methodAPI: 'getPaginatedHistorialImportes',
        origen: 'importes.js - filtrarHistorialImportes',
        mensajeError: 'Ocurrió un error al filtrar el historial de importes. Por favor, contacte al administrador.',
        mensajeErrorGenerico: 'Error inesperado al filtrar el historial de importes. Por favor, contacte al administrador.'
  },
  IMPORTES_VALIDAR_HISTORIAL_IMPORTE_ACTIVO: {  
        methodAPI: 'getTotalActiveHistorialImporteByCentroMedicoId',
        origen: 'importes.js - validarFiltroCentroMedico',
        mensajeError: 'Ocurrió un error al validar historial de importe activo. Por favor, contacte al administrador.',
        mensajeErrorGenerico: 'Error inesperado al validar historial de importe activo. Por favor, contacte al administrador.'
  },
  IMPORTES_MODAL_SUBMIT_FORMULARIO: {   
        methodAPI: 'createHistorialImporte/updateHistorialImporte',
        origen: 'NuevoHistorialImporte.js - manejarEnvioFormularioHistorialImporte',
        mensajeError: 'Ocurrió un error al procesar el formulario. Por favor, contacte al administrador.',
        mensajeErrorGenerico: 'Error inesperado al procesar el formulario. Por favor, contacte al administrador.'
  },
  IMPORTES_OPEN_NUEVO_HISTORIAL_IMPORTE_MODAL: {
      methodAPI: 'getDefaultTipoDescuentoNewHistorialImporte',
      origen: 'importes.js - openNuevoHistorialImporteModal',
      mensajeError: 'Ocurrió un error al obtener descuento default. Por favor, contacte al administrador.',
      mensajeErrorGenerico: 'Error inesperado al obtener descuento default. Por favor, contacte al administrador.'
  },
  IMPORTES_ON_NEW_ADDED_HISTORIAL_IMPORTE: {
      methodAPI: 'getPaginatedHistorialImportes',
      origen: 'importes.js - onNewAddedHistorialImporte',
      mensajeError: 'Ocurrió un error al agregar el historial de importe creado. Por favor, contacte al administrador.',
      mensajeErrorGenerico: 'Error inesperado al agregar el historial de importe creado. Por favor, contacte al administrador.'
  },
  NUEVOHISTORIALIMPORTE_MODAL_ON_EDITAR_HISTORIAL_IMPORTE: {
      methodAPI: 'getHistorialImporteById',
      origen: 'NuevoHistorialImporte.js - onEditarHistorialImporte',
      mensajeError: 'Error al obtener datos del historial de importe. Por favor, contacte al administrador.',
      mensajeErrorGenerico: 'Error inesperado al obtener datos del historial de importe. Por favor, contacte al administrador.'
  }

};