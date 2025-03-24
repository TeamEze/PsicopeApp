 let listaColumnasGrillaCentrosMedicos = ["#","Nombre","Dirección", "Localidad", "Telefóno", "Contacto", "Email", "Duración Sesión", "Estado" ];
 
 async function CargarCentrosMedicos() {
    const centrosMedicos = await window.electron.getCentrosMedicos();
    //const CEntrosMedicos = [{idCentroMedico = 1, nombre= 232}, {""}]
    const tablaCentrosMedicos = document.getElementById('tblSesiones');
    //AgregarHeadersGrilla(grilla, listaColumnas);
    AgregarHeadersGrillaCentrosMedicos(tablaCentrosMedicos);
    const tbody = document.createElement('tbody');
    centrosMedicos.forEach(centroMedico => {
        const tr = document.createElement('tr');
        CrearTableData(centroMedico.idCentroMedico, tr);
        CrearTableData(centroMedico.nombre, tr);
        CrearTableData(centroMedico.direccion, tr);
        CrearTableData(centroMedico.localidad.descripcion, tr);
        CrearTableData(centroMedico.telefono, tr);
        CrearTableData(centroMedico.personaContacto, tr);
        CrearTableData(centroMedico.email, tr);
        CrearTableData(centroMedico.duracionSesion, tr);
        CrearTableData(centroMedico.estado.descripcion, tr);
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
    CrearTableHeader("Localidad", rowHeaders);
    CrearTableHeader("Teléfono", rowHeaders);
    CrearTableHeader("Contacto", rowHeaders);
    CrearTableHeader("Email", rowHeaders);
    CrearTableHeader("Duración Sesión", rowHeaders);
    CrearTableHeader("Estado", rowHeaders);
    tHead.appendChild(rowHeaders);
    grillaCentrosMedicos.appendChild(rowHeaders); 
}


CargarCentrosMedicos();