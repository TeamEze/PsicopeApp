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
      origen: 'importes.js - cargarCentrosMedicos',
      mensajeError: 'Ocurrió un error al cargar los centros médicos. Por favor, contacte al administrador.',
      mensajeErrorGenerico: 'Error inesperado al cargar los centros médicos. Por favor, contacte al administrador.'
  },
  IMPORTES_CARGAR_TIPOS_DESCUENTO: {
      methodAPI: 'getAllTiposDescuento',
      origen: 'importes.js - cargarTiposDescuento',
      mensajeError: 'Ocurrió un error al cargar los tipos de descuento. Por favor, contacte al administrador.',
      mensajeErrorGenerico: 'Error inesperado al cargar los tipos de descuento. Por favor, contacte al administrador.'
  },
  IMPORTES_CARGAR_ESTADOS: {
      methodAPI: 'getAllEstados',
      origen: 'importes.js - cargarEstados',
      mensajeError: 'Ocurrió un error al cargar los estados. Por favor, contacte al administrador.',
      mensajeErrorGenerico: 'Error inesperado al cargar los estados. Por favor, contacte al administrador.'
  }
};