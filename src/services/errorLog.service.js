class ErrorLogService {
    constructor(errorLogRepository) {
      this.errorLogRepository = errorLogRepository;
    }
  
    async handleError(message, parameters, stack, source) {
      const errorData = {
        message: message || 'Error no especificado',
        parameters: parameters || null,
        stack: stack || null,
        source: source || null,
      };
      await this.errorLogRepository.logError(errorData);
    }
  }
  
  module.exports = ErrorLogService;