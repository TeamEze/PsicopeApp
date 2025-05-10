import ViewModelAPIError from './errors.js';


const pageSize = 10; // Tamaño de página

let centroMedicoActual = null;
let trActual = null;
let switchInputActual = null;
let modal = null;

let txtNombre = null;
let cboLocalidad = null;
let btnNuevoCentroMedico = null;
let btnFiltrarCentroMedico = null;
let btnLimpiarCentroMedico = null;
let chkVerInactivos = null;
let btnConfirmarInactivacion = null;
let btnCancelarInactivacion = null;
let tblCentrosMedicos = null;

let listaColumnasGrillaCentrosMedicos = [{columnName:"Nombre", alineacion: alignmentLeft},
                                        {columnName:"Dirección", alineacion: alignmentLeft}, 
                                        {columnName: "Localidad", alineacion: alignmentLeft},
                                        {columnName: "Teléfono", alineacion: alignmentRight} , 
                                        {columnName: "Contacto", alineacion: alignmentLeft},
                                        {columnName: "Email", alineacion: alignmentLeft},
                                        {columnName: "Duración Sesión", alineacion: alignmentRight},
                                        {columnName: "Estado", alineacion: alignmentCenter},
                                        {columnName: "Editar", alineacion: alignmentCenter} ,
                                        {columnName: "Pacientes", alineacion: alignmentCenter} ,
                                        {columnName: "Historial", alineacion: alignmentCenter} ]
const Actions = Object.freeze({
    FILTER: "filter",
    GETALL: "getAll"
});

const Estados = Object.freeze({
    ACTIVO: 1,
    INACTIVO: 2
});

/* document.addEventListener('DOMContentLoaded', () => {
    const tabImportes = document.querySelector('a[href="#importes"]');
    const importesContainer = document.getElementById('importes');
  
    tabImportes.addEventListener('click', async () => {
        if (importesContainer.innerHTML.trim() !== '') return;
      
        try {
          const html = await window.viewModelAPI.readFile('importes.html');
          importesContainer.innerHTML = html;
      
          // Cargar el script importes.js
          const script = document.createElement('script');
          script.src = 'importes.js';
          document.body.appendChild(script);
        } catch (error) {
          console.error('Error al cargar el tab Importes:', error);
          alert('No se pudo cargar el contenido de Importes. Por favor, inténtelo de nuevo.');
        }
      });
  }); */

function cargaInicial() {
    
    inicializarObjetosDOM();
    inicializarEventos();
    addTableHeaders(tblCentrosMedicos, listaColumnasGrillaCentrosMedicos);
    cargarLocalidades();
    cargarHistorialImportes();
}

function inicializarObjetosDOM() {
    txtNombre = document.getElementById('txtName');
    cboLocalidad = document.getElementById('cboLocalidad');
    btnNuevoCentroMedico = document.getElementById('btnNuevoCentroMedico');
    btnFiltrarCentroMedico = document.getElementById('btnFiltrarCentroMedico');
    btnLimpiarCentroMedico = document.getElementById('btnLimpiarCentroMedico');
    chkVerInactivos = document.getElementById('chkVerInactivos');
    btnConfirmarInactivacion = document.getElementById('btnConfirmarInactivacion');
    btnCancelarInactivacion = document.getElementById('btnCancelarInactivacion');
    tblCentrosMedicos = document.getElementById('tblCentrosMedicos');
}

function inicializarEventos(){
    btnNuevoCentroMedico.addEventListener('click', () => {window.viewModelAPI.openNuevoCentroMedicoModal();});
    btnFiltrarCentroMedico.addEventListener('click', () => filtrarCentrosMedicos());
    btnLimpiarCentroMedico.addEventListener('click', () => limpiarCentrosMedicos());
    cboLocalidad.addEventListener('change', actualizarEstadoBotonBuscar);
    txtNombre.addEventListener('input', actualizarEstadoBotonBuscar);
    txtNombre.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            filtrarCentrosMedicos();
        }
    });
    chkVerInactivos.addEventListener('change', function () {
        filtrarCentrosMedicos();
    });
    btnConfirmarInactivacion.onclick = manejarConfirmacionInactivacion;
    btnCancelarInactivacion.onclick = () => {
        document.activeElement.blur();
        switchInputActual.checked = true;
    };
}

