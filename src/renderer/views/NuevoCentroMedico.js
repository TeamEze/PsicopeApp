import ViewModelAPIError from './errors.js';

let isEditing = false;
let editingCentroMedicoId = null;
let form = null;

const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function mostrarEstiloValido(campo, msjError){
  campo.classList.remove('is-invalid');
  campo.classList.add('is-valid');
  if (msjError && msjError.classList.contains('invalid-feedback')) {
    msjError.style.display = 'none';
  }
}

function mostrarEstiloInvalido(campo, msjError){
  campo.classList.remove('is-valid');
  campo.classList.add('is-invalid');
  if (msjError && msjError.classList.contains('invalid-feedback')) {
    msjError.style.display = 'block';
  }
}

function duracionCumpleCondiciones(duracion){
  if (duracion.trim() === '' || parseInt(duracion, 10) <= 0 || parseInt(duracion, 10) > 60){
    return false;
  }
  return true;
}

function validarDuracion(duracion, msjError) {
  if (!duracionCumpleCondiciones(duracion.value)) {
    duracion.setCustomValidity('Inválido');
    msjError.textContent = 'La duración debe ser mayor a 0 y menor o igual a 60 (min).';
    mostrarEstiloInvalido(duracion, msjError);
  } else {
    duracion.setCustomValidity('');
    msjError.textContent = '';
    mostrarEstiloValido(duracion, msjError);
  }
}

function validarEmail(email, msjError) {
  if (email.value.trim() === "" || regexEmail.test(email.value.trim())) {
    email.setCustomValidity('');
    mostrarEstiloValido(email, msjError);
  } else {
    email.setCustomValidity('Email inválido');
    mostrarEstiloInvalido(email, msjError);
  }
}

function validarCampo(campo) {
  const msjError = campo.nextElementSibling;

  if (campo.id === 'txtEmail') {
    validarEmail(campo, msjError);
    return;
  }

  if (campo.id === 'nbDuracion') {
    validarDuracion(campo, msjError);
    return;
  }

  // Validación genérica para otros campos
  if (campo.validity.valid) {
    mostrarEstiloValido(campo, msjError);
  } else {
    mostrarEstiloInvalido(campo, msjError);
  }
}

function validarFormulario() {
  const campos = form.querySelectorAll('input, select');
  let formularioValido = true;

  campos.forEach(campo => {
    validarCampo(campo); 
    if (!campo.validity.valid) {
      formularioValido = false;
    }
  });

  return formularioValido;
}

// Obtiene los datos del formulario
function obtenerDatosFormulario() {
  return {
    idCentroMedico: editingCentroMedicoId,
    nombre: document.getElementById('txtNombre').value,
    direccion: document.getElementById('txtDireccion').value,
    idLocalidad: parseInt(document.getElementById('cboLocalidad').value, 10),
    telefono: document.getElementById('txtTelefono').value,
    personaContacto: document.getElementById('txtPersonaContacto').value,
    email: document.getElementById('txtEmail').value,
    duracionSesion: parseInt(document.getElementById('nbDuracion').value, 10),
    idEstado: 1
  };
}

function limpiarFormulario() {
  form.reset();
  form.classList.remove('was-validated');
  const campos = form.querySelectorAll('.form-control, .form-select');
  campos.forEach(campo => campo.classList.remove('is-valid', 'is-invalid'));
  const mensajesError = form.querySelectorAll('.invalid-feedback');
  mensajesError.forEach(msg => (msg.style.display = 'none'));
}

function cancelarFormulario() {
  isEditing = false;
  editingCentroMedicoId = null;
  window.viewModelAPI.hideNuevoCentroMedicoModal();
}

window.viewModelAPI.onSolicitarCancelar(() => {
  cancelarFormulario();
});

window.viewModelAPI.clearForm(() => {
  if (form) {
    form.reset(); // Limpia todos los controles del formulario
    limpiarFormulario(); // Limpia las validaciones y estilos 
  }
});

