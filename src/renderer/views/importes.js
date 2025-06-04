const parametros = window.parametrosImportes || {};
let listaColumnasGrillaHistorialImportes = [
  {columnName:"Centro Médico", alineacion: alignmentLeft},
  {columnName:"Tipo de Descuento", alineacion: alignmentLeft}, 
  {columnName: "Valor", alineacion: alignmentRight},
  {columnName: "$Sesión Tratamiento", alineacion: alignmentRight} , 
  {columnName: "$Sesión Evaluación", alineacion: alignmentRight},
  {columnName: "Vigencia Desde", alineacion: alignmentLeft},
  {columnName: "Vigencia Hasta", alineacion: alignmentLeft},
  {columnName: "Estado", alineacion: alignmentCenter},
  {columnName: "Editar", alineacion: alignmentCenter}
];

let tblHistorialImportes = null;
let cboCentroMedico = null;
let cboEstado = null;
let cboTipoDescuento = null;
let navPaginationHistorialImportes = null;
let dtFechaVigenciaDesde = null;
let fpFechaVigenciaDesde = null;
let dtFechavigenciaHasta = null;
let fpFechaVigenciaHasta = null;
let btnLimpiarFiltrosHistorialImporte = null;
let btnFiltrarHistorialImporte = null;
let btnNuevoHistorialImporte = null;

let filtros = null;

// =============================
// 🚀 Métodos de carga inicial
// ==============================

function inicializarObjetosDOM() {
  flatpickr.localize(flatpickr.l10ns.es);
  tblHistorialImportes = document.getElementById('tblHistorialImportes');
  cboCentroMedico = document.getElementById('cboCentroMedico');
  cboTipoDescuento = document.getElementById('cboTipoDescuento');
  cboEstado = document.getElementById('cboEstado');
  dtFechaVigenciaDesde = document.getElementById('fechaVigenciaDesde');
  fpFechaVigenciaDesde = flatpickr("#fechaVigenciaDesde", {
    enableTime: false,
    dateFormat: "d-m-Y",
    altInput: true,
    altFormat: "d \\de F, Y",
    onChange: function(selectedDates, dateStr, instance) {
      resaltarFiltroSiActivo(instance.altInput);
    }
  });
  dtFechavigenciaHasta = document.getElementById('fechaVigenciaHasta');
  fpFechaVigenciaHasta = flatpickr("#fechaVigenciaHasta", {
    enableTime: false,
    dateFormat: "d-m-Y",
    altInput: true,
    altFormat: "d \\de F, Y",
    onChange: function(selectedDates, dateStr, instance) {
      resaltarFiltroSiActivo(instance.altInput);
    }
  });
  navPaginationHistorialImportes = document.getElementById('paginationHistorialImportes');
  btnLimpiarFiltrosHistorialImporte = document.getElementById('btnLimpiarFiltrosHistorialImporte');
  btnFiltrarHistorialImporte = document.getElementById('btnFiltrarHistorialImporte');
  btnNuevoHistorialImporte = document.getElementById('btnNuevoHistorialImporte');
  filtros = [cboCentroMedico, cboTipoDescuento, cboEstado, dtFechaVigenciaDesde, dtFechavigenciaHasta];
}

function inicializarEventos() {

  //Inicializar eventos de los botones
  document.getElementById('btnAbrirCalendarioFechaDesde').addEventListener('click', function() {
    fpFechaVigenciaDesde.open();
  });
  document.getElementById('btnAbrirCalendarioFechaHasta').addEventListener('click', function() {
    fpFechaVigenciaHasta.open();
  });
  btnLimpiarFiltrosHistorialImporte.addEventListener('click', () => limpiarFiltrosHistorialImporte());
  btnFiltrarHistorialImporte.addEventListener('click', () => filtrarHistorialImportes());
  btnNuevoHistorialImporte.addEventListener('click', async () => openNuevoHistorialImporteModal());
  document.getElementById('importes').addEventListener('refrescarImportes', (e) => {
    const { idCentroMedico } = e.detail;
    console.log('🔄 Recibido ID centro médico:', idCentroMedico);
  
    // Actualizar parámetros si querés
    window.parametrosImportes = { idCentroMedico };
  
    limpiarFiltrosHistorialImporte();
    leerParametros();
    cargarHistorialImportes(); // O cualquier función relevante
  });  

  filtros.forEach(filtro => {
    filtro.addEventListener('change', () => resaltarFiltroSiActivo(filtro));
  });
  
}

