let cboCentroMedico = null;
let cboTipoDescuento = null;
let cboEstado = null;
let nbValor = null;
let nbImporteSesionEvaluacion = null;
let nbImporteSesionTratamiento = null;
let dtVigenciaDesde = null;
let fpVigenciaDesde = null;
let dtVigenciaHasta = null;
let fpVigenciaHasta = null;
let formHistorialImporte = null;
let isEditingHistorialImporte = false;
let editingHistorialImporteId = null;

// =============================
// 🚀 Métodos de carga inicial
// ==============================
function inicializarObjetosDOM(){
    flatpickr.localize(flatpickr.l10ns.es);
    cboCentroMedico = document.getElementById('cboCentroMedico');
    cboTipoDescuento = document.getElementById('cboTipoDescuento');
    cboEstado = document.getElementById('cboEstado');
    nbValor = document.getElementById('nbValor');
    nbImporteSesionEvaluacion = document.getElementById('nbImporteSesionEvaluacion');
    nbImporteSesionTratamiento = document.getElementById('nbImporteSesionTratamiento');
    dtVigenciaDesde = document.getElementById('dtVigenciaDesde');
    fpVigenciaDesde = flatpickr("#dtVigenciaDesde", {
        enableTime: false,
        dateFormat: "d-m-Y",
        altInput: true,
        altFormat: "d \\de F, Y",
        appendTo: document.body, // <-- esto saca el calendario fuera del modal
        position: "above"
      });
      const calendar = document.querySelector('.flatpickr-calendar');
      document.body.appendChild(calendar); // fuerza su ubicación fuera del modal
    dtVigenciaHasta = document.getElementById('dtVigenciaHasta');
    fpVigenciaHasta = flatpickr("#dtVigenciaHasta", {
        enableTime: false,
        dateFormat: "d-m-Y",
        altInput: true,
        altFormat: "d \\de F, Y",
        appendTo: document.body,
        position: "above" 
      });
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
    const idHistorialImporte = editingHistorialImporteId || null; // Si estamos editando, usamos el ID actual
    const idCentroMedico = cboCentroMedico.value;
    const idTipoDescuento = cboTipoDescuento.value;
    const idEstado = cboEstado.value;
    const valor = nbValor.value;
    const importeSesionEvaluacion = nbImporteSesionEvaluacion.value;
    const importeSesionTratamiento = nbImporteSesionTratamiento.value;
    let vigenciaDesde = null
    const fpvd = fpVigenciaDesde;
    if (fpvd.selectedDates && fpvd.selectedDates.length > 0) {
        vigenciaDesde = fpvd.formatDate(fpvd.selectedDates[0], "Y-m-d");
    }
  
    let vigenciaHasta = null;
    const fpvh = fpVigenciaHasta;
    if (fpvh.selectedDates && fpvh.selectedDates.length > 0) { 
        vigenciaHasta = fpvh.formatDate(fpvh.selectedDates[0], "Y-m-d");
    }

    return {
        idHistorialImporte,
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

window.historialImportesAPI.loadDefaultTipoDescuento((event, descuentoDefault) => {
    if (!descuentoDefault.idTipoDescuento) {
        if (cboCentroMedico) {
            cboCentroMedico.disabled = true;
            cboCentroMedico.value = descuentoDefault.idCentroMedico;
        }
        if (cboTipoDescuento){
            cboTipoDescuento.disabled = false;
            cboTipoDescuento.focus();
        } 
        if (nbValor) nbValor.disabled = false;    
        if (cboEstado) cboEstado.value = 1; // Estado Activo por defecto    
        
        return;
    }
    if (cboCentroMedico) {
        cboCentroMedico.value = descuentoDefault.idCentroMedico;
        cboCentroMedico.disabled = true;
    }
    if (cboTipoDescuento) {
        cboTipoDescuento.value = descuentoDefault.idTipoDescuento;
        cboTipoDescuento.disabled = true;
    }
    if (nbValor) {
        nbValor.value = descuentoDefault.valor;
        nbValor.disabled = true;
    }
    cboEstado.value = 1; // Estado Activo por defecto
    nbImporteSesionEvaluacion.focus();
});

// Maneja el evento de edición de un centro médico
window.historialImportesAPI.onEditarHistorialImporte(async (event, idHistorialImporte) => {
    try {
        isEditingHistorialImporte = true;
        editingHistorialImporteId = idHistorialImporte;
  
        if (formHistorialImporte) {
            limpiarFormularioHistorialImporte();
        }
    
        const resultado = await window.historialImportesAPI.getHistorialImporteById(idHistorialImporte);
        if (!resultado.ok) throw new ViewModelAPIError();
    
        const historialImporte = resultado.data;
        cboCentroMedico.value = historialImporte.idCentroMedico;
        cboTipoDescuento.value = historialImporte.idTipoDescuento;
        nbValor.value = historialImporte.valor;
        nbImporteSesionEvaluacion.value = historialImporte.importeSesionEvaluacion;
        nbImporteSesionTratamiento.value = historialImporte.importeSesionTratamiento;

        if (historialImporte.vigenciaDesde) {
            //fpVigenciaDesde.setDate(new Date(historialImporte.vigenciaDesde));
            // Evita que JS la convierta a zona local
            const fechaDesde = historialImporte.vigenciaDesde;
            const fechaDesdeFormateada = fechaDesde.toISOString().split('T')[0]; // "2025-06-01"

            fpVigenciaDesde.setDate(fechaDesdeFormateada, true, "Y-m-d");

        }
        if (historialImporte.vigenciaHasta) {
            const fechaHasta = historialImporte.vigenciaHasta;
            const fechaHastaFormateada = fechaHasta.toISOString().split('T')[0]; // "2025-06-01"
            fpVigenciaHasta.setDate(fechaHastaFormateada, true, "Y-m-d");
        }
        cboEstado.value = historialImporte.idEstado;
        nbImporteSesionEvaluacion.focus();
    } catch (error) {
        manejarErrorModal(error, 'NUEVOHISTORIALIMPORTE_MODAL_ON_EDITAR_HISTORIAL_IMPORTE');
    }
  });

// =========================
// 🧠 Funciones principales
// =========================
async function manejarEnvioFormularioHistorialImporte(event) {
    try {
      event.preventDefault();
      /*if (!validarFormulario()) return; */
  
      const historialImporte = obtenerDatosFormularioImporte();
      if (isEditingHistorialImporte) {
        const resultado = await window.historialImportesAPI.updateHistorialImporte(historialImporte);
        if (!resultado.ok) throw new ViewModelAPIError();
        
        window.historialImportesAPI.sendEditedHistorialImporteToMain(resultado.data);
        isEditingHistorialImporte = false;
        editingHistorialImporteId = null;
      } else {
        const importeCreado = await window.historialImportesAPI.createHistorialImporte(historialImporte);
        if (!importeCreado.ok) throw new ViewModelAPIError();

        window.historialImportesAPI.sendCreatedHistorialImporteToMain(importeCreado.data);
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