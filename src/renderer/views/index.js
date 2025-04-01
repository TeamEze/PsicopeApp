let listaColumnasGrillaCentrosMedicos = ["#", "Nombre", "Dirección", "Localidad", "Teléfono", "Contacto", "Email", "Duración Sesión", "Estado"];

const pageSize = 10; // Tamaño de página

//Función para filtrar centros médicos
async function FiltrarCentrosMedicos() {
    let filters = {};
    
    const nombre = "Castel"//document.getElementById('txtNombre').value;
    if (nombre) {
        filters.nombre = nombre;
    }
    
    const idLocalidad = 2//document.getElementById('cboLocalidad').value;
    if (idLocalidad) {
        filters.idLocalidad = idLocalidad;
    }

    const centrosMedicos = await window.viewModelAPI.getCentrosMedicosByFilters(filters);
    const tablaCentrosMedicos = document.getElementById('tblSesiones');
    tablaCentrosMedicos.removeChild(tablaCentrosMedicos.querySelector('tbody'));
    const tbody = document.createElement('tbody');
    centrosMedicos.forEach(centroMedico => {
        ActualizarTablaConCentroMedico(centroMedico, tbody);
    });
    tablaCentrosMedicos.appendChild(tbody);
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

    // Actualizar la tabla con el nuevo centro médico
    ActualizarTablaConCentroMedico(centroMedicoCreado);
}

// Función para cargar los centros médicos
async function CargarCentrosMedicos(page = 1) {
    //const centrosMedicos = await window.viewModelAPI.getCentrosMedicos();
    let paginationData = {page:page, pageSize:pageSize};
    const result = await window.viewModelAPI.getCentrosMedicosWithPagination(paginationData);
    console.log(result);

    let totalPages = result.totalPages;
    let currentPage = result.currentPage;

    const centrosMedicos = result.data;
    const tablaCentrosMedicos = document.getElementById('tblSesiones');
    AgregarHeadersGrilla(tablaCentrosMedicos,listaColumnasGrillaCentrosMedicos);

    const tbody = document.createElement('tbody');
    centrosMedicos.forEach(centroMedico => {
        ActualizarTablaConCentroMedico(centroMedico, tbody);
    });
    tablaCentrosMedicos.appendChild(tbody);
    renderPagination(currentPage, totalPages);
}

// Función para actualizar la tabla con un centro médico
function ActualizarTablaConCentroMedico(centroMedico, tbody = null) {
    const tablaCentrosMedicos = document.getElementById('tblSesiones');
    const tr = document.createElement('tr');
    CrearTableData(centroMedico.idCentroMedico, tr);
    CrearTableData(centroMedico.nombre, tr);
    CrearTableData(centroMedico.direccion, tr);
    CrearTableData(centroMedico.localidad, tr);
    CrearTableData(centroMedico.telefono, tr);
    CrearTableData(centroMedico.personaContacto, tr);
    CrearTableData(centroMedico.email, tr);
    CrearTableData(centroMedico.duracionSesion, tr);
    CrearTableData(centroMedico.estado, tr);

    if (tbody) {
        tbody.appendChild(tr);
    } else {
        const tbody = tablaCentrosMedicos.querySelector('tbody') || document.createElement('tbody');
        tbody.appendChild(tr);
        if (!tablaCentrosMedicos.contains(tbody)) {
            tablaCentrosMedicos.appendChild(tbody);
        }
    }
}

/* // Función para agregar los headers de la tabla
function AgregarHeadersGrillaCentrosMedicos(grillaCentrosMedicos) {
    const tHead = document.createElement('thead');
    const rowHeaders = document.createElement('tr');
    listaColumnasGrillaCentrosMedicos.forEach(columna => CrearTableHeader(columna, rowHeaders));
    tHead.appendChild(rowHeaders);
    grillaCentrosMedicos.appendChild(tHead);
}*/

function renderPagination(currentPage, totalPages) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Limpiar paginación
  
    let paginationHTML = `<ul class="pagination">`;
  
    // Botón "Anterior"
    paginationHTML += `
      <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="changePage(${currentPage - 1}, ${totalPages})">Anterior</a>
      </li>
    `;
  
    // Números de página
    for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <a class="page-link" href="#" onclick="changePage(${i}, ${totalPages})">${i}</a>
        </li>
      `;
    }
  
    // Botón "Siguiente"
    paginationHTML += `
      <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="changePage(${currentPage + 1}, ${totalPages})">Siguiente</a>
      </li>
    `;
  
    paginationHTML += `</ul>`;
    paginationContainer.innerHTML = paginationHTML;
  }
  
  function changePage(page, totalPages) {
    if (page >= 1 && page <= totalPages) {
      CargarCentrosMedicos(page);
    }
  }



// Inicializar eventos y cargar datos
document.getElementById('btnCrearCentroMedico').addEventListener('click', CrearCentroMedico);
document.getElementById('btnFiltrarCentroMedico').addEventListener('click', FiltrarCentrosMedicos);
CargarCentrosMedicos();