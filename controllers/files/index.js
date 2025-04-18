const getRemoteFile = require("../../helpers/getRemoteFiles");
const path = require("path");
const fs = require("fs");

const fileCtrl = {
    getFileByName: async (req, res) => {
        const { filename } = req.params;
        const { location } = req.query;

        const tempDir = path.join(__dirname, "../../temp");

        // Ensure temp dir exists
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        const result = await getRemoteFile(filename, tempDir, location);

        if (!result.success) {
            return res.status(404).json({ error: "File not found", detail: result.error });
        }

        res.download(result.localPath, filename, (err) => {
            // Delete the temp file after response
            fs.unlink(result.localPath, () => { });

            if (err) {
                console.error("❌ Download error:", err);
                return res.status(500).json({ error: "Failed to send file" });
            }
        });
    }
};

module.exports = fileCtrl;
