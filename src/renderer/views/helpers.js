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

/* function mostrarErrorBonito(mensaje) {
    // Si ya existe un diálogo, lo cerramos primero
    const alertaExistente = document.querySelector('.alerta-error-dialogo');
    if (alertaExistente) {
        alertaExistente.close();
        alertaExistente.remove();
    }

    const dialogo = document.createElement('dialog');
    dialogo.className = 'alerta-error-dialogo';

    Object.assign(dialogo.style, {
        padding: '1.5rem',
        border: 'none',
        borderRadius: '0.75rem',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        fontSize: '1rem',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        maxWidth: '90vw',
        width: 'auto',
        textAlign: 'center',
        zIndex: '9999',
    });

    dialogo.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center;">
            <span style="font-size: 2rem;">⚠️</span>
            <p style="margin-top: 1rem;">${mensaje}</p>
            <button style="
                margin-top: 1.5rem;
                padding: 0.5rem 1rem;
                background-color: #721c24;
                color: white;
                border: none;
                border-radius: 0.5rem;
                cursor: pointer;
            ">Aceptar</button>
        </div>
    `;

    document.body.appendChild(dialogo);

    // Abrir el diálogo
    dialogo.showModal();

    // Cuando el usuario hace click en el botón, cierra el diálogo
    const botonAceptar = dialogo.querySelector('button');
    botonAceptar.addEventListener('click', () => {
        dialogo.close();
        dialogo.remove();
    });

    // Cierre automático opcional después de 5 segundos
    setTimeout(() => {
        if (dialogo.open) {
            dialogo.close();
            dialogo.remove();
        }
    }, 5000);
} */

    function mostrarErrorBonito(mensaje) {
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
        }, 5000); // se borra luego de 5 segundos
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

    mostrarErrorBonito('Ocurrió un problema inesperado. Contacte con su administrador.');
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

    mostrarErrorBonito('Ocurrió un problema inesperado. Contacte con su administrador.');
});
      