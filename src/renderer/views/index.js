let listaColumnasGrillaCentrosMedicos = ["#", "Nombre", "Dirección", "Localidad", "Teléfono", "Contacto", "Email", "Duración Sesión", "Estado"];
const Actions = Object.freeze({
    FILTER: "filter",
    GETALL: "getAll"
});
const pageSize = 10; // Tamaño de página

function CargaInicial() {
    //Carga de Localidades
    //Crear Cabecera de tabla
    
    const idGrilla = document.getElementById('tblCentrosMedicos');
    AddTableHeaders(idGrilla, listaColumnasGrillaCentrosMedicos);
    
    // Inicializar eventos
    document.getElementById('btnCrearCentroMedico').addEventListener('click', CrearCentroMedico);
    document.getElementById('btnFiltrarCentroMedico').addEventListener('click', () => FiltrarCentrosMedicos());
}



//Función para filtrar centros médicos
async function FiltrarCentrosMedicos(pageFilter = 1) {
    let filters = {};
    let paginationData = {page: pageFilter, pageSize:pageSize};
    
    const nombre = document.getElementById('txtName').value;
    if (nombre) {
        filters.nombre = nombre;
    }
    
    const idLocalidad = document.getElementById('cboLocalidad').value;
    if (idLocalidad) {
        filters.idLocalidad = idLocalidad;
    }

    const result = await window.viewModelAPI.getCentrosMedicosByFilters(filters, paginationData);
    
    let totalPages = result.totalPages;
    let currentPage = result.currentPage;
    const centrosMedicosData = result.data;
    
    UpdateTableContent(centrosMedicosData);
    renderPagination(currentPage, totalPages, Actions.FILTER);
}

// Función para crear un centro médico
async function CrearCentroMedico() {
    const nuevoCentroMedico = {
        nombre: 'Nuevo Centro Médico',//document.getElementById('nuevoCentroMedico').value; desde el formulario
        direccion: 'Calle Falsa 123',
        idLocalidad: 1,
        telefono: '123456789',
        personaContacto: 'Juan Pérez',
        email: 'nuevo@centromedico.com',
        duracionSesion: 60,
        idEstado: 1
    };

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
        const result = await window.viewModelAPI.getCentrosMedicosWithPagination(paginationData);
        const totalPages = result.totalPages;
        renderPagination(currentPage, totalPages, Actions.GETALL);
    }
    
}

// Función para cargar los centros médicos
async function CargarCentrosMedicos(page = 1) {
    //const centrosMedicos = await window.viewModelAPI.getCentrosMedicos();
    let paginationData = {page:page, pageSize:pageSize};
    const result = await window.viewModelAPI.getCentrosMedicosWithPagination(paginationData);
    //console.log(result);

    let totalPages = result.totalPages;
    let currentPage = result.currentPage;
    const centrosMedicosData = result.data;
    
    UpdateTableContent(centrosMedicosData);
    renderPagination(currentPage, totalPages, Actions.GETALL);
}

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
    if (isNew) {
        tr.classList.add('highlight'); // Aplicar el efecto visual
    }
    
    CreateTableData(centroMedico.idCentroMedico, tr);
    CreateTableData(centroMedico.nombre, tr);
    CreateTableData(centroMedico.direccion, tr);
    CreateTableData(centroMedico.localidad, tr);
    CreateTableData(centroMedico.telefono, tr);
    CreateTableData(centroMedico.personaContacto, tr);
    CreateTableData(centroMedico.email, tr);
    CreateTableData(centroMedico.duracionSesion, tr);
    CreateTableData(centroMedico.estado, tr);
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