async function cargarCentrosMedicosDesdeImportes() {
  await cargarDatosEnDesplegable({
    apiMethod: () => window.viewModelAPI.getActiveCentroMedico(),
    comboElement: cboCentroMedico,
    descripcionDefault: "Seleccione un Centro Médico",
    errorContext: 'IMPORTES_CARGAR_CENTROS_MEDICOS'
  });
}

async function cargarTiposDescuento(){  
  await cargarDatosEnDesplegable({
    apiMethod: () => window.historialImportesAPI.getAllTiposDescuento(),
    comboElement: cboTipoDescuento,
    descripcionDefault: "Seleccione Tipo de Descuento",
    errorContext: 'IMPORTES_CARGAR_TIPOS_DESCUENTO'
  });
}

async function cargarEstados() {
  await cargarDatosEnDesplegable({
    apiMethod: () => window.historialImportesAPI.getAllEstados(),
    comboElement: cboEstado,
    descripcionDefault: "Seleccione Estado",
    errorContext: 'IMPORTES_CARGAR_ESTADOS'
  });
}

function leerParametros() {
  const parametros = window.parametrosImportes || {};
  if (parametros) {
    const idCentroMedico = parametros.idCentroMedico;
    if (idCentroMedico) {
      cboCentroMedico.value = idCentroMedico;
    }
    const idEstado = parametros.idEstado;
    if (idEstado) {
      cboEstado.value = idEstado;
    }

    filtros.forEach(filtro => {
      if (filtro.value) {
        filtro.classList.add('filtro-activo');
      }
    });
  }
}

// =========================
// 🛠️ Funciones utilitarias
// =========================



function crearColumnaEditarHistorialImporte(tr, historialImporte) {
  const tdEditar = document.createElement('td');
  tdEditar.classList.add('text-center'); 

  const editIcon = document.createElement('i');
  editIcon.id = 'editIcon';
  editIcon.className = 'fas fa-edit'; 
  //editIcon.classList.toggle('disabled-icon', centroMedico.estado !== 'Activo');
  editIcon.style.cursor = 'pointer'; 
  editIcon.title = 'Editar'; 
  editIcon.onclick = () => {
      window.historialImportesAPI.editNuevoHistorialImporteModal(historialImporte.idHistorialImporte); // Enviar el ID del centro médico al modal de edición
  };
  tdEditar.appendChild(editIcon);
  tr.appendChild(tdEditar);
}

function ImporteCrearColumnaEstado(tr, estado) {
  const tdEstado = document.createElement('td');
  tdEstado.classList.add('text-center', 'td-estado');
  
  const span = document.createElement('span');
  span.classList.add('badge');
  
  actualizarSpanEstado(span, estado); // Asignar clase y texto según el estado

  tdEstado.appendChild(span);
  tr.appendChild(tdEstado);
}

function ImporteActualizarColumnaEstadoSiCambio(tr, nuevoEstado) {
  const tdEstado = tr.querySelector('.td-estado');
  if (!tdEstado) return;

  const span = tdEstado.querySelector('span');
  if (!span) return;

  const estadoActual = span.textContent?.trim();

  // Solo actualizar si el estado es diferente
  if (estadoActual === nuevoEstado) return;

  // Limpiar clases anteriores
  span.classList.remove('bg-success', 'bg-danger', 'bg-secondary');
  actualizarSpanEstado(span, nuevoEstado);
  
}

function actualizarSpanEstado(span, estado) {
  // Asignar clase según el nuevo estado
  if (estado === 'Activo') {
    span.classList.add('bg-success');
  } else if (estado === 'Inactivo') {
    span.classList.add('bg-danger');
  } else {
    span.classList.add('bg-secondary');
  }

  // Actualizar el texto
  span.textContent = estado;
}


function addHistorialImporteToTable(historialImporte, tbody, isNew=false) {
  const tr = document.createElement('tr');
  tr.setAttribute('data-id', historialImporte.idHistorialImporte); // Agregar un identificador único

  if (isNew) {
      animarNuevaFila(tr); // Aplicar la animación a la fila
  }

  createTableData(historialImporte.centroMedico, tr, alignmentLeft);
  createTableData(historialImporte.tipoDescuento, tr, alignmentLeft);
  createTableData(historialImporte.valor, tr, alignmentRight);
  createTableData(historialImporte.importeSesionEvaluacion, tr, alignmentRight);
  createTableData(historialImporte.importeSesionTratamiento, tr, alignmentRight);
  createTableData(formatearFechaDesdeBD(new Date(historialImporte.vigenciaDesde)), tr, alignmentLeft);
  if (historialImporte.vigenciaHasta === null) {
    createTableData('-', tr, alignmentLeft);
  } else {    
    createTableData(formatearFechaDesdeBD(new Date(historialImporte.vigenciaHasta)), tr, alignmentLeft);
  }
  ImporteCrearColumnaEstado(tr, historialImporte.estado);
  crearColumnaEditarHistorialImporte(tr, historialImporte);

  tbody.appendChild(tr);
}  

