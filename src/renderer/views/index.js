// =========================
// 🔧 Setup inicial
// =========================
const pageSize = 10;

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
let navPagination = null;
let fitrosCentrosMedicos = null;

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

// =============================
// 🚀 Métodos de carga inicial
// ==============================

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
    navPagination = document.getElementById('paginationCentrosMedicos');
    fitrosCentrosMedicos = [txtNombre, cboLocalidad];
}

function inicializarEventos(){
    btnNuevoCentroMedico.addEventListener('click', () => {window.viewModelAPI.openNuevoCentroMedicoModal();});
    btnFiltrarCentroMedico.addEventListener('click', () => filtrarCentrosMedicos());
    btnLimpiarCentroMedico.addEventListener('click', () => limpiarFiltrosCentrosMedicos());
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
    fitrosCentrosMedicos.forEach(filtro => {
        filtro.addEventListener('change', () => resaltarFiltroSiActivo(filtro));
    });
}

async function cargarLocalidades() {
    try {
        const resultado = await window.viewModelAPI.getAllLocalidades(); 
        if (!resultado.ok) throw new ViewModelAPIError();

        const descripcionDefault = "Seleccione Localidad";
        const localidades = resultado.data;
        cargarListaDesplegable(cboLocalidad, localidades, descripcionDefault);          
    } catch (error) {
        manejarErrores(error, 'INDEX_CARGAR_LOCALIDADES');
    }
}

