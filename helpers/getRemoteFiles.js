const SftpClient = require('ssh2-sftp-client');
const fs = require('fs');
const path = require('path');

const getRemoteFile = async (filename, localTempPath, location) => {
    const sftp = new SftpClient();

    try {
        await sftp.connect({
            host: process.env.SFTP_HOST,
            port: process.env.SFTP_PORT,
            username: process.env.SFTP_USERNAME,
            password: process.env.SFTP_PASSWORD // OR use privateKey instead
        });


        let remotePath = `C:/Users/FS_IT/Desktop/uploads/writeable/${filename}`;

        if (location === "writeable") {
            remotePath = `C:/Users/FS_IT/Desktop/uploads/writeable/${filename}`;
        } else if (location === "readable") {
            remotePath = `C:/Users/FS_IT/Desktop/uploads/readable/${filename}`;
        }

        const localPath = path.join(localTempPath, filename);

        await sftp.fastGet(remotePath, localPath); // download to local temp
        // Wrap .end() to prevent crashing on ECONNRESET
        try {
            await sftp.end();
        } catch (endErr) {
            console.warn("⚠️ SFTP connection closed unexpectedly after upload. Safe to ignore.");
        }

        return { success: true, localPath };
    } catch (err) {
        console.error('❌ SFTP fetch error:', err);
        return { success: false, error: err.message };
    }
};

module.exports = getRemoteFile;
