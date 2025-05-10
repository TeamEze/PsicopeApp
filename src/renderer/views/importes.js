function cargarHistorialImportes() {
  const parametros = window.parametrosImportes || {};
  const idCentroMedico = parametros.idCentroMedico;

  if (!idCentroMedico) {
    console.warn('No se recibió idCentroMedico');
  } else {
    console.log('Cargando importes para centro médico ID:', idCentroMedico);
  }
  cargarCentroMedicos();

  /* const tblImportes = document.getElementById('tblImportes');
  if (!tblImportes) {
    console.warn('tblImportes no encontrado, reintentando...');
    /* setTimeout(ejecutarImportes, 50); */
   /*  return; */ 
  }
cargarHistorialImportes();

async function cargarCentroMedicos(){
  try {
    cboCentroMedico.innerHTML = '';
    // Agregar opción por defecto
    const optionDefault = document.createElement('option');
    optionDefault.value = '';
    optionDefault.textContent = 'Seleccione Centro Médico';
    cboCentroMedico.appendChild(optionDefault);
    throw new Error();
    const resultado = await window.viewModelAPI.getActiveCentroMedico(); 
    if (!resultado.ok) throw new Error();
    
    const centrosMedicos = resultado.data;
    centrosMedicos.forEach(centroMedico => {
        const option = document.createElement('option');
        option.value = centroMedico.dataValues.idCentroMedico;
        option.textContent = centroMedico.dataValues.nombre;
        cboCentroMedico.appendChild(option);
    });
} catch (error) {
    mostrarErrorUsuario("Ocurrió un error al cargar los Centro Médicos. Por favor, inténtelo de nuevo más tarde.");
}
}