function updateImportesTableContent(historialImportesData) {
  if (tblHistorialImportes.querySelector('tbody')) {
    tblHistorialImportes.removeChild(tblHistorialImportes.querySelector('tbody'));
  }
  const tbody = document.createElement('tbody');
  historialImportesData.forEach(historialImporte => {
      addHistorialImporteToTable(historialImporte, tbody);
  });
  tblHistorialImportes.appendChild(tbody);
}

function removeImportesTableContent() {
  if (tblHistorialImportes.querySelector('tbody')) {
    tblHistorialImportes.removeChild(tblHistorialImportes.querySelector('tbody'));
  }
}

function changePageHistorialImporte(page, totalPages, actionMethod) {
  if (page >= 1 && page <= totalPages) {
      // Determinar qué método ejecutar según el nombre
      if (actionMethod === Actions.FILTER) {
          filtrarHistorialImportes(page);
      } else if (actionMethod === Actions.GETALL) {
          cargarHistorialImportes(page);
      }
  }
}

function obtenerFiltrosImportes(){
  let filters = {};

  const idCentroMedico = cboCentroMedico.value;
  if (idCentroMedico) {
      filters.idCentroMedico = idCentroMedico;
  }
  
  const idEstado = cboEstado.value;
  if (idEstado) {
      filters.idEstado = idEstado;
  }

  const idTipoDescuento = cboTipoDescuento.value; 
  if (idTipoDescuento) {
      filters.idTipoDescuento = idTipoDescuento;
  }
 
  const fpvd = fpFechaVigenciaDesde;
  if (fpvd.selectedDates && fpvd.selectedDates.length > 0) {
      filters.fechaVigenciaDesde = fpvd.formatDate(fpvd.selectedDates[0], "Y-m-d");
  }

  const fpvh = fpFechaVigenciaHasta;
  if (fpvh.selectedDates && fpvh.selectedDates.length > 0) { 
      filters.fechaVigenciaHasta = fpvh.formatDate(fpvh.selectedDates[0], "Y-m-d");
  }

  return filters;
}

function limpiarFiltrosHistorialImporte() {
  cboCentroMedico.value = "";
  cboEstado.value = "";
  cboTipoDescuento.value = "";
  fpFechaVigenciaDesde.clear();
  fpFechaVigenciaHasta.clear();
  removerClasesFiltroActivos();
  removeImportesTableContent();
  cleanPagination(navPaginationHistorialImportes);
}

function hayDatosParafiltrar() {  
  if  (cboCentroMedico.value || cboEstado.value || cboTipoDescuento.value || dtFechaVigenciaDesde.value || dtFechavigenciaHasta.value) {
      return true;
  }
  return false;
}

function removerClasesFiltroActivos() { 
  filtros.forEach(filtro => {
      if (filtro.classList.contains('filtro-activo')) {
          filtro.classList.remove('filtro-activo');
      }
  });
}

async function validarFiltroCentroMedico() {
  const idCentroMedico = cboCentroMedico.value;

  if (!idCentroMedico) {
    mostrarErrorUsuario("El centro médico es requerido para crear un nuevo importe", 'warning');
    return false;
  }

  try {
    const response = await window.historialImportesAPI.getTotalActiveHistorialImporteByCentroMedicoId(idCentroMedico);
    if (!response.ok) throw new ViewModelAPIError();
    
    const total = response.data;
    if (total > 0) {
      mostrarErrorUsuario("Ya existe un importe activo para el centro médico seleccionado. Por favor, inactívelo antes de crear uno nuevo", 'warning');
      return false;
    }
  } catch (error) {
    // Puedes mostrar el error si querés
    manejarErrores(error, 'IMPORTES_VALIDAR_HISTORIAL_IMPORTE_ACTIVO');
    return false;
  }

  return true;
}

async function getPaginatedHistorialImportes(page){
  let paginationData = {page: page, pageSize: pageSize};
  const filters = obtenerFiltrosImportes();
  const resultado = await window.historialImportesAPI.getPaginatedHistorialImportes(paginationData, filters); 
  if (!resultado.ok) throw new ViewModelAPIError();
  
  const result = resultado.data;
  const historialImportesData = result.data;

  updateImportesTableContent(historialImportesData);
  refreshPagination(navPaginationHistorialImportes, result.currentPage, result.totalPages, Actions.FILTER, changePageHistorialImporte);
}

