function CreateTableData(data, rowPadre){
    const td = document.createElement('td');
    td.textContent = data;
    rowPadre.appendChild(td);
}

function CreateTableHeader(nombreHeader, rowHeaders){
    const th = document.createElement('th');
    th.textContent = nombreHeader;
    th.scope = "col"
    rowHeaders.appendChild(th);
}

function AddTableHeaders(idTabla, listaColumnas) {
    const tHead = document.createElement('thead');
    const rowHeaders = document.createElement('tr');
    listaColumnas.forEach(columna => CreateTableHeader(columna, rowHeaders));
    tHead.appendChild(rowHeaders);
    idTabla.appendChild(tHead);
}

    