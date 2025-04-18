const SftpClient = require('ssh2-sftp-client');
const path = require('path');

const uploadToRemote = async (buffer, filename) => {
    const sftp = new SftpClient();

    try {

        await sftp.connect({
            host: process.env.SFTP_HOST,
            port: process.env.SFTP_PORT,
            username: process.env.SFTP_USERNAME,
            password: process.env.SFTP_PASSWORD // OR use privateKey instead
        });



        const remoteDir = 'C:/Users/FS_IT/Desktop/uploads/writeable';
        const remotePath = path.join(remoteDir, filename).replace(/\\/g, '/');


        console.log(`✅ Uploaded to: ${remotePath}`);

        await sftp.put(buffer, remotePath);

        // Wrap .end() to prevent crashing on ECONNRESET
        try {
            await sftp.end();
        } catch (endErr) {
            console.warn("⚠️ SFTP connection closed unexpectedly after upload. Safe to ignore.");
        }

        return { success: true, path: remotePath };
    } catch (err) {
        console.error('❌ SFTP Upload Error:', err);
        return { success: false, error: err.message };
    }
};

module.exports = uploadToRemote;