function cargarHistorialImportes() {
    //document.addEventListener('DOMContentLoaded', () => {
    const tabImportes = document.querySelector('a[href="#importes"]');
    const importesContainer = document.getElementById('importes');
  
    tabImportes.addEventListener('click', async () => {
        if (importesContainer.innerHTML.trim() !== '') return;
      
        try {
          const html = await window.viewModelAPI.readFile('importes.html');
          importesContainer.innerHTML = html;
      
          // Cargar el script importes.js
          const script = document.createElement('script');
          script.src = 'importes.js';
          document.body.appendChild(script);
        } catch (error) {
          console.error('Error al cargar el tab Importes:', error);
          alert('No se pudo cargar el contenido de Importes. Por favor, inténtelo de nuevo.');
        }
      });
}


async function cargarLocalidades() {
    try {
        cboLocalidad.innerHTML = '';
        // Agregar opción por defecto
        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = 'Seleccione Localidad';
        cboLocalidad.appendChild(optionDefault);

        const resultado = await window.viewModelAPI.getAllLocalidades(); 
        if (!resultado.ok) throw new ViewModelAPIError();
        
        const localidades = resultado.data;
        localidades.forEach(localidad => {
            const option = document.createElement('option');
            option.value = localidad.idLocalidad;
            option.textContent = localidad.descripcion;
            cboLocalidad.appendChild(option);
        });
    } catch (error) {
        if (error instanceof ViewModelAPIError) {
            console.error('Error en ViewModelAPI.getAllLocalidades:');
            mostrarErrorUsuario("Ocurrió un error al cargar las localidades. Por favor, inténtelo de nuevo más tarde.");
        }
        else {
            console.error('Error genérico al cargar localidades:', error);
            mostrarErrorUsuario('Error inesperado al cargar las localidades. Por favor, contacte al administrador.');
            loguearError(error, 'index.js - cargarLocalidades');
        }
    }
}

async function limpiarCentrosMedicos() {
    txtNombre.value = "";
    cboLocalidad.value = "";
    chkVerInactivos.checked = false;
    btnFiltrarCentroMedico.classList.add('disabled');
    cargarCentrosMedicos();
}

function incluirInactivosChecked() {
    return document.getElementById('chkVerInactivos').checked;
}

//Función para filtrar centros médicos
async function filtrarCentrosMedicos(pageFilter = 1) {
    try {
        let paginationData = {page: pageFilter, pageSize:pageSize};
        let filters = obtenerFiltros();      
        const resultado = await window.viewModelAPI.getPaginatedFilteredCentrosMedicos(filters, paginationData);
        if (!resultado.ok) throw new ViewModelAPIError();

        const result = resultado.data;
        let totalPages = result.totalPages;
        let currentPage = result.currentPage;
        const centrosMedicosData = result.data;
        
        updateTableContent(centrosMedicosData);
        renderPagination(currentPage, totalPages, Actions.FILTER);
    } catch (error) {
        if (error instanceof ViewModelAPIError) {
            console.error('Error en ViewModelAPI.getPaginatedFilteredCentrosMedicos:');
            mostrarErrorUsuario("Ocurrió un error al filtrar los centros médicos. Por favor, contacte al administrador.");
        }
        else {
            console.error('Error genérico al filtrar centros médicos', error);
            mostrarErrorUsuario('Error inesperado al filtrar los centros médicos. Por favor, contacte al administrador.');
            loguearError(error, 'index.js - filtrarCentrosMedicos');
        }
    }
    
}

