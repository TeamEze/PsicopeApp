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

    if (!validarFormularioCentroMedico()) {
      return; //Si hay errores en el form, no continúa
    }

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

  function validarFormularioCentroMedico() {
    let valido = true;
  
    // Elementos
    const nombre = document.getElementById('txtNombre');
    const direccion = document.getElementById('txtDireccion');
    const localidad = document.getElementById('cboLocalidad');
    const telefono = document.getElementById('txtTelefono');
    const contacto = document.getElementById('txtPersonaContacto');
    const email = document.getElementById('txtEmail');
    const duracion = document.getElementById('nbDuracion');
  
    // Resetear errores
    [nombre, direccion, localidad, telefono, contacto, email, duracion].forEach(el => {
      el.classList.remove('is-invalid');
    });
    document.querySelectorAll('.invalid-feedback').forEach(el => {
      el.textContent = '';
    });
  
    // Validaciones
    if (nombre.value.trim() === '' || nombre.value.trim().length > 50) {
      valido = false;
      nombre.classList.add('is-invalid');
      document.getElementById('errorNombre').textContent = 'El nombre es obligatorio y debe tener hasta 50 caracteres.';
    }
  
    if (direccion.value.trim() === '' || direccion.value.trim().length > 50) {
      valido = false;
      direccion.classList.add('is-invalid');
      document.getElementById('errorDireccion').textContent = 'La dirección es obligatoria y debe tener hasta 50 caracteres.';
    }
  
    if (localidad.value.trim() === '') {
      valido = false;
      localidad.classList.add('is-invalid');
      document.getElementById('errorLocalidad').textContent = 'Debe seleccionar una localidad.';
    }
  
    if (!/^\d{1,10}$/.test(telefono.value.trim())) {
      valido = false;
      telefono.classList.add('is-invalid');
      document.getElementById('errorTelefono').textContent = 'El teléfono debe tener exactamente 10 dígitos numéricos.';
    }
  
    if (contacto.value.trim() === '' || contacto.value.trim().length > 50) {
      valido = false;
      contacto.classList.add('is-invalid');
      document.getElementById('errorContacto').textContent = 'La persona de contacto es obligatoria y debe tener hasta 50 caracteres.';
    }
  
    if (email.value.trim() !== '') {
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!regexEmail.test(email.value.trim())) {
        valido = false;
        email.classList.add('is-invalid');
        document.getElementById('errorEmail').textContent = 'El email ingresado no es válido.';
      }
    }
  
    if (!/^\d+$/.test(duracion.value.trim()) || parseInt(duracion.value.trim()) <= 0) {
      valido = false;
      duracion.classList.add('is-invalid');
      document.getElementById('errorDuracion').textContent = 'La duración debe ser un número mayor a 0.';
    }
  
    return valido;
  }
 