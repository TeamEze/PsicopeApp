const alignmentLeft = "text-start";
const alignmentCenter = "text-center";
const alignmentRight = "text-end";
const pageSize = 10; // Tamaño de página

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
                                        {columnName: "Historial Importes", alineacion: alignmentCenter} ]
const Actions = Object.freeze({
    FILTER: "filter",
    GETALL: "getAll"
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
            row.classList.add('highlight'); // Aplicar el efecto visual
            const cells = row.children;
            cells[0].textContent = centroMedicoEdited.nombre;
            cells[1].textContent = centroMedicoEdited.direccion;
            cells[2].textContent = centroMedicoEdited.localidad;
            cells[3].textContent = centroMedicoEdited.telefono;
            cells[4].textContent = centroMedicoEdited.personaContacto;
            cells[5].textContent = centroMedicoEdited.email;
            cells[6].textContent = centroMedicoEdited.duracionSesion;
            setTimeout(() => row.classList.remove('highlight'), 4000);
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
        tr.classList.add('highlight'); // Aplicar el efecto visual
    }
    
    CreateTableData(centroMedico.nombre, tr, alignmentLeft);
    CreateTableData(centroMedico.direccion, tr, alignmentLeft);
    CreateTableData(centroMedico.localidad, tr, alignmentLeft);
    CreateTableData(centroMedico.telefono, tr, alignmentRight);
    CreateTableData(centroMedico.personaContacto, tr, alignmentLeft);
    CreateTableData(centroMedico.email, tr, alignmentLeft);
    CreateTableData(centroMedico.duracionSesion, tr, alignmentRight);
    //CreateTableData(centroMedico.estado, tr, alignmentLeft);
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
        const nuevoEstado = switchInput.checked ? 1 : 2; // 1 = Activo, 2 = Inactivo
        if  (nuevoEstado === 2) {
            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById('confirmarInactivacionModal'), {
                backdrop: 'static',
                keyboard: false
              });
            modal.show();

            // Si se confirma, ejecutar acción
            document.getElementById('btnConfirmarInactivacion').onclick = async () => {
                modal.hide();
                await window.viewModelAPI.updateEstadoCentroMedico(centroMedico.idCentroMedico, nuevoEstado);
                switchInput.title = nuevoEstado === 1 ? 'Inactivar' : 'Activar';    

                if (!IncluirInactivosChecked()) {
                    tr.classList.add('fade-out-row'); // Agrega la clase para el efecto
                    setTimeout(() => tr.remove(), 800); 
                }
                else{
                    tr.classList.toggle('table-secondary', nuevoEstado === 2); // Cambiar estilo si está inactivo
                    editIcon.classList.toggle('disabled-icon', nuevoEstado === 2);
                }
            };
            //Si se cancela
            document.getElementById('btnCancelarInactivacion').onclick = () => {
                switchInput.checked = true;
            };
        }
        else {
            await window.viewModelAPI.updateEstadoCentroMedico(centroMedico.idCentroMedico, nuevoEstado);
            tr.classList.toggle('table-secondary', nuevoEstado === 2); // Cambiar estilo si está inactivo
            editIcon.classList.toggle('disabled-icon', nuevoEstado === 2);
        }
    });

    divSwitch.appendChild(switchInput);
    tdSwitch.appendChild(divSwitch);
    tr.appendChild(tdSwitch);

    // Agregar columna de acciones
    const tdAcciones = document.createElement('td');
    tdAcciones.classList.add('text-center'); // Centrar el contenido

    // Crear el ícono de lápiz
    const editIcon = document.createElement('i');
    editIcon.className = 'fas fa-edit'; // Clase de FontAwesome para el ícono de lápiz
    editIcon.classList.toggle('disabled-icon', centroMedico.estado !== 'Activo');
    editIcon.style.cursor = 'pointer'; // Cambiar el cursor al pasar sobre el ícono
    editIcon.title = 'Editar'; // Tooltip al pasar el mouse
    editIcon.onclick = () => {
        window.viewModelAPI.openEditCentroMedicoModal(centroMedico.idCentroMedico); // Enviar el ID del centro médico al modal de edición
    };
    tdAcciones.appendChild(editIcon);
    tr.appendChild(tdAcciones);
    
    // Pacientes
    const tdPacientes = document.createElement('td');
    tdPacientes.classList.add('text-center');
    tdPacientes.innerHTML = `<a href="#" class="text-decoration-underline text-primary">Ver más</a>`;
    tr.appendChild(tdPacientes);

    // Historial Importes
    const tdImportes = document.createElement('td');
    tdImportes.classList.add('text-center');
    tdImportes.innerHTML = `<a href="#" class="text-decoration-underline text-primary">Ver más</a>`;
    tr.appendChild(tdImportes);

    tbody.appendChild(tr);
    // Eliminar la clase después de unos segundos
    if (isNew) {
        setTimeout(() => tr.classList.remove('highlight'), 4000);
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