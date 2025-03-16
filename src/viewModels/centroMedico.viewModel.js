/* import { ref, onMounted } from 'vue';

export function useCentroMedicoViewModel() {
  const centrosMedicos = ref([]);

  const fetchCentrosMedicos = async () => {
    centrosMedicos.value = await window.Electron.getCentrosMedicos();
  };

  onMounted(() => {
    fetchCentrosMedicos();
  });

  return { centrosMedicos };
}
 */
const { ipcRenderer } = require('electron');

async function getCentrosMedicos() {
  return await ipcRenderer.invoke('getCentrosMedicos');
}

module.exports = { getCentrosMedicos };
