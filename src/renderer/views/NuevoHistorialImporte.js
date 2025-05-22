let cboCentroMedico = null;
let cboTipoDescuento = null;
let cboEstado = null;
let form = null;

// =============================
// 🚀 Métodos de carga inicial
// ==============================
function inicializarObjetosDOM(){
    cboCentroMedico = document.getElementById('cboCentroMedico');
    cboTipoDescuento = document.getElementById('cboTipoDescuento');
    cboEstado = document.getElementById('cboEstado');
    form = document.getElementById('frmNuevoHistorialImporte');
    btnCancelarNuevoHistorialImporte = document.getElementById('btnCancelarNuevoHistorialImporte');
}
function inicializarEventos(){
    document.getElementById('btnCancelarNuevoHistorialImporte').addEventListener('click', cancelarFormulario);
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

function limpiarFormulario() {
    if(form){
        form.reset(); // Limpia todos los controles del formulario
        limpiarValidaciones(); // Limpia las validaciones y estilos 
    }
}

function limpiarValidaciones() {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
    });
}


// =========================
// 🧩 Manejo de Eventos
// =========================
window.historialImportesAPI.clearForm(() => {
    if (form) {
        limpiarFormulario();
    }
});

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