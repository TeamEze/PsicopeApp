let cboCentroMedico = null;
let cboTipoDescuento = null;
let cboEstado = null;
let nbValor = null;
let nbImporteSesionEvaluacion = null;
let nbImporteSesionTratamiento = null;
let dtVigenciaDesde = null;
let dtVigenciaHasta = null;

let formHistorialImporte = null;
let isEditingHistorialImporte = false;
let editingHistorialImporteId = null;

// =============================
// 🚀 Métodos de carga inicial
// ==============================
function inicializarObjetosDOM(){
    cboCentroMedico = document.getElementById('cboCentroMedico');
    cboTipoDescuento = document.getElementById('cboTipoDescuento');
    cboEstado = document.getElementById('cboEstado');
    nbValor = document.getElementById('nbValor');
    nbImporteSesionEvaluacion = document.getElementById('nbImporteSesionEvaluacion');
    nbImporteSesionTratamiento = document.getElementById('nbImporteSesionTratamiento');
    dtVigenciaDesde = document.getElementById('dtVigenciaDesde');
    dtVigenciaHasta = document.getElementById('dtVigenciaHasta');
    formHistorialImporte = document.getElementById('frmNuevoHistorialImporte');
    btnCancelarNuevoHistorialImporte = document.getElementById('btnCancelarNuevoHistorialImporte');
    btnGuardarHistorialImporte = document.getElementById('btnGuardarHistorialImporte');
}
function inicializarEventos(){
    document.getElementById('btnCancelarNuevoHistorialImporte').addEventListener('click', cancelarFormulario);
    formHistorialImporte.addEventListener('submit', manejarEnvioFormularioHistorialImporte);
}
async function cargarCentrosMedicos(){
    try {
        const resultado = await window.viewModelAPI.getActiveCentroMedico(); 
        if (!resultado.ok) throw new ViewModelAPIError();
        
        const descripcionDefault = "Seleccione un Centro Médico";
        const centrosMedicos = resultado.data;
        cargarListaDesplegable(cboCentroMedico, centrosMedicos, descripcionDefault);  
    } catch (error) {
        manejarErrorModal(error, 'IMPORTES_CARGAR_CENTROS_MEDICOS');
    }
}

async function cargarTiposDescuento(){  
    try {
        const resultado = await window.historialImportesAPI.getAllTiposDescuento(); 
        if (!resultado.ok) throw new ViewModelAPIError();
        
        const descripcionDefault = "Seleccione Tipo de Descuento";
        const tiposDescuento = resultado.data;
        cargarListaDesplegable(cboTipoDescuento, tiposDescuento, descripcionDefault);  
    } catch (error) {
        manejarErrorModal(error, 'IMPORTES_CARGAR_TIPOS_DESCUENTO');
    }
}

async function cargarEstados(){  
    try {
        const resultado = await window.historialImportesAPI.getAllEstados(); 
        if (!resultado.ok) throw new ViewModelAPIError();
        
        const descripcionDefault = "Seleccione Estado";
        const estados = resultado.data;
        cargarListaDesplegable(cboEstado, estados, descripcionDefault);  
    } catch (error) {
        manejarErrorModal(error, 'IMPORTES_CARGAR_ESTADOS');
    }
}

// =========================
// 🛠️ Funciones utilitarias
// =========================
async function cancelarFormulario() {
    isEditing = false;
    editingCentroMedicoId = null;
    await window.historialImportesAPI.hideNuevoHistorialImporteModal();
}

function limpiarFormularioHistorialImporte() {
    if(formHistorialImporte){
        formHistorialImporte.reset(); // Limpia todos los controles del formulario
        limpiarValidaciones(); // Limpia las validaciones y estilos 
    }
}

function limpiarValidaciones() {
    const inputs = formHistorialImporte.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
    });
}

function obtenerDatosFormularioImporte(){
    const idCentroMedico = cboCentroMedico.value;
    const idTipoDescuento = cboTipoDescuento.value;
    const idEstado = cboEstado.value;
    const valor = nbValor.value;
    const importeSesionEvaluacion = nbImporteSesionEvaluacion.value;
    const importeSesionTratamiento = nbImporteSesionTratamiento.value;
    const vigenciaDesde = dtVigenciaDesde.value;
    const vigenciaHasta = dtVigenciaHasta.value;

    return {
        idCentroMedico,
        idTipoDescuento,
        valor,
        importeSesionEvaluacion,
        importeSesionTratamiento,
        vigenciaDesde,
        vigenciaHasta,
        idEstado
    };
}


// =========================
// 🧩 Manejo de Eventos
// =========================
window.historialImportesAPI.clearForm(() => {
    if (formHistorialImporte) {
        limpiarFormularioHistorialImporte();
    }
});

// =========================
// 🧠 Funciones principales
// =========================
async function manejarEnvioFormularioHistorialImporte(event) {
    try {
      event.preventDefault();
      /*if (!validarFormulario()) return; */
  
      const hiistorialImporte = obtenerDatosFormularioImporte();
      if (isEditingHistorialImporte) {
        /* const resultado = await window.viewModelAPI.updateCentroMedico(centroMedico);
        if (!resultado.ok) throw new ViewModelAPIError();
        window.viewModelAPI.sendCentroMedicoEdited(resultado.data); */
        isEditingHistorialImporte = false;
        editingHistorialImporteId = null;
      } else {
        const resultado = await window.historialImportesAPI.createHistorialImporte(hiistorialImporte);
        if (!resultado.ok) throw new ViewModelAPIError();

        window.historialImportesAPI.sendCreatedHistorialImporteToMain(resultado.data);
      }
  
      //limpiarFormularioHistorialImporte();
      window.historialImportesAPI.hideNuevoHistorialImporteModal()
    } catch (error) {
      manejarErrorModal(error, 'IMPORTES_MODAL_SUBMIT_FORMULARIO');
    }
  }

//Inicio
async function cargarInicial(){
    inicializarObjetosDOM();
    inicializarEventos();
    await cargarCentrosMedicos();
    await cargarTiposDescuento();
    await cargarEstados();
}
  
(async () => {
    await cargarInicial();
    //await cargarHistorialImportes();
})();