const getRemoteFile = require("../../helpers/getRemoteFiles");
const path = require("path");
const fs = require("fs");

const fileCtrl = {
    // getFileByName: async (req, res) => {
    //     const { filename } = req.params;
    //     const { location } = req.query;

    //     const tempDir = path.join(__dirname, "../../temp");

    //     // Ensure temp dir exists
    //     if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    //     const result = await getRemoteFile(filename, tempDir, location);

    //     if (!result.success) {
    //         return res.status(404).json({ error: "File not found", detail: result.error });
    //     }

    //     res.download(result.localPath, filename, (err) => {
    //         // Delete the temp file after response
    //         fs.unlink(result.localPath, () => { });

    //         if (err) {
    //             console.error("❌ Download error:", err);
    //             return res.status(500).json({ error: "Failed to send file" });
    //         }
    //     });
    // }

    getFileByName: async (req, res) => {
        try {
            const { filename } = req.params;

            const { location } = req.query;


            let networkDrivePath = path.join("W:\\", filename);

            if (location == "writeable") {
                networkDrivePath = path.join("W:\\", filename); // 📁 adjust this if files are in a subfolder
            } else if (location == "readable") {
                networkDrivePath = path.join("P:\\", filename); // 📁 adjust this if files are in a subfolder

            }


            // Check if file exists
            if (!fs.existsSync(networkDrivePath)) {
                return res.status(404).json({ error: "❌ File not found on network drive." });
            }

            // Stream file to user
            return res.download(networkDrivePath, filename, (err) => {
                if (err) {
                    console.error("❌ Download error:", err);
                    return res.status(500).json({ error: "Failed to send file" });
                }
            });
        } catch (error) {
            console.error("❌ Server error:", error);
            res.status(500).json({ error: "Something went wrong", details: error.message });
        }
    }
};

module.exports = fileCtrl;
