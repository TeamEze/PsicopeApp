// Escuchar el evento 'clear-form' para limpiar el formulario
window.viewModelAPI.clearForm(() => {
    const form = document.getElementById('frmNuevoCentroMedico');
    if (form) {
      form.reset(); // Limpia todos los controles del formulario
    }
  });
  

  // Manejar el clic en el botón "Guardar"
document.getElementById('frmNuevoCentroMedico').addEventListener('submit', (event) => {
    event.preventDefault(); // Evitar el envío del formulario por defecto
  
    const nuevoCentroMedico = {
      nombre: document.getElementById('nombre').value,
      direccion: document.getElementById('direccion').value,
      idLocalidad: document.getElementById('localidad').value,
      telefono: document.getElementById('telefono').value,
      personaContacto: document.getElementById('contacto').value,
      email: document.getElementById('email').value,
      duracionSesion: document.getElementById('duracion').value,
      idEstado: 1
    };
  
    // Enviar los datos al proceso principal
    window.viewModelAPI.sendNuevoCentroMedico(nuevoCentroMedico);
  
    // Cerrar la ventana modal
    window.viewModelAPI.hideNuevoCentroMedicoModal();
  });