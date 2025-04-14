const alignmentLeft = "text-start";
const alignmentCenter = "text-center";
const alignmentRight = "text-end";
const pageSize = 10; // Tamaño de página
let centroMedicoActual = null;
let trActual = null;
let switchInputActual = null;
let modal = null;

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

const localidades = [
    { id: 1, nombre: 'Castelar' },
    { id: 2, nombre: 'Morón' },
    { id: 3, nombre: 'Haedo' },
    { id: 4, nombre: 'El Palomar' },
    { id: 5, nombre: 'Ramos Mejia' },
    { id: 6, nombre: 'San Justo' },
    { id: 7, nombre: 'Rafael Castillo' },
  ];



function CargaInicial() {
    
    //Crear Cabecera de tabla
    const idGrilla = document.getElementById('tblCentrosMedicos');
    AddTableHeaders(idGrilla, listaColumnasGrillaCentrosMedicos);
    InicializarEventos()
    cargarLocalidades();
}

function InicializarEventos(){
    const txtNombre = document.getElementById('txtName');
    const cboLocalidad = document.getElementById('cboLocalidad');
    // Inicializar eventos
    document.getElementById('btnNuevoCentroMedico').addEventListener('click', () => {
        window.viewModelAPI.openNuevoCentroMedicoModal();
      });
    document.getElementById('btnFiltrarCentroMedico').addEventListener('click', () => FiltrarCentrosMedicos());
    document.getElementById('btnLimpiarCentroMedico').addEventListener('click', () => LimpiarCentrosMedicos());
    
    cboLocalidad.addEventListener('change', actualizarEstadoBotonBuscar);
    txtNombre.addEventListener('input', actualizarEstadoBotonBuscar);
    txtNombre.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            // Aquí puedes poner la acción que quieras
            FiltrarCentrosMedicos()
        }
    });

    const checkbox = document.getElementById('chkVerInactivos');
    checkbox.addEventListener('change', function () {
        FiltrarCentrosMedicos();
    });

    document.getElementById('btnConfirmarInactivacion').onclick = manejarConfirmacionInactivacion;

    document.getElementById('btnCancelarInactivacion').onclick = () => {
        document.activeElement.blur();
        switchInputActual.checked = true;
    };
}

function cargarLocalidades() {
    const selectLocalidad = document.getElementById('cboLocalidad');
  
    // Limpiar el select (por si ya tiene elementos)
    selectLocalidad.innerHTML = '';
  
    // Agregar opción por defecto
    const optionDefault = document.createElement('option');
    optionDefault.value = '';
    optionDefault.textContent = 'Seleccione Localidad';
    selectLocalidad.appendChild(optionDefault);
  
    // Agregar las localidades simuladas
    localidades.forEach(loc => {
      const option = document.createElement('option');
      option.value = loc.id;
      option.textContent = loc.nombre;
      selectLocalidad.appendChild(option);
    });
  }

async function LimpiarCentrosMedicos() {
    document.getElementById('txtName').value = "";
    document.getElementById('cboLocalidad').value = "";
    document.getElementById('chkVerInactivos').checked = false;
    document.getElementById('btnFiltrarCentroMedico').classList.add('btn-disabled');
    CargarCentrosMedicos();
}

function IncluirInactivosChecked() {
    return document.getElementById('chkVerInactivos').checked;
}

//Función para filtrar centros médicos
async function FiltrarCentrosMedicos(pageFilter = 1) {
    let paginationData = {page: pageFilter, pageSize:pageSize};
    let filters = ObtenerFiltros();    

    const result = await window.viewModelAPI.getPaginatedFilteredCentrosMedicos(filters, paginationData);
    
    let totalPages = result.totalPages;
    let currentPage = result.currentPage;
    const centrosMedicosData = result.data;
    
    UpdateTableContent(centrosMedicosData);
    renderPagination(currentPage, totalPages, Actions.FILTER);
}

