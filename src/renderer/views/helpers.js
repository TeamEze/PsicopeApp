function CrearTableData(data, rowPadre){
    const td = document.createElement('td');
    td.textContent = data;
    rowPadre.appendChild(td);
}

function CrearTableHeader(nombreHeader, rowHeaders){
    const th = document.createElement('th');
    th.textContent = nombreHeader;
    th.scope = "col"
    rowHeaders.appendChild(th);
}

// Función para agregar los headers de la tabla
function AgregarHeadersGrilla(idGrilla,listaColumnasGrilla) {
    const tHead = document.createElement('thead');
    const rowHeaders = document.createElement('tr');
    listaColumnasGrilla.forEach(columna => CrearTableHeader(columna, rowHeaders));
    tHead.appendChild(rowHeaders);
    idGrilla.appendChild(tHead);
}