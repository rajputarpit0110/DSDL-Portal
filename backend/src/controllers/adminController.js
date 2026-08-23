const adminService = require('../services/adminService');
const ApiResponse = require('../utils/apiResponse');

exports.getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats(req.user.userId);
    res.status(200).json(new ApiResponse(200, 'Admin stats fetched', stats));
  } catch (error) {
    next(error);
  }
};

exports.getAuditLogs = async (req, res, next) => {
  try {
    const logs = await adminService.getAuditLogs();
    res.status(200).json(new ApiResponse(200, 'Audit logs fetched', logs));
  } catch (error) {
    next(error);
  }
};

exports.exportReport = async (req, res, next) => {
  try {
    const csv = await adminService.exportReport();
    res.header('Content-Type', 'text/csv');
    res.attachment('dsdl-report.csv');
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};