function ObtenerFiltros(){
    let filters = {};
    const nombre = document.getElementById('txtName').value;
    if (nombre) {
        filters.nombre = nombre;
    }
    
    const idLocalidad = document.getElementById('cboLocalidad').value;
    if (idLocalidad) {
        filters.idLocalidad = idLocalidad;
    }

    const incluirInactivos = document.getElementById('chkVerInactivos').checked;
    filters.incluirInactivos = incluirInactivos;
    return filters;
}

//Deshabilitar el boton buscar
function actualizarEstadoBotonBuscar() {
    const inputNombre = document.getElementById('txtName');
    const selectLocalidad = document.getElementById('cboLocalidad');
    const btnBuscar = document.getElementById('btnFiltrarCentroMedico');

    const tieneNombre = inputNombre.value.trim() !== '';
    const tieneLocalidad = selectLocalidad.value.trim() !== '';

    if (tieneNombre || tieneLocalidad) {
        btnBuscar.disabled = false;
        btnBuscar.classList.remove('btn-disabled');
    } else {
        btnBuscar.disabled = true;
        btnBuscar.classList.add('btn-disabled');
    }
}

// Función para crear un centro médico
async function CrearCentroMedico(nuevoCentroMedico) {
    // Llamar al ViewModel para crear el centro médico
    const centroMedicoCreado = await window.viewModelAPI.createCentroMedico(nuevoCentroMedico);

    // Obtener la tabla y el cuerpo de la tabla
    const tablaCentrosMedicos = document.getElementById('tblCentrosMedicos');
    const tbody = tablaCentrosMedicos.querySelector('tbody') || document.createElement('tbody');

    // Verificar si el nuevo registro pertenece a la página actual
    const currentPage = parseInt(document.querySelector('.pagination .active a')?.textContent || 1, 10);
    const registrosEnPaginaActual = tbody.children.length;
    const isOnCurrentPage = registrosEnPaginaActual < pageSize;

    if (isOnCurrentPage) {
        // Agregar el nuevo registro a la tabla y resaltarlo
        AddCentroMedicoToTable(centroMedicoCreado, tbody, true);
        if (!tablaCentrosMedicos.contains(tbody)) {
            tablaCentrosMedicos.appendChild(tbody);
        }
    } else {
        // Si no pertenece a la página actual, recargar la paginación
        const paginationData = { page: currentPage, pageSize: pageSize };
        const result = await window.viewModelAPI.getPaginatedActiveCentrosMedicos(paginationData);
        const totalPages = result.totalPages;
        renderPagination(currentPage, totalPages, Actions.GETALL);
    }
    
}

// Función para cargar los centros médicos
async function CargarCentrosMedicos(page = 1) {
    //const centrosMedicos = await window.viewModelAPI.getCentrosMedicos();
    let paginationData = {page:page, pageSize:pageSize};
    const result = await window.viewModelAPI.getPaginatedActiveCentrosMedicos(paginationData);
    //console.log(result);

    let totalPages = result.totalPages;
    let currentPage = result.currentPage;
    const centrosMedicosData = result.data;
    
    UpdateTableContent(centrosMedicosData);
    renderPagination(currentPage, totalPages, Actions.GETALL);
}