function obtenerFiltros(){
    let filters = {};
    const nombre = txtNombre.value;
    if (nombre) {
        filters.nombre = nombre;
    }
    
    const idLocalidad = cboLocalidad.value;
    if (idLocalidad) {
        filters.idLocalidad = idLocalidad;
    }

    const incluirInactivos = chkVerInactivos.checked;
    filters.incluirInactivos = incluirInactivos;
    return filters;
}

//Deshabilitar el boton buscar
function actualizarEstadoBotonBuscar() {
    const tieneNombre = txtNombre.value.trim() !== '';
    const tieneLocalidad = cboLocalidad.value.trim() !== '';

    if (tieneNombre || tieneLocalidad) {
        btnFiltrarCentroMedico.disabled = false;
        btnFiltrarCentroMedico.classList.remove('disabled');
    } else {
        btnFiltrarCentroMedico.disabled = true;
        btnFiltrarCentroMedico.classList.add('disabled');
    }
}

async function crearCentroMedico(nuevoCentroMedico) {

    try {
        const resultado = await window.viewModelAPI.createCentroMedico(nuevoCentroMedico);
        if (!resultado.ok) throw new ViewModelAPIError();
        
        const centroMedicoCreado = resultado.data;

        const tbody = tblCentrosMedicos.querySelector('tbody') || document.createElement('tbody');
    
        // Verificar si el nuevo registro pertenece a la página actual
        const currentPage = parseInt(document.querySelector('.pagination .active a')?.textContent || 1, 10);
        const registrosEnPaginaActual = tbody.children.length;
        const isOnCurrentPage = registrosEnPaginaActual < pageSize;
    
        if (isOnCurrentPage) {
            addCentroMedicoToTable(centroMedicoCreado, tbody, true);
            if (!tblCentrosMedicos.contains(tbody)) {
                tblCentrosMedicos.appendChild(tbody);
            }
        } else {
            // Si no pertenece a la página actual, recargar la paginación
            const paginationData = { page: currentPage, pageSize: pageSize };
            if (existenfiltrosActivos()) {
                const resultado = await window.viewModelAPI.getPaginatedFilteredCentrosMedicos(obtenerFiltros(), paginationData);
                if (!resultado.ok) throw new ViewModelAPIError();
                const result = resultado.data;
                const totalPages = result.totalPages;
                renderPagination(currentPage, totalPages, Actions.FILTER); 
            }
            else{
                const resultado = await window.viewModelAPI.getPaginatedActiveCentrosMedicos(paginationData);
                if (!resultado.ok) throw new ViewModelAPIError();
                const result = resultado.data;
                const totalPages = result.totalPages;
                renderPagination(currentPage, totalPages, Actions.GETALL);         
            }
        }
    } catch (error) {
        if (error instanceof ViewModelAPIError) {
            console.error('Error en ViewModelAPI.createCentroMedico:');
            mostrarErrorUsuario("Ocurrió un error al crear el centro médico. Por favor, contacte al administrador.");
        }
        else {
            console.error('Error genérico al crear el centro médico', error);
            mostrarErrorUsuario('Error inesperado al crear centro médico. Por favor, contacte al administrador.');
            loguearError(error, 'index.js - crearCentroMedico');
        }
    } 

   
    
}

function existenfiltrosActivos() {
    let filtros = obtenerFiltros();
    if ('nombre' in filtros || 'idLocalidad' in filtros || filtros.incluirInactivos) {
        return true;
    }
    return false;
}

