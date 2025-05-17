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

// =============================
// 🚀 Métodos de carga inicial
// ==============================

function inicializarObjetosDOM() {
  tblHistorialImportes = document.getElementById('tblHistorialImportes');
  cboCentroMedico = document.getElementById('cboCentroMedico');
  cboTipoDescuento = document.getElementById('cboTipoDescuento');
  cboEstado = document.getElementById('cboEstado');
}

function inicializarEventos() {
  //Inicializar eventos de los botones
}

async function cargarCentrosMedicos(){
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

// =========================
// 🛠️ Funciones utilitarias
// =========================
function addCentroMedicoToTable(centroMedico, tbody, isNew=false) {
  const tr = document.createElement('tr');
  tr.setAttribute('data-id', centroMedico.idCentroMedico); // Agregar un identificador único

  if (isNew) {
      animarNuevaFila(tr); // Aplicar la animación a la fila
  }
  
  createTableData(centroMedico.nombre, tr, alignmentLeft);
  createTableData(centroMedico.direccion, tr, alignmentLeft);
  createTableData(centroMedico.localidad, tr, alignmentLeft);
  createTableData(centroMedico.telefono, tr, alignmentRight);
  createTableData(centroMedico.personaContacto, tr, alignmentLeft);
  createTableData(centroMedico.email, tr, alignmentLeft);
  createTableData(centroMedico.duracionSesion, tr, alignmentRight);

  crearColumnaEstado(tr, centroMedico);
  crearColumnaEditar(tr, centroMedico);
  crearColumnaPacientes(tr, centroMedico);
  crearColumnaHistorial(tr, centroMedico);

  tbody.appendChild(tr);
}  

function updateTableContent(centrosMedicosData) {
  if (tblCentrosMedicos.querySelector('tbody')) {
      tblCentrosMedicos.removeChild(tblCentrosMedicos.querySelector('tbody'));
  }
  const tbody = document.createElement('tbody');
  centrosMedicosData.forEach(centroMedico => {
      addCentroMedicoToTable(centroMedico, tbody);
  });
  tblCentrosMedicos.appendChild(tbody);
}


// =========================
// 🧠 Funciones principales
// =========================

async function cargarHistorialImportes(page = 1){
  try {
    let paginationData = {page: page, pageSize: pageSize};
    const resultado = await window.historialImportesAPI.getPaginatedHistorialImportes(paginationData); 
    if (!resultado.ok) throw new ViewModelAPIError();
    
    const historialImportes = resultado.data;
    cargarGrilla(tblHistorialImportes, historialImportes, listaColumnasGrillaHistorialImportes);
  } catch (error) {
    manejarErrores(error, 'IMPORTES_CARGAR_GRILLA_HISTORIAL_IMPORTES');
  }
}

function cargarInicial(){
  inicializarObjetosDOM();
  inicializarEventos();
  addTableHeaders(tblHistorialImportes, listaColumnasGrillaHistorialImportes);
  cargarCentrosMedicos();
  cargarTiposDescuento();
  cargarEstados();
  /* cargarHistorialImportes(); */
}

cargarInicial();