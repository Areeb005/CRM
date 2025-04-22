const Joi = require("joi");
const path = require("path");
const fs = require("fs");
const uploadToRemote = require("../../helpers/uploadToRemote");

const uploadCtrl = {
  // Create a single work type
  // upload: async (req, res) => {
  //   try {
  //     if (!req.files || req.files.length === 0) {
  //       return res.status(400).json({ error: 'No files were uploaded' });
  //     }

  //     const uploadedFiles = [];

  //     for (const file of req.files) {
  //       const filename = Date.now() + '-' + file.originalname;
  //       const result = await uploadToRemote(file.buffer, filename);

  //       if (result.success) {
  //         uploadedFiles.push({
  //           filename,
  //           originalname: file.originalname,
  //           size: file.size,
  //           mimetype: file.mimetype,
  //           remotePath: result.path
  //         });
  //       } else {
  //         return res.status(500).json({ error: `❌ Failed to upload ${file.originalname}`, details: result.error });
  //       }
  //     }

  //     res.status(200).json({
  //       success: '✅ Files uploaded successfully',
  //       files: uploadedFiles
  //     });

  //   } catch (error) {
  //     console.error('❌ Upload Error:', error);
  //     res.status(500).json({ error: 'Upload failed', details: error.message });
  //   }
  // }


  upload: async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files were uploaded' });
      }

      const uploadedFiles = [];
      const networkDir = 'W:\\'; // Make sure this is accessible by the Node.js process

      for (const file of req.files) {
        const filename = `${Date.now()}-${file.originalname}`;
        const fullPath = path.join(networkDir, filename);

        // Write buffer directly to W:\
        await fs.promises.writeFile(fullPath, file.buffer);

        uploadedFiles.push({
          filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          savedTo: fullPath
        });
      }

      res.status(200).json({
        success: '✅ Files uploaded to W:\\ successfully',
        files: uploadedFiles
      });

    } catch (error) {
      console.error('❌ Upload Error:', error);
      res.status(500).json({ error: 'Upload failed', details: error.message });
    }
  }
};

module.exports = uploadCtrl;
