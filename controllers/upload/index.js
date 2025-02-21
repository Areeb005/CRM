const Joi = require("joi");

const uploadCtrl = {
  // Create a single work type
  upload: async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files were uploaded' });
      }

      // Process uploaded files
      const uploadedFiles = req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        path: file.path
      }));

      // Here you would typically save file information to your database
      // For example: await File.create(uploadedFiles);

      res.status(200).json({
        success: 'Files uploaded successfully',
        files: uploadedFiles
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'File upload failed', details: error.message });
    }
  },

};

module.exports = uploadCtrl;
