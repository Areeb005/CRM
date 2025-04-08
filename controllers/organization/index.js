const { TblWebSettings } = require("../../models");

const OrganizationController = {
    // Fetch Organization Settings
    get_settings: async (req, res) => {
        try {
            const settings = await TblWebSettings.findOne({ where: { id: 1 } });
            if (!settings) {
                return res.status(404).json({ message: "Organization settings not found" });
            }
            res.json(settings);
        } catch (error) {
            res.status(500).json({ message: "Error fetching organization settings", error });
        }
    },

    // Update Organization Settings
    update_settings: async (req, res) => {
        try {
            const { organization_name, organization_contact, organization_website, notification_email, favicon } = req.body;

            let settings = await TblWebSettings.findOne({ where: { id: 1 } });

            if (!settings) {
                settings = await TblWebSettings.create({
                    organization_name,
                    organization_contact,
                    organization_website,
                    notification_email,
                    favicon,
                });
                return res.status(201).json({ message: "Organization settings created", settings });
            }

            await settings.update({
                organization_name,
                organization_contact,
                organization_website,
                notification_email,
                favicon: favicon || settings.favicon, // Keep existing favicon if not updated
            });

            res.json({ message: "Organization settings updated", settings });
        } catch (error) {
            res.status(500).json({ message: "Error updating organization settings", error });
        }
    },
};

module.exports = OrganizationController;
