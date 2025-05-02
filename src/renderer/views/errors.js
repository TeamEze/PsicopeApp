class ViewModelAPIError extends Error {
    constructor(message = "Ocurrió un error en la API", details = null) {
      super(message);
      this.name = 'ViewModelAPIError';
      this.details = details; // Información adicional sobre el error
    }
  }
  
  export default ViewModelAPIError;