// =========================
// 🧩 Manejo de Eventos
// =========================
window.historialImportesAPI.onNewAddedHistorialImporte(async (event, historialImporteCreado) => {
  try {
    const tbody = tblHistorialImportes.querySelector('tbody') || document.createElement('tbody');
      
    // Verificar si el nuevo registro pertenece a la página actual
    const currentPage = parseInt(document.querySelector('#paginationHistorialImportes .pagination .active a')?.textContent || 1, 10);
    const registrosEnPaginaActual = tbody.children.length;
    const isOnCurrentPage = registrosEnPaginaActual < pageSize;

    if (isOnCurrentPage) {
        addHistorialImporteToTable(historialImporteCreado, tbody, true);
        if (!tblHistorialImportes.contains(tbody)) {
          tblHistorialImportes.appendChild(tbody);
        }
    } else {
        // Si no pertenece a la página actual, recargar la paginación
        const paginationData = { page: currentPage, pageSize: pageSize };
        
        const resultado = await window.historialImportesAPI.getPaginatedHistorialImportes(paginationData, obtenerFiltrosImportes());
        if (!resultado.ok) throw new ViewModelAPIError();
        const result = resultado.data;
        refreshPagination(navPaginationHistorialImportes, result.currentPage, result.totalPages, Actions.FILTER, changePageHistorialImporte);
    }
    mostrarErrorUsuario("Historial de importe creado correctamente", 'info');
  } catch (error) {
    manejarErrores(error, 'IMPORTES_ON_NEW_ADDED_HISTORIAL_IMPORTE');
  }
  
});

window.historialImportesAPI.onEditedHistorialImporte((event, historialImporteEdited) => {
  const row = document.querySelector(`#tblHistorialImportes tr[data-id='${historialImporteEdited.idHistorialImporte}']`);
  if (row) {
      animarFilaEditada(row);
      const cells = row.children;
      cells[0].textContent = historialImporteEdited.centroMedico; // Centro Médico
      cells[1].textContent = historialImporteEdited.tipoDescuento; // Tipo de Descuento
      cells[2].textContent = historialImporteEdited.valor; // Valor
      cells[3].textContent = historialImporteEdited.importeSesionTratamiento; // $Sesión Tratamiento
      cells[4].textContent = historialImporteEdited.importeSesionEvaluacion; // $Sesión Evaluación
      cells[5].textContent = formatearFechaDesdeBD(new Date(historialImporteEdited.vigenciaDesde)); // Vigencia Desde
      cells[6].textContent = historialImporteEdited.vigenciaHasta ? formatearFechaDesdeBD(new Date(historialImporteEdited.vigenciaHasta)) : '-'; // Vigencia Hasta
      ImporteActualizarColumnaEstadoSiCambio(row, historialImporteEdited.estado); // Actualizar el estado si ha cambiado
  }
  mostrarErrorUsuario("Historial Importe actualizado correctamente", "info");

})

// =========================
// 🧠 Funciones principales
// =========================

async function cargarHistorialImportes(page = 1){
  try {
    await getPaginatedHistorialImportes(page);
  } catch (error) {
    manejarErrores(error, 'IMPORTES_CARGAR__HISTORIAL_IMPORTES');
  }
}

async function filtrarHistorialImportes(page = 1) {
  try {
      if (!hayDatosParafiltrar()) {
          mostrarErrorUsuario("Debe ingresar al menos un filtro para realizar la búsqueda", 'warning');
          return;
      }
      await getPaginatedHistorialImportes(page);      
  } catch (error) {
      manejarErrores(error, 'IMPORTES_FILTRAR__HISTORIAL_IMPORTES');
  }
}

async function openNuevoHistorialImporteModal() {
  try {
    if (await validarFiltroCentroMedico()) {
      idCentroMedico = cboCentroMedico.value;
      descuentoDefault = await window.historialImportesAPI.getDefaultTipoDescuentoNewHistorialImporte(idCentroMedico);
      if (!descuentoDefault.ok) throw new ViewModelAPIError();
      window.historialImportesAPI.openNuevoHistorialImporteModal(descuentoDefault.data);
    }
  } catch (error) {
    manejarErrores(error, 'IMPORTES_OPEN_NUEVO_HISTORIAL_IMPORTE_MODAL');
  }
}

async function cargarInicial(){
  inicializarObjetosDOM();
  inicializarEventos();
  addTableHeaders(tblHistorialImportes, listaColumnasGrillaHistorialImportes);
  await cargarCentrosMedicosDesdeImportes();
  await cargarTiposDescuento();
  await cargarEstados();
  leerParametros();
}

(async () => {
  await cargarInicial();
  await cargarHistorialImportes();
})();