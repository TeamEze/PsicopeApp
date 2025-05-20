/* function cargarHistorialImportes() {
  const parametros = window.parametrosImportes || {};
  const idCentroMedico = parametros.idCentroMedico;

  if (!idCentroMedico) {
    console.warn('No se recibió idCentroMedico');
  } else {
    console.log('Cargando importes para centro médico ID:', idCentroMedico);
  }
  cargarCentroMedicos();

  }
cargarHistorialImportes(); */

const parametros = window.parametrosImportes || {};
let listaColumnasGrillaHistorialImportes = [
  {columnName:"Centro Médico", alineacion: alignmentLeft},
  {columnName:"Tipo de Descuento", alineacion: alignmentLeft}, 
  {columnName: "Valor", alineacion: alignmentRight},
  {columnName: "$Sesión Tratamiento", alineacion: alignmentRight} , 
  {columnName: "$Sesion Evaluación", alineacion: alignmentRight},
  {columnName: "Vigencia Desde", alineacion: alignmentLeft},
  {columnName: "vigencia Hasta", alineacion: alignmentLeft},
  {columnName: "Estado", alineacion: alignmentCenter},
  {columnName: "Editar", alineacion: alignmentCenter}
];

let tblHistorialImportes = null;
let cboCentroMedico = null;
let cboEstado = null;
let navPaginationHistorialImportes = null;
let dtFechaVigenciaDesde = null;
let dtFechavigenciaHasta = null;
let btnLimpiarFiltrosHistorialImporte = null;
let btnFiltrarHistorialImporte = null;
let btnNuevoHistorialImporte = null;

// =============================
// 🚀 Métodos de carga inicial
// ==============================

function inicializarObjetosDOM() {
  tblHistorialImportes = document.getElementById('tblHistorialImportes');
  cboCentroMedico = document.getElementById('cboCentroMedico');
  cboTipoDescuento = document.getElementById('cboTipoDescuento');
  cboEstado = document.getElementById('cboEstado');
  dtFechaVigenciaDesde = document.getElementById('fechaVigenciaDesde');
  dtFechavigenciaHasta = document.getElementById('fechaVigenciaHasta');
  navPaginationHistorialImportes = document.getElementById('paginationHistorialImportes');
  btnLimpiarFiltrosHistorialImporte = document.getElementById('btnLimpiarFiltrosHistorialImporte');
  btnFiltrarHistorialImporte = document.getElementById('btnFiltrarHistorialImporte');
  btnNuevoHistorialImporte = document.getElementById('btnNuevoHistorialImporte');
}

function inicializarEventos() {

  //Inicializar eventos de los botones
  btnLimpiarFiltrosHistorialImporte.addEventListener('click', () => limpiarFiltrosHistorialImporte());
  btnFiltrarHistorialImporte.addEventListener('click', () => filtrarHistorialImportes());
  btnNuevoHistorialImporte.addEventListener('click', () => {
    window.historialImportesAPI.openNuevoHistorialImporteModal();
  });
  document.getElementById('importes').addEventListener('refrescarImportes', (e) => {
    const { idCentroMedico } = e.detail;
    console.log('🔄 Recibido ID centro médico:', idCentroMedico);
  
    // Actualizar parámetros si querés
    window.parametrosImportes = { idCentroMedico };
  
    limpiarFiltrosHistorialImporte();
    leerParametros();
    cargarHistorialImportes(); // O cualquier función relevante
  });
  
}

async function cargarCentrosMedicosDesdeImportes(){
  try {
    const resultado = await window.viewModelAPI.getActiveCentroMedico(); 
    if (!resultado.ok) throw new ViewModelAPIError();
    
    const descripcionDefault = "Seleccione un Centro Médico";
    const centrosMedicos = resultado.data;
    cargarListaDesplegable(cboCentroMedico, centrosMedicos, descripcionDefault);  
  } catch (error) {
    manejarErrores(error, 'IMPORTES_CARGAR_CENTROS_MEDICOS');
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
    manejarErrores(error, 'IMPORTES_CARGAR_TIPOS_DESCUENTO');
  }
}

async function cargarEstados() {
  try {
    const resultado = await window.historialImportesAPI.getAllEstados(); 
    if (!resultado.ok) throw new ViewModelAPIError();
    
    const descripcionDefault = "Seleccione Estado";
    const estados = resultado.data;
    cargarListaDesplegable(cboEstado, estados, descripcionDefault);  
  } catch (error) {
    manejarErrores(error, 'IMPORTES_CARGAR_ESTADOS');
  }  
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
  }
}

// =========================
// 🛠️ Funciones utilitarias
// =========================