function cargarHistorialImportes() {
    const tabImportes = document.querySelector('a[href="#importes"]');
    const importesContainer = document.getElementById('importes');
  
    tabImportes.addEventListener('click', async () => {
        if (importesContainer.innerHTML.trim() !== '') return;
      
        try {
            window.parametrosImportes = { idEstado: 1};
            const html = await window.viewModelAPI.readFile('importes.html');
            importesContainer.innerHTML = html;
            importesContainer.setAttribute('data-loaded', 'true');
        
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

function cargaInicial() {
    
    inicializarObjetosDOM();
    inicializarEventos();
    addTableHeaders(tblCentrosMedicos, listaColumnasGrillaCentrosMedicos);
    cargarLocalidades();
    cargarHistorialImportes();
}

// =========================
// 🛠️ Funciones utilitarias
// =========================

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

function removerFiltroActivosCentroMedico() { 
    fitrosCentrosMedicos.forEach(filtro => {
        if (filtro.classList.contains('filtro-activo')) {
            filtro.classList.remove('filtro-activo');
        }
    });
  }

async function limpiarFiltrosCentrosMedicos() {
    txtNombre.value = "";
    cboLocalidad.value = "";
    chkVerInactivos.checked = false;
    btnFiltrarCentroMedico.classList.add('disabled');
    removerFiltroActivosCentroMedico();
    cargarCentrosMedicos();
}

function incluirInactivosChecked() {
    return document.getElementById('chkVerInactivos').checked;
}

function RefreshPagination(currentPage, totalPages, action) {
    const paginationConfig = {
        idPaginationElement: navPagination,
        currentPage: currentPage,
        totalPages: totalPages,
        actionMethod: action,
        changePageCallback: changePage
    }

    renderPagination(paginationConfig);
}

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

function existenfiltrosActivos() {
    let filtros = obtenerFiltros();
    if ('nombre' in filtros || 'idLocalidad' in filtros || filtros.incluirInactivos) {
        return true;
    }
    return false;
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

function centroMedicoCrearColumnaEstado(tr, centroMedico) {
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
    lnkPacientes.href = "#";
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
    lnkHistorial.onclick = async () => {
    const importesContainer = document.getElementById('importes');
    const idCentroMedico = centroMedico.idCentroMedico;
    
    // Ya está cargado, solo actualizo los parámetros y emito un evento
    if (importesContainer.getAttribute('data-loaded') === 'true') {
        window.parametrosImportes = { idCentroMedico };
    
        // 🔔 Emitir evento personalizado para que el tab reaccione
        const event = new CustomEvent('refrescarImportes', { detail: { idCentroMedico } });
        importesContainer.dispatchEvent(event);
    
        document.querySelector('a[href="#importes"]').click();
        return;
    }
    
    try {
        // Guardar parámetro
        window.parametrosImportes = { idCentroMedico: idCentroMedico };
    
        // Leer e insertar el HTML
        const html = await window.viewModelAPI.readFile('importes.html');
        importesContainer.innerHTML = html;
        importesContainer.setAttribute('data-loaded', 'true');
    
        // Cargar el JS si no está
        if (!document.querySelector('script[src="importes.js"]')) {
        const script = document.createElement('script');
        script.src = 'importes.js';
        script.onload = () => console.log('importes.js cargado');
        script.onerror = () => console.error('Error al cargar importes.js');
        document.body.appendChild(script);
        }
    
        // Cambiar al tab
        document.querySelector('a[href="#importes"]').click();
    } catch (error) {
        console.error('Error al cargar importes:', error);
    }
    };
      
    lnkHistorial.style.cssText = 'text-decoration: none;'; // Cambiar el cursor al pasar sobre el ícono
    lnkHistorial.title = 'Ver historial importes'; // Tooltip al pasar el mouse
    lnkHistorial.textContent = "🕒";
    toggleIconLink(lnkHistorial, "Ver historial importes", centroMedico.estado !== 'Activo');
    tdHistorial.appendChild(lnkHistorial);
    tr.appendChild(tdHistorial);
}

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

    centroMedicoCrearColumnaEstado(tr, centroMedico);
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

// =========================
// 🧩 Manejo de Eventos
// =========================

window.viewModelAPI.onNuevoCentroMedico((event, nuevoCentroMedico) => {
    crearCentroMedico(nuevoCentroMedico);
});

window.viewModelAPI.onCentroMedicoEdited((event, centroMedicoEdited) => {
    const row = document.querySelector(`#tblCentrosMedicos tr[data-id='${centroMedicoEdited.idCentroMedico}']`);
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
    mostrarErrorUsuario("Centro médico " + centroMedicoEdited.nombre +  " actualizado correctamente", "info");

})

window.viewModelAPI.onMostrarErrorGenerico((event, mensaje) => {
    mostrarErrorUsuario(mensaje);
})

window.electronAPI.showOverlay(() => {
    document.getElementById('modal-overlay').style.display = 'block';
});
  
window.electronAPI.hideOverlay(() => {
    document.getElementById('modal-overlay').style.display = 'none';
});

// =========================
// 🧠 Funciones principales
// =========================

async function cargarCentrosMedicos(page = 1) {
    try {
        let paginationData = {page:page, pageSize:pageSize};
        const resultado = await window.viewModelAPI.getPaginatedActiveCentrosMedicos(paginationData);
        if (!resultado.ok) throw new ViewModelAPIError();

        const result = resultado.data;
        const centrosMedicosData = result.data;
        
        this.updateTableContent(centrosMedicosData);
        RefreshPagination(result.currentPage, result.totalPages, Actions.GETALL);

    } catch (error) {
        manejarErrores(error, 'INDEX_CARGAR_CENTROS_MEDICOS');
    }
}

async function filtrarCentrosMedicos(pageFilter = 1) {
    try {
        let paginationData = {page: pageFilter, pageSize:pageSize};
        let filters = obtenerFiltros();      
        const resultado = await window.viewModelAPI.getPaginatedFilteredCentrosMedicos(filters, paginationData);
        if (!resultado.ok) throw new ViewModelAPIError();

        const result = resultado.data;
        const centrosMedicosData = result.data;
        
        updateTableContent(centrosMedicosData);
        RefreshPagination(result.currentPage, result.totalPages, Actions.FILTER);

    } catch (error) {
        manejarErrores(error, 'INDEX_FILTRAR_CENTROS_MEDICOS');
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
                RefreshPagination(currentPage, result.totalPages, Actions.FILTER);
            }
            else{
                const resultado = await window.viewModelAPI.getPaginatedActiveCentrosMedicos(paginationData);
                if (!resultado.ok) throw new ViewModelAPIError();
                const result = resultado.data;
                RefreshPagination(currentPage, result.totalPages, Actions.GETALL);         
            }
        }
        mostrarErrorUsuario("Centro médico " + centroMedicoCreado.nombre +  " creado correctamente", "info");

    } catch (error) {
        manejarErrores(error, 'INDEX_CREAR_CENTRO_MEDICO');
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
        manejarErrores(error, 'INDEX_INACTIVAR_CENTRO_MEDICO');
    }  
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
        manejarErrores(error, 'INDEX_REACTIVAR_CENTRO_MEDICO');
    }
}

// =========================
// 🚀 Inicio 
// =========================
cargaInicial();
cargarCentrosMedicos();