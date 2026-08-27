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

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json(new ApiResponse(200, 'Users fetched successfully', users));
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    res.status(200).json(new ApiResponse(200, 'User details fetched', user));
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = await adminService.createUser(req.user.userId, req.body);
    res.status(201).json(new ApiResponse(201, 'User created successfully', user));
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await adminService.updateUser(req.user.userId, req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, 'User updated successfully', user));
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const user = await adminService.updateUserRole(req.user.userId, req.params.id, req.body.role);
    res.status(200).json(new ApiResponse(200, 'User role updated successfully', user));
  } catch (error) {
    next(error);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const user = await adminService.updateUserStatus(req.user.userId, req.params.id, req.body.isActive);
    res.status(200).json(new ApiResponse(200, 'User status updated successfully', user));
  } catch (error) {
    next(error);
  }
};

exports.resetUserPassword = async (req, res, next) => {
  try {
    const result = await adminService.resetUserPassword(req.user.userId, req.params.id, req.body.password);
    res.status(200).json(new ApiResponse(200, result.message, result));
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const result = await adminService.deleteUser(req.user.userId, req.params.id);
    res.status(200).json(new ApiResponse(200, result.message, result));
  } catch (error) {
    next(error);
  }
};