// Función para cargar los centros médicos
async function cargarCentrosMedicos(page = 1) {
    try {
        let paginationData = {page:page, pageSize:pageSize};
        //throw new Error('Prueba');
        const resultado = await window.viewModelAPI.getPaginatedActiveCentrosMedicos(paginationData);
        if (!resultado.ok) throw new ViewModelAPIError();

        const result = resultado.data;
        let totalPages = result.totalPages;
        let currentPage = result.currentPage;
        const centrosMedicosData = result.data;
        
        updateTableContent(centrosMedicosData);

        const paginationConfig = {
            currentPage: currentPage,
            totalPages: totalPages,
            actionMethod: Actions.GETALL,
            changePageCallback: changePage
        }

        renderPagination(paginationConfig);
    } catch (error) {
        if (error instanceof ViewModelAPIError) {
            console.error('Error en ViewModelAPI.getPaginatedActiveCentrosMedicos:');
            mostrarErrorUsuario("Ocurrió un error al cargar los centros médicos. Por favor, contacte al administrador.");
        }
        else {
            console.error('Error genérico al cargar centros médicos', error);
            mostrarErrorUsuario('Error inesperado al cargar centros médicos. Por favor, contacte al administrador.');
            loguearError(error, 'index.js - cargarCentrosMedicos');
        }
    }
    
}

// Escuchar el evento para agregar un nuevo centro médico a la grilla
window.viewModelAPI.onNuevoCentroMedico((event, nuevoCentroMedico) => {
    crearCentroMedico(nuevoCentroMedico);
});

window.viewModelAPI.onCentroMedicoEdited((event, centroMedicoEdited) => {
    const row = document.querySelector(`tr[data-id='${centroMedicoEdited.idCentroMedico}']`);
        if (row) {
            animarFilaEditada(row);
            const cells = row.children;
            cells[0].textContent = centroMedicoEdited.nombre;
            cells[1].textContent = centroMedicoEdited.direccion;
            cells[2].textContent = centroMedicoEdited.localidad;
            cells[3].textContent = centroMedicoEdited.telefono;
            cells[4].textContent = centroMedicoEdited.personaContacto;
            cells[5].textContent = centroMedicoEdited.email;
            cells[6].textContent = centroMedicoEdited.duracionSesion;
        }
})

window.viewModelAPI.onMostrarErrorGenerico((event, mensaje) => {
    mostrarErrorUsuario(mensaje);
})

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

// Función para actualizar la tabla con un centro médico
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

function animarNuevaFila(tr) {   
    tr.classList.add("table-success", "highlight");

    // Esperar que termine la animación para remover las clases
    tr.addEventListener("animationend", function handleAnimationEnd(e) {
        // Solo actuar cuando termine la animación 'fadeOut'
        if (e.animationName === "fadeOut") {
        tr.classList.remove("highlight", "table-success");
        tr.removeEventListener("animationend", handleAnimationEnd); // limpiar listener
        }
    });
}

function animarFilaEditada(tr) {   
    tr.classList.add("table-primary", "highlight");

  // Esperar que termine la animación para remover las clases
  tr.addEventListener("animationend", function handleAnimationEnd(e) {
    // Solo actuar cuando termine la animación 'fadeOut'
    if (e.animationName === "fadeOut") {
      tr.classList.remove("highlight", "table-primary");
      tr.removeEventListener("animationend", handleAnimationEnd); // limpiar listener
    }
  });
}

function crearColumnaEstado(tr, centroMedico) {
     // Agregar columna de switch (activar/inactivar)
     const tdSwitch = document.createElement('td');
     tdSwitch.classList.add('text-center');
 
     const divSwitch = document.createElement('div');
     divSwitch.classList.add('form-check', 'form-switch', 'd-flex', 'justify-content-center', 'align-items-center');
     
     const switchInput = document.createElement('input');
     switchInput.type = 'checkbox';
     switchInput.checked = centroMedico.estado === 'Activo'; // Activo si `idEstado` es 1
     switchInput.title = centroMedico.estado === 'Activo' ? 'Inactivar' : 'Activar';
     tr.classList.toggle('table-secondary', centroMedico.estado !== 'Activo'); // Cambiar estilo si está inactivo
     switchInput.classList.add('form-check-input');

     switchInput.addEventListener('change', async () => {
        const nuevoEstado = switchInput.checked ? Estados.ACTIVO : Estados.INACTIVO; // 1 = Activo, 2 = Inactivo
        // Guardar el contexto para usar después en la confirmación
        centroMedicoActual = centroMedico;
        trActual = tr;
        switchInputActual = switchInput;
        if  (nuevoEstado === Estados.INACTIVO) {
            abrirModalInactivarCentroMedico(centroMedico.nombre);
        }
        else {
            reactivarCentroMedico();
        }
     });
 
     divSwitch.appendChild(switchInput);
     tdSwitch.appendChild(divSwitch);
     tr.appendChild(tdSwitch);
 
}

