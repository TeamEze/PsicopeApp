const ErrorLog = require('../models/errorLog.model.js');

class ErrorLogRepository {
  async logError(errorLog) {
    await ErrorLog.create(errorLog);
  }
}

module.exports = new ErrorLogRepository();