// Escuchar el evento para agregar un nuevo centro médico a la grilla
window.viewModelAPI.onNuevoCentroMedico((event, nuevoCentroMedico) => {
    CrearCentroMedico(nuevoCentroMedico);
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

function UpdateTableContent(centrosMedicosData) {
    const tablaCentrosMedicos = document.getElementById('tblCentrosMedicos');
    if (tablaCentrosMedicos.querySelector('tbody')) {
        tablaCentrosMedicos.removeChild(tablaCentrosMedicos.querySelector('tbody'));
    }
    const tbody = document.createElement('tbody');
    centrosMedicosData.forEach(centroMedico => {
        AddCentroMedicoToTable(centroMedico, tbody);
    });
    tablaCentrosMedicos.appendChild(tbody);
}

// Función para actualizar la tabla con un centro médico
function AddCentroMedicoToTable(centroMedico, tbody, isNew=false) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', centroMedico.idCentroMedico); // Agregar un identificador único

    if (isNew) {
        animarNuevaFila(tr); // Aplicar la animación a la fila
    }
    
    CreateTableData(centroMedico.nombre, tr, alignmentLeft);
    CreateTableData(centroMedico.direccion, tr, alignmentLeft);
    CreateTableData(centroMedico.localidad, tr, alignmentLeft);
    CreateTableData(centroMedico.telefono, tr, alignmentRight);
    CreateTableData(centroMedico.personaContacto, tr, alignmentLeft);
    CreateTableData(centroMedico.email, tr, alignmentLeft);
    CreateTableData(centroMedico.duracionSesion, tr, alignmentRight);

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
    await window.viewModelAPI.updateEstadoCentroMedico(centroMedicoActual.idCentroMedico, Estados.ACTIVO);
    switchInputActual.title = 'Inactivar';
    trActual.classList.remove('table-secondary');
    trActual.querySelector("#editIcon").classList.remove('disabled-icon');
    toggleIconLink(trActual.querySelector("#lnkPacientes"), "Ver pacientes", false);
    toggleIconLink(trActual.querySelector("#lnkHistorial"), "Ver historial importes", false);
}

async function manejarConfirmacionInactivacion() {
    const nuevoEstado = 2;

    modal.hide();
    document.activeElement.blur();

    await window.viewModelAPI.updateEstadoCentroMedico(centroMedicoActual.idCentroMedico, nuevoEstado);
    switchInputActual.title = 'Activar';

    if (!IncluirInactivosChecked()) {
        trActual.classList.add('fade-out-row');
        setTimeout(() => trActual.remove(), 800);
    } else {
        trActual.classList.add('table-secondary');
        trActual.querySelector("#editIcon").classList.add('disabled-icon');
    }

    toggleIconLink(trActual.querySelector("#lnkPacientes"), "Ver pacientes", true);
    toggleIconLink(trActual.querySelector("#lnkHistorial"), "Ver historial importes", true);
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

function renderPagination(currentPage, totalPages, actionMethod) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Limpiar paginación
  
    let paginationHTML = `<ul class="pagination">`;
  
     // Botón "Anterior"
    paginationHTML += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="changePage(${currentPage - 1}, ${totalPages}, '${actionMethod}')">Anterior</a>
    </li>
    `;
  
    const maxPagesToShow = 5; // Número máximo de páginas visibles
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (startPage > 1) {
        paginationHTML += `
        <li class="page-item">
            <a class="page-link" href="#" onclick="changePage(1, ${totalPages}, '${actionMethod}')">1</a>
        </li>
        ${startPage > 2 ? `<li class="page-item disabled"><span class="page-link">...</span></li>` : ''}
        `;
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" onclick="changePage(${i}, ${totalPages}, '${actionMethod}')">${i}</a>
        </li>
        `;
    }

    if (endPage < totalPages) {
        paginationHTML += `
        ${endPage < totalPages - 1 ? `<li class="page-item disabled"><span class="page-link">...</span></li>` : ''}
        <li class="page-item">
            <a class="page-link" href="#" onclick="changePage(${totalPages}, ${totalPages}, '${actionMethod}')">${totalPages}</a>
        </li>
        `;
    }

    // Botón "Siguiente"
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="changePage(${currentPage + 1}, ${totalPages}, '${actionMethod}')">Siguiente</a>
        </li>
    `;
  
    paginationHTML += `</ul>`;
    paginationContainer.innerHTML = paginationHTML;
}
  
function changePage(page, totalPages, actionMethod) {
    if (page >= 1 && page <= totalPages) {
        // Determinar qué método ejecutar según el nombre
        if (actionMethod === Actions.FILTER) {
            FiltrarCentrosMedicos(page);
        } else if (actionMethod === Actions.GETALL) {
            CargarCentrosMedicos(page);
        }
    }
}

CargaInicial();
CargarCentrosMedicos();