async function reactivarCentroMedico() {
    try {
        const resultado = await window.viewModelAPI.updateEstadoCentroMedico(centroMedicoActual.idCentroMedico, Estados.ACTIVO);
        if(!resultado.ok) throw new ViewModelAPIError();
        switchInputActual.title = 'Inactivar';
        trActual.classList.remove('table-secondary');
        trActual.querySelector("#editIcon").classList.remove('disabled-icon');
        toggleIconLink(trActual.querySelector("#lnkPacientes"), "Ver pacientes", false);
        toggleIconLink(trActual.querySelector("#lnkHistorial"), "Ver historial importes", false);
    } catch (error) {
        if (error instanceof ViewModelAPIError) {
            console.error('Error en ViewModelAPI.updateEstadoCentroMedico:');
            mostrarErrorUsuario("Ocurrió un error al reactivar el centro médico. Por favor, contacte al administrador.");
        }
        else {
            console.error('Error genérico al reactivar el centro médico', error);
            mostrarErrorUsuario("Error inesperado al reactivar el centro médico. Por favor, contacte al administrador.");
            loguearError(error, 'index.js - reactivarCentroMedico');
        }
    }
    
}

async function manejarConfirmacionInactivacion() {
    try {
        const nuevoEstado = 2;

        modal.hide();
        document.activeElement.blur();

        const resultado = await window.viewModelAPI.updateEstadoCentroMedico(centroMedicoActual.idCentroMedico, nuevoEstado);
        if(!resultado.ok) throw new ViewModelAPIError();

        //Agregar validación para verificar si el centro médico fue inactivado correctamente
        switchInputActual.title = 'Activar';

        if (!incluirInactivosChecked()) {
            trActual.classList.add('fade-out-row');
            setTimeout(() => trActual.remove(), 800);
        } else {
            trActual.classList.add('table-secondary');
            trActual.querySelector("#editIcon").classList.add('disabled-icon');
            toggleIconLink(trActual.querySelector("#lnkPacientes"), "Ver pacientes", true);
            toggleIconLink(trActual.querySelector("#lnkHistorial"), "Ver historial importes", true);
        }
    } catch (error) {
        if (error instanceof ViewModelAPIError) {
            console.error('Error en ViewModelAPI.updateEstadoCentroMedico:');
            mostrarErrorUsuario("Ocurrió un error al inactivar el centro médico. Por favor, contacte al administrador.");
        }
        else {
            console.error('Error genérico al inactivar el centro médico', error);
            mostrarErrorUsuario("Error inesperado al inactivar el centro médico. Por favor, contacte al administrador.");
            loguearError(error, 'index.js - manejarConfirmacionInactivacion');
        }
    }
    
}

function abrirModalInactivarCentroMedico(nombreCentroMedico) {
    const modalInactivar = document.getElementById("confirmarInactivacionModal");
    const body = modalInactivar.querySelector(".modal-body");
    body.innerHTML = `Esta acción cambiará el estado del centro médico <strong>${nombreCentroMedico}</strong> a inactivo`;
        // Mostrar el modal
        modal = new bootstrap.Modal(modalInactivar, {
            backdrop: 'static',
            keyboard: false
        });
    modal.show();
}

