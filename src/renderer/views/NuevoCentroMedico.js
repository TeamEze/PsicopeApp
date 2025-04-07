let isEditing = false;
let editingCentroMedicoId = null;

// Escuchar el evento 'clear-form' para limpiar el formulario
window.viewModelAPI.clearForm(() => {
    const form = document.getElementById('frmNuevoCentroMedico');
    if (form) {
      form.reset(); // Limpia todos los controles del formulario
    }
  });

window.viewModelAPI.onEditarCentroMedico(async (event, idCentroMedico) => {
    isEditing = true;
    editingCentroMedicoId = idCentroMedico;

    centroMedico= await window.viewModelAPI.getCentroMedicoById(idCentroMedico);

    document.getElementById('txtNombre').value = centroMedico.nombre;
    document.getElementById('txtDireccion').value = centroMedico.direccion;
    document.getElementById('cboLocalidad').value = centroMedico.idLocalidad;
    document.getElementById('txtTelefono').value = centroMedico.telefono;
    document.getElementById('txtPersonaContacto').value = centroMedico.personaContacto;
    document.getElementById('txtEmail').value = centroMedico.email;
    document.getElementById('nbDuracion').value = centroMedico.duracionSesion;
});

document.getElementById('btnCancelarCentroMedico').addEventListener('click', () => {
  // Cerrar la ventana modal
  window.viewModelAPI.hideNuevoCentroMedicoModal();
});

  // Manejar el clic en el botón "Guardar"
document.getElementById('frmNuevoCentroMedico').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío del formulario por defecto
  
    const centroMedico = {
      idCentroMedico: editingCentroMedicoId, // Incluye el ID si está en modo edición
      nombre: document.getElementById('txtNombre').value,
      direccion: document.getElementById('txtDireccion').value,
      idLocalidad: parseInt(document.getElementById('cboLocalidad').value, 10),
      telefono: document.getElementById('txtTelefono').value,
      personaContacto: document.getElementById('txtPersonaContacto').value,
      email: document.getElementById('txtEmail').value,
      duracionSesion: parseInt(document.getElementById('nbDuracion').value, 10),
      idEstado: 1
    };
  
    if (isEditing) {
      const centroMedicoEdited = await window.viewModelAPI.updateCentroMedico(centroMedico)
      window.viewModelAPI.sendCentroMedicoEdited(centroMedicoEdited);

      isEditing = false;
      editingCentroMedicoId = null;
    } else {
        // Enviar los datos al proceso principal para crear un nuevo registro
        window.viewModelAPI.sendNuevoCentroMedico(centroMedico);
    }
  
    // Cerrar la ventana modal
    window.viewModelAPI.hideNuevoCentroMedicoModal();
  });

 