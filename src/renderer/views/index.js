async function loadCentrosMedicos() {
    const centrosMedicos = await window.electron.getCentrosMedicos();
    const centrosMedicosList = document.getElementById('centrosMedicosList');
    centrosMedicosList.innerHTML = '';
    centrosMedicos.forEach(centroMedico => {
        const li = document.createElement('li');
        li.textContent = centroMedico.dataValues.nombre
        ;
        centrosMedicosList.appendChild(li);
    });
}

loadCentrosMedicos();