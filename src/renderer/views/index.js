 async function CargarCentrosMedicos() {
    const centrosMedicos = await window.electron.getCentrosMedicos();
    const tablaCentrosMedicos = document.getElementById('tblSesiones');
    AgregarHeadersGrillaCentrosMedicos(tablaCentrosMedicos);
    const tbody = document.createElement('tbody');
    centrosMedicos.forEach(centroMedico => {
        const tr = document.createElement('tr');
        CrearTableData(centroMedico.dataValues.idCentroMedico, tr);
        CrearTableData(centroMedico.dataValues.nombre, tr);
        CrearTableData(centroMedico.dataValues.direccion, tr);
        CrearTableData(centroMedico.dataValues.telefono, tr);
        CrearTableData(centroMedico.dataValues.personaContacto, tr);
        CrearTableData(centroMedico.dataValues.email, tr);
        CrearTableData(centroMedico.dataValues.duracionSesion, tr);
        tbody.appendChild(tr);
        
    });
    tablaCentrosMedicos.appendChild(tbody);
}

function ShowSection(idSeccion){
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    // Mostrar la sección seleccionada por ID
    const selectedSection = document.getElementById(idSeccion);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }

    // Manejar la activación de los tabs
    const tabs = document.querySelectorAll('.nav-link');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Activar el tab que fue clickeado
    const index = Array.from(tabs).findIndex(tab => tab.getAttribute('onclick').includes(idSeccion));
    if (index !== -1) {
        tabs[index].classList.add('active');
    }

}

function AgregarHeadersGrillaCentrosMedicos(grillaCentrosMedicos){
    const tHead = document.createElement('thead');
    const rowHeaders = document.createElement('tr');
    CrearTableHeader("#", rowHeaders);
    CrearTableHeader("Nombre", rowHeaders);
    CrearTableHeader("Direccion", rowHeaders);
    CrearTableHeader("Teléfono", rowHeaders);
    CrearTableHeader("Contacto", rowHeaders);
    CrearTableHeader("Email", rowHeaders);
    CrearTableHeader("Duración Sesión", rowHeaders);
    tHead.appendChild(rowHeaders);
    grillaCentrosMedicos.appendChild(rowHeaders); 
}

function CrearTableHeader(nombreHeader, rowHeaders){
    const th = document.createElement('th');
    th.textContent = nombreHeader;
    th.scope = "col"
    rowHeaders.appendChild(th);
}

function CrearTableData(data, rowPadre){
    const td = document.createElement('td');
    td.textContent = data;
    rowPadre.appendChild(td);
}

CargarCentrosMedicos();