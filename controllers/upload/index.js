const Joi = require("joi");
const uploadToRemote = require("../../helpers/uploadToRemote");

const uploadCtrl = {
  // Create a single work type
  upload: async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files were uploaded' });
      }

      const uploadedFiles = [];

      for (const file of req.files) {
        const filename = Date.now() + '-' + file.originalname;
        const result = await uploadToRemote(file.buffer, filename);

        if (result.success) {
          uploadedFiles.push({
            filename,
            originalname: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            remotePath: result.path
          });
        } else {
          return res.status(500).json({ error: `❌ Failed to upload ${file.originalname}`, details: result.error });
        }
      }

      res.status(200).json({
        success: '✅ Files uploaded successfully',
        files: uploadedFiles
      });

    } catch (error) {
      console.error('❌ Upload Error:', error);
      res.status(500).json({ error: 'Upload failed', details: error.message });
    }
  }

};

module.exports = uploadCtrl;