// Maneja el evento de edición de un centro médico
window.viewModelAPI.onEditarCentroMedico(async (event, idCentroMedico) => {
  try {
    isEditing = true;
    editingCentroMedicoId = idCentroMedico;

    limpiarFormulario();

    const resultado = await window.viewModelAPI.getCentroMedicoById(idCentroMedico);
    if (!resultado.ok) throw new ViewModelAPIError();

    const centroMedico = resultado.data;
    document.getElementById('txtNombre').value = centroMedico.nombre;
    document.getElementById('txtDireccion').value = centroMedico.direccion;
    document.getElementById('cboLocalidad').value = centroMedico.idLocalidad;
    document.getElementById('txtTelefono').value = centroMedico.telefono;
    document.getElementById('txtPersonaContacto').value = centroMedico.personaContacto;
    document.getElementById('txtEmail').value = centroMedico.email;
    document.getElementById('nbDuracion').value = centroMedico.duracionSesion;
  } catch (error) {
    if (error instanceof ViewModelAPIError) {
      console.error('Error en ViewModelAPI.getCentroMedicoById:');
      window.viewModelAPI.mostrarErrorGenerico("Error al obtener datos del centro médico. Por favor, contacte al administrador.");
    }
    else {
      console.error('Error genérico al obtener datos del centro médico', error);
      window.viewModelAPI.mostrarErrorGenerico('Error inesperado al obtener datos del centro médico. Por favor, contacte al administrador.');
      loguearError(error, 'NuevoCentroMedico.js - onEditarCentroMedico');
    }
  }
});

async function cargarLocalidades() {
  try {
    const cboLocalidad = document.getElementById('cboLocalidad');
    cboLocalidad.innerHTML = '';

    // Agregar opción por defecto
    const optionDefault = document.createElement('option');
    optionDefault.value = '';
    optionDefault.textContent = 'Seleccione Localidad';
    cboLocalidad.appendChild(optionDefault);

    const resultado = await window.viewModelAPI.getAllLocalidades(); 
    if (!resultado.ok) throw new ViewModelAPIError();

    const localidades = resultado.data; 
    localidades.forEach(localidad => {
        const option = document.createElement('option');
        option.value = localidad.idLocalidad;
        option.textContent = localidad.descripcion;
        cboLocalidad.appendChild(option);
    });
  } catch (error) {
    if (error instanceof ViewModelAPIError) {
      console.error('Error en ViewModelAPI.getAllLocalidades:');
      window.viewModelAPI.mostrarErrorGenerico("Ocurrió un error al cargar las localidades. Por favor, contacte al administrador.");
    }
    else {
      console.error('Error genérico al cargar localidades:', error);
      window.viewModelAPI.mostrarErrorGenerico('Error inesperado al cargar las localidades. Por favor, contacte al administrador.');
      loguearError(error, 'NuevoCentroMedico.js - cargarLocalidades');
    }
  }
  
}

async function manejarEnvioFormularioCentroMedico(event) {
  try {
    event.preventDefault();
    if (!validarFormulario()) return;

    const centroMedico = obtenerDatosFormulario();
    if (isEditing) {
      const resultado = await window.viewModelAPI.updateCentroMedico(centroMedico);
      if (!resultado.ok) throw new ViewModelAPIError();
      window.viewModelAPI.sendCentroMedicoEdited(resultado.data);
      isEditing = false;
      editingCentroMedicoId = null;
    } else {
      window.viewModelAPI.sendNuevoCentroMedico(centroMedico);
    }

    limpiarFormulario();
    window.viewModelAPI.hideNuevoCentroMedicoModal();
  } catch (error) {
    if (error instanceof ViewModelAPIError) {
      console.error('Error en ViewModelAPI.updateCentroMedico:');
      window.viewModelAPI.mostrarErrorGenerico('Error al procesar el formulario. Por favor, contacte al administrador.');
    } else {
      console.error('Error genérico en el formulario:', error);
      window.viewModelAPI.mostrarErrorGenerico('Error inesperado al procesar el formulario. Por favor, contacte al administrador.');
      loguearError(error, 'NuevoCentroMedico.js - submit form');
    }
  }
}



function inicializarFormulario() {
  form = document.getElementById('frmNuevoCentroMedico');
  const campos = form.querySelectorAll('input, select');
  campos.forEach(campo => {
    const evento = campo.tagName === 'SELECT' ? 'change' : 'input';
    campo.addEventListener(evento, () => validarCampo(campo));
  });

  document.getElementById('btnCancelarCentroMedico').addEventListener('click', cancelarFormulario);
  form.addEventListener('submit', manejarEnvioFormularioCentroMedico);
  cargarLocalidades();
}

// Inicializa el formulario al cargar la página
inicializarFormulario();