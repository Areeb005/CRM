const { generatePasswordHash } = require("../../helpers/functions");
const SMTPSettings = require("../../models/smtp_model");

const SMTPController = {
    get_settings: async (req, res) => {
        try {
            const settings = await SMTPSettings.findOne({ order: [["id", "DESC"]] });
            if (!settings) return res.status(404).json({ message: "No SMTP settings found" });

            res.json(settings);
        } catch (error) {
            res.status(500).json({ message: "Error fetching SMTP settings", error });
        }
    },

    save_settings: async (req, res) => {
        try {
            const { smtp_server, smtp_port, smtp_username, smtp_password, use_tls } = req.body;

            // Encrypt password before storing
            const hashedPassword = generatePasswordHash(smtp_password, 10);

            const settings = await SMTPSettings.create({
                smtp_server,
                smtp_port,
                smtp_username,
                smtp_password: hashedPassword,
                use_tls,
            });

            res.status(201).json({ message: "SMTP settings saved successfully", settings });
        } catch (error) {
            res.status(500).json({ message: "Error saving SMTP settings", error });
        }
    },

    update_settings: async (req, res) => {
        try {
            const { smtp_server, smtp_port, smtp_username, smtp_password, use_tls } = req.body;

            let updateData = { smtp_server, smtp_port, smtp_username, use_tls };
            if (smtp_password) {
                updateData.smtp_password = generatePasswordHash(smtp_password, 10);
            }

            const [updated] = await SMTPSettings.update(updateData, { where: { id: 1 } });

            if (!updated) return res.status(404).json({ message: "SMTP settings not found" });

            res.json({ message: "SMTP settings updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error updating SMTP settings", error });
        }
    },
};

module.exports = SMTPController;
