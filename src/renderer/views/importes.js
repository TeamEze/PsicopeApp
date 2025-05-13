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


function inicializarObjetosDOM() {
  tblHistorialImportes = document.getElementById('tblHistorialImportes');
  cboCentroMedico = document.getElementById('cboCentroMedico');
  cboTipoDescuento = document.getElementById('cboTipoDescuento');
}

function inicializarEventos() {
  //Inicializar eventos de los botones
}

async function cargarCentrosMedicos(){
  try {
    const resultado = await window.viewModelAPI.getActiveCentroMedico(); 
    if (!resultado.ok) throw new Error();
    
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
    if (!resultado.ok) throw new Error();
    
    const descripcionDefault = "Seleccione Tipo de Descuento";
    const tiposDescuento = resultado.data;
    cargarListaDesplegable(cboTipoDescuento, tiposDescuento, descripcionDefault);  
  } catch (error) {
    manejarErrores(error, 'IMPORTES_CARGAR_TIPOS_DESCUENTO');
  }
}

function cargarInicial(){
  inicializarObjetosDOM();
  inicializarEventos();
  addTableHeaders(tblHistorialImportes, listaColumnasGrillaHistorialImportes);
  cargarCentrosMedicos();
  cargarTiposDescuento();
}

cargarInicial();