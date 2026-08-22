const ApiResponse = require('../utils/apiResponse');

const uploadController = {
  uploadFile: (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json(new ApiResponse(400, 'No file uploaded'));
      }
      
      // Construct the public URL
      const fileUrl = `/uploads/${req.file.filename}`;
      
      res.status(200).json(new ApiResponse(200, 'File uploaded successfully', {
        url: fileUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      }));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = uploadController;
