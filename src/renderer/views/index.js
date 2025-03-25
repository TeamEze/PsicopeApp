let listaColumnasGrillaCentrosMedicos = ["#", "Nombre", "Dirección", "Localidad", "Teléfono", "Contacto", "Email", "Duración Sesión", "Estado"];

// Función para crear un centro médico
async function CrearCentroMedico() {
    const nuevoCentroMedico = {
        nombre: 'Nuevo Centro Médico',
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
async function CargarCentrosMedicos() {
    const centrosMedicos = await window.viewModelAPI.getCentrosMedicos();
    const tablaCentrosMedicos = document.getElementById('tblSesiones');
    AgregarHeadersGrillaCentrosMedicos(tablaCentrosMedicos);

    const tbody = document.createElement('tbody');
    centrosMedicos.forEach(centroMedico => {
        ActualizarTablaConCentroMedico(centroMedico, tbody);
    });
    tablaCentrosMedicos.appendChild(tbody);
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

// Función para agregar los headers de la tabla
function AgregarHeadersGrillaCentrosMedicos(grillaCentrosMedicos) {
    const tHead = document.createElement('thead');
    const rowHeaders = document.createElement('tr');
    listaColumnasGrillaCentrosMedicos.forEach(columna => CrearTableHeader(columna, rowHeaders));
    tHead.appendChild(rowHeaders);
    grillaCentrosMedicos.appendChild(tHead);
}

// Inicializar eventos y cargar datos
document.getElementById('btnCrearCentroMedico').addEventListener('click', CrearCentroMedico);
CargarCentrosMedicos();