function ejecutarImportes() {
  const parametros = window.parametrosImportes || {};
  const idCentroMedico = parametros.idCentroMedico;

  if (!idCentroMedico) {
    console.warn('No se recibió idCentroMedico');
  } else {
    console.log('Cargando importes para centro médico ID:', idCentroMedico);
  }

  const tblImportes = document.getElementById('tblImportes');
  if (!tblImportes) {
    console.warn('tblImportes no encontrado, reintentando...');
    setTimeout(ejecutarImportes, 50);
    return;
  }

  const datosImportes = [
    { concepto: 'Consulta', monto: 1500, fecha: '2025-05-01' },
    { concepto: 'Terapia', monto: 2000, fecha: '2025-05-02' },
  ];

  datosImportes.forEach((importe) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${importe.concepto}</td>
      <td>${importe.monto}</td>
      <td>${importe.fecha}</td>
      <td>
        <button class="btn btn-sm btn-primary">Editar</button>
        <button class="btn btn-sm btn-danger">Eliminar</button>
      </td>
    `;
    tblImportes.querySelector('tbody').appendChild(fila);
  });
}
ejecutarImportes();
