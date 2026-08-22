class ApiResponse {
  constructor(statusCode, message = 'Success', data = null, pagination = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    
    if (data !== null) {
      this.data = data;
    }

    if (pagination) {
      this.pagination = pagination;
    }
  }
}

module.exports = ApiResponse;
