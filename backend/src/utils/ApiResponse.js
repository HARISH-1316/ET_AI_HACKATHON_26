// ============================================================
// ISIP — API Response Utility
// ============================================================

/**
 * Standardized API response wrapper.
 */
class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Send response via Express res object.
   */
  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
      timestamp: this.timestamp,
    });
  }

  // ── Static Factories ────────────────────────────────────

  static ok(res, message = 'Success', data = null) {
    return new ApiResponse(200, message, data).send(res);
  }

  static created(res, message = 'Created successfully', data = null) {
    return new ApiResponse(201, message, data).send(res);
  }

  static noContent(res, message = 'Deleted successfully') {
    return res.status(204).send();
  }

  static paginated(res, message, data, pagination) {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination,
      timestamp: new Date().toISOString(),
    });
  }
}

export default ApiResponse;
