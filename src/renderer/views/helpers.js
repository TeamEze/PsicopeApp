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