function crearColumnaEditar(tr, centroMedico) {
    const tdEditar = document.createElement('td');
    tdEditar.classList.add('text-center'); 

    const editIcon = document.createElement('i');
    editIcon.id = 'editIcon';
    editIcon.className = 'fas fa-edit'; 
    editIcon.classList.toggle('disabled-icon', centroMedico.estado !== 'Activo');
    editIcon.style.cursor = 'pointer'; 
    editIcon.title = 'Editar'; 
    editIcon.onclick = () => {
        window.viewModelAPI.openEditCentroMedicoModal(centroMedico.idCentroMedico); // Enviar el ID del centro médico al modal de edición
    };
    tdEditar.appendChild(editIcon);
    tr.appendChild(tdEditar);
}

function crearColumnaPacientes(tr, centroMedico) {  
    // Pacientes
    const tdPacientes = document.createElement('td');
    tdPacientes.classList.add('text-center');
    const lnkPacientes = document.createElement('a');
    lnkPacientes.id = 'lnkPacientes';
    //lnkPacientes.href = "#";
    lnkPacientes.onclick = async () => {
        // 1. Guardar el ID globalmente para que importes.js lo lea
        window.parametrosImportes = { idCentroMedico: centroMedico.idCentroMedico };
        //if (importesContainer.innerHTML.trim() !== '') return;
        // 2. Leer e insertar importes.html en el contenedor
        const html = await window.viewModelAPI.readFile('importes.html');
        document.getElementById('importes').innerHTML = html;
      
        // 3. Cargar el script asociado
        const script = document.createElement('script');
        script.src = 'importes.js';
        script.onload = () => console.log('importes.js cargado');
        script.onerror = () => console.error('Error al cargar importes.js');
        document.body.appendChild(script);
      
        // 4. Cambiar a la pestaña "Importes"
        document.querySelector('a[href="#importes"]').click();
      };
      
    //linkPacientes.className = 'btn btn-outline-primary btn-sm';
    lnkPacientes.style.cssText = 'text-decoration: none;'; // Cambiar el cursor al pasar sobre el ícono
    lnkPacientes.title = 'Ver pacientes'; // Tooltip al pasar el mouse
    lnkPacientes.textContent = "🧑‍⚕️";
    toggleIconLink(lnkPacientes, "Ver pacientes", centroMedico.estado !== 'Activo');

    tdPacientes.appendChild(lnkPacientes);
    tr.appendChild(tdPacientes);
}

function crearColumnaHistorial(tr, centroMedico) {
    // Pacientes
    const tdHistorial = document.createElement('td');
    tdHistorial.classList.add('text-center');
    const lnkHistorial = document.createElement('a');
    lnkHistorial.id = 'lnkHistorial';
    lnkHistorial.href = "#";
    lnkHistorial.style.cssText = 'text-decoration: none;'; // Cambiar el cursor al pasar sobre el ícono
    lnkHistorial.title = 'Ver historial importes'; // Tooltip al pasar el mouse
    lnkHistorial.textContent = "🕒";
    toggleIconLink(lnkHistorial, "Ver historial importes", centroMedico.estado !== 'Activo');
    tdHistorial.appendChild(lnkHistorial);
    tr.appendChild(tdHistorial);
}

function toggleIconLink(iconLink, title, disabled)
{
    if (!disabled) {
        iconLink.classList.remove("disabled");
        iconLink.style.pointerEvents = "auto";
        iconLink.style.opacity = "1";
        iconLink.title = title;
    } else {
        iconLink.classList.add("disabled");
        iconLink.style.pointerEvents = "none";
        iconLink.style.opacity = "0.5";
        iconLink.title = title;
    }
}

function changePage(page, totalPages, actionMethod) {
    if (page >= 1 && page <= totalPages) {
        // Determinar qué método ejecutar según el nombre
        if (actionMethod === Actions.FILTER) {
            filtrarCentrosMedicos(page);
        } else if (actionMethod === Actions.GETALL) {
            cargarCentrosMedicos(page);
        }
    }
}

cargaInicial();
cargarCentrosMedicos();