function CreateTableData(data, rowPadre, alignmentClass){
    const td = document.createElement('td');
    td.textContent = data;
    td.classList.add(alignmentClass);
    rowPadre.appendChild(td);
}

function CreateTableHeader(header, rowHeaders){
    const th = document.createElement('th');
    th.textContent = header.columnName;
    th.scope = "col"
    th.classList.add(header.alineacion)
    rowHeaders.appendChild(th);
}

function AddTableHeaders(idTabla, listaColumnas) {
    const tHead = document.createElement('thead');
    const rowHeaders = document.createElement('tr');
    listaColumnas.forEach(columna => CreateTableHeader(columna, rowHeaders));
    tHead.appendChild(rowHeaders);
    idTabla.appendChild(tHead);
}

    