function formatearFechaDDMMYYYY(fecha) {
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

function crearColumnaEditarHistorialImporte(tr, historialImporte) {
  const tdEditar = document.createElement('td');
  tdEditar.classList.add('text-center'); 

  const editIcon = document.createElement('i');
  editIcon.id = 'editIcon';
  editIcon.className = 'fas fa-edit'; 
  //editIcon.classList.toggle('disabled-icon', centroMedico.estado !== 'Activo');
  editIcon.style.cursor = 'pointer'; 
  editIcon.title = 'Editar'; 
  /*editIcon.onclick = () => {
      window.viewModelAPI.openEditCentroMedicoModal(centroMedico.idCentroMedico); // Enviar el ID del centro médico al modal de edición
  };*/
  tdEditar.appendChild(editIcon);
  tr.appendChild(tdEditar);
}

function addHistorialImporteToTable(historialImporte, tbody, isNew=false) {
  const tr = document.createElement('tr');
  tr.setAttribute('data-id', historialImporte.idHistorialImporte); // Agregar un identificador único

  if (isNew) {
      animarNuevaFila(tr); // Aplicar la animación a la fila
  }

  // Uso:
  const fechaVigenciaDesde = new Date(historialImporte.vigenciaDesde);
  const fechaVigenciaHasta = new Date(historialImporte.vigenciaHasta);
  //console.log(formatearFechaDDMMYYYY(fecha)); // "21/04/2025"

  createTableData(historialImporte.centroMedico, tr, alignmentLeft);
  createTableData(historialImporte.tipoDescuento, tr, alignmentLeft);
  createTableData(historialImporte.valor, tr, alignmentRight);
  createTableData(historialImporte.importeSesionEvaluacion, tr, alignmentRight);
  createTableData(historialImporte.importeSesionTratamiento, tr, alignmentRight);
  createTableData(formatearFechaDDMMYYYY(fechaVigenciaDesde), tr, alignmentLeft);
  createTableData(formatearFechaDDMMYYYY(fechaVigenciaHasta), tr, alignmentLeft);
  createTableData(historialImporte.estado, tr, alignmentCenter);

  crearColumnaEditarHistorialImporte(tr, historialImporte);

  if (historialImporte.estado === 'Activo') {
      tr.classList.add('table-success');
  }

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

function RefreshPaginationImportes(currentPage, totalPages, action) {
  const paginationConfig = {
      idPaginationElement: navPaginationHistorialImportes,
      currentPage: currentPage,
      totalPages: totalPages,
      actionMethod: action,
      changePageCallback: changePageHistorialImporte
  }

  renderPagination(paginationConfig);
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

  const fechaVigenciaDesde = dtFechaVigenciaDesde.value;
  if (fechaVigenciaDesde) {
      filters.fechaVigenciaDesde = new Date(fechaVigenciaDesde);
  }

  const fechaVigenciaHasta = dtFechavigenciaHasta.value;
  if (fechaVigenciaHasta) {
      filters.fechaVigenciaHasta = new Date(fechaVigenciaHasta);
  }

  return filters;
}

function limpiarFiltrosHistorialImporte() {
  cboCentroMedico.value = "";
  cboEstado.value = "";
  cboTipoDescuento.value = "";
  dtFechaVigenciaDesde.value = "";
  dtFechavigenciaHasta.value = "";
  removeImportesTableContent();
  cleanPagination(navPaginationHistorialImportes);
}

function hayDatosParafiltrar() {  
  if  (cboCentroMedico.value || cboEstado.value || cboTipoDescuento.value || dtFechaVigenciaDesde.value || dtFechavigenciaHasta.value) {
      return true;
  }
  return false;
}

// =========================
// 🧠 Funciones principales
// =========================

async function cargarHistorialImportes(page = 1){
  try {
    let paginationData = {page: page, pageSize: pageSize};
    const filters = obtenerFiltrosImportes();
    const resultado = await window.historialImportesAPI.getPaginatedHistorialImportes(paginationData, filters); 
    if (!resultado.ok) throw new ViewModelAPIError();
    
    const result = resultado.data;
    const historialImportesData = result.data;

    updateImportesTableContent(historialImportesData);
    RefreshPaginationImportes(result.currentPage, result.totalPages, Actions.GETALL);
  } catch (error) {
    manejarErrores(error, 'IMPORTES_CARGAR__HISTORIAL_IMPORTES');
  }
}



async function filtrarHistorialImportes(page = 1) {
  try {
      if (!hayDatosParafiltrar()) {
          mostrarErrorUsuario("Debe ingresar al menos un filtro para realizar la búsqueda");
          return;
      }

      let paginationData = {page: page, pageSize: pageSize};
      const filters = obtenerFiltrosImportes();
      const resultado = await window.historialImportesAPI.getPaginatedHistorialImportes(paginationData, filters); 
      if (!resultado.ok) throw new ViewModelAPIError();
      
      const result = resultado.data;
      const historialImportesData = result.data;

      updateImportesTableContent(historialImportesData);
      RefreshPaginationImportes(result.currentPage, result.totalPages, Actions.FILTER);
  } catch (error) {
      manejarErrores(error, 'IMPORTES_FILTRAR__HISTORIAL_IMPORTES');
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