function createTableData(data, rowPadre, alignmentClass){
    const td = document.createElement('td');
    td.textContent = data;
    td.classList.add(alignmentClass);
    rowPadre.appendChild(td);
}

function createTableHeader(header, rowHeaders){
    const th = document.createElement('th');
    th.textContent = header.columnName;
    th.scope = "col"
    th.classList.add(header.alineacion)
    rowHeaders.appendChild(th);
}

function addTableHeaders(idTabla, listaColumnas) {
    const tHead = document.createElement('thead');
    const rowHeaders = document.createElement('tr');
    listaColumnas.forEach(columna => createTableHeader(columna, rowHeaders));
    tHead.appendChild(rowHeaders);
    idTabla.appendChild(tHead);
}

function renderPagination({ currentPage, totalPages, actionMethod, changePageCallback }) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Limpiar paginación
    
    const ul = document.createElement('ul');
    ul.classList.add('pagination');
    
    // Botón "Anterior"
    const liAnterior = document.createElement('li');
    liAnterior.classList.add('page-item');
    if (currentPage === 1) {
        liAnterior.classList.add('disabled');
    }
    const aAnterior = document.createElement('a');
    aAnterior.classList.add('page-link');
    aAnterior.href = '#';
    aAnterior.textContent = 'Anterior';
    aAnterior.addEventListener('click', (e) => {
        e.preventDefault();
        changePageCallback(currentPage - 1, totalPages, actionMethod);
    });
    liAnterior.appendChild(aAnterior);
    ul.appendChild(liAnterior);
    
    const maxPagesToShow = 5; // Número máximo de páginas visibles
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (startPage > 1) {
        const liPrimera = document.createElement('li');
        liPrimera.classList.add('page-item');
        const aPrimera = document.createElement('a');
        aPrimera.classList.add('page-link');
        aPrimera.href = '#';
        aPrimera.textContent = '1';
        aPrimera.addEventListener('click', (e) => {
            e.preventDefault();
            changePageCallback(1, totalPages, actionMethod);
        });
        liPrimera.appendChild(aPrimera);
        ul.appendChild(liPrimera);

        if (startPage > 2) {
            const liEllipsis = document.createElement('li');
            liEllipsis.classList.add('page-item', 'disabled');
            const spanEllipsis = document.createElement('span');
            spanEllipsis.classList.add('page-link');
            spanEllipsis.textContent = '...';
            liEllipsis.appendChild(spanEllipsis);
            ul.appendChild(liEllipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');
        if (i === currentPage) {
            li.classList.add('active');
        }
        const a = document.createElement('a');
        a.classList.add('page-link');
        a.href = '#';
        a.textContent = i;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            changePageCallback(i, totalPages, actionMethod);
        });
        li.appendChild(a);
        ul.appendChild(li);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const liEllipsis = document.createElement('li');
            liEllipsis.classList.add('page-item', 'disabled');
            const spanEllipsis = document.createElement('span');
            spanEllipsis.classList.add('page-link');
            spanEllipsis.textContent = '...';
            liEllipsis.appendChild(spanEllipsis);
            ul.appendChild(liEllipsis);
        }

        const liUltima = document.createElement('li');
        liUltima.classList.add('page-item');
        const aUltima = document.createElement('a');
        aUltima.classList.add('page-link');
        aUltima.href = '#';
        aUltima.textContent = totalPages;
        aUltima.addEventListener('click', (e) => {
            e.preventDefault();
            changePageCallback(totalPages, totalPages, actionMethod);
        });
        liUltima.appendChild(aUltima);
        ul.appendChild(liUltima);
    }

    // Botón "Siguiente"
    const liSiguiente = document.createElement('li');
    liSiguiente.classList.add('page-item');
    if (currentPage === totalPages) {
        liSiguiente.classList.add('disabled');
    }
    const aSiguiente = document.createElement('a');
    aSiguiente.classList.add('page-link');
    aSiguiente.href = '#';
    aSiguiente.textContent = 'Siguiente';
    aSiguiente.addEventListener('click', (e) => {
        e.preventDefault();
        changePageCallback(currentPage + 1, totalPages, actionMethod);
    });
    liSiguiente.appendChild(aSiguiente);
    ul.appendChild(liSiguiente);
    
    paginationContainer.appendChild(ul);
}

function mostrarErrorUsuario(mensaje) {
    const alerta = document.createElement('div');
    alerta.className = 'alert alert-danger shadow-lg text-center';
    alerta.style.position = 'fixed';
    alerta.style.bottom = '20px';
    alerta.style.left = '50%';
    alerta.style.transform = 'translateX(-50%)';
    alerta.style.zIndex = '9999';
    alerta.style.minWidth = '300px';
    alerta.style.maxWidth = '80%';
    alerta.style.padding = '15px';

    alerta.textContent = '⚠️ ' + mensaje;

    document.body.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 10000); // se borra luego de 5 segundos
} 

function loguearError(error, source) {
    //console.error('Error:', error);
    window.viewModelAPI?.reportError?.({
        message: error.message || 'Error desconocido',
        parameters: null,
        stack: error.stack || '',
        source: source || 'renderer - error no especificado'
    });
}
    

window.addEventListener('error', (event) => {
    window.viewModelAPI?.reportError?.({
        message: event.message,
        parameters: null,
        stack: event.error?.stack || '',
        source: 'renderer - uncaught error'
    });

    mostrarErrorUsuario('Ocurrió un problema inesperado. Contacte con su administrador.');
});

window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    const reason = event.reason;

    window.viewModelAPI?.reportError?.({
        message: reason?.message || String(reason),
        parameters: null,
        stack: reason?.stack || '',
        source: 'renderer - unhandled promise'
    });

    mostrarErrorUsuario('Ocurrió un problema inesperado. Contacte con su administrador.');
});
      