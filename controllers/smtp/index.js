const Joi = require("joi");
const { generatePasswordHash } = require("../../helpers/functions");
const { TblWebSettings } = require("../../models");

// Validation Schemas
const createSchema = Joi.object({
    SMTPServer: Joi.string().max(200).required(),
    SMTPPort: Joi.number().required(),
    SMTPUserName: Joi.string().max(100).required(),
    SMTPPassword: Joi.string().min(6).required(),
    SMTPUseTLS: Joi.boolean().required(),
    OrganizationName: Joi.string().max(100).allow(null, ''),
    OrganizationContact: Joi.string().max(100).allow(null, ''),
    OrganizationWebsite: Joi.string().uri().max(100).allow(null, ''),
    NotificationMail: Joi.string().email().max(100).allow(null, '')
});

const updateSchema = Joi.object({
    WebSettingsID: Joi.number().required(),
    SMTPServer: Joi.string().max(200).optional(),
    SMTPPort: Joi.number().optional(),
    SMTPUserName: Joi.string().max(100).optional(),
    SMTPPassword: Joi.string().min(6).optional(),
    SMTPUseTLS: Joi.boolean().optional(),
    OrganizationName: Joi.string().max(100).allow(null, ''),
    OrganizationContact: Joi.string().max(100).allow(null, ''),
    OrganizationWebsite: Joi.string().uri().max(100).allow(null, ''),
    NotificationMail: Joi.string().email().max(100).allow(null, '')
});

const SMTPController = {
    get_settings: async (req, res) => {
        try {
            const settings = await TblWebSettings.findOne({
                order: [["WebSettingsID", "DESC"]],
            });

            if (!settings) {
                return res.status(404).json({ message: "No SMTP settings found" });
            }

            res.json(settings);
        } catch (error) {
            console.error("Error fetching SMTP settings:", error);
            res.status(500).json({ message: "Error fetching SMTP settings", error });
        }
    },

    save_settings: async (req, res) => {
        try {
            const { error, value } = createSchema.validate(req.body);
            if (error) return res.status(400).json({ message: error.details[0].message });

            const {
                SMTPServer,
                SMTPPort,
                SMTPUserName,
                SMTPPassword,
                SMTPUseTLS,
                OrganizationName,
                OrganizationContact,
                OrganizationWebsite,
                NotificationMail,
            } = value;

            const hashedPassword = generatePasswordHash(SMTPPassword, 10);

            const settings = await TblWebSettings.create({
                SMTPServer,
                SMTPPort,
                SMTPUserName,
                SMTPPassword: hashedPassword,
                SMTPUseTLS,
                OrganizationName,
                OrganizationContact,
                OrganizationWebsite,
                NotificationMail,
            });

            res.status(201).json({
                message: "SMTP settings saved successfully",
                settings,
            });
        } catch (error) {
            console.error("Error saving SMTP settings:", error);
            res.status(500).json({ message: "Error saving SMTP settings", error });
        }
    },

    update_settings: async (req, res) => {
        try {
            const { error, value } = updateSchema.validate(req.body);
            if (error) return res.status(400).json({ message: error.details[0].message });

            const {
                WebSettingsID,
                SMTPServer,
                SMTPPort,
                SMTPUserName,
                SMTPPassword,
                SMTPUseTLS,
                OrganizationName,
                OrganizationContact,
                OrganizationWebsite,
                NotificationMail,
            } = value;

            const updateData = {
                SMTPServer,
                SMTPPort,
                SMTPUserName,
                SMTPUseTLS,
                OrganizationName,
                OrganizationContact,
                OrganizationWebsite,
                NotificationMail,
            };

            if (SMTPPassword) {
                updateData.SMTPPassword = generatePasswordHash(SMTPPassword, 10);
            }

            const [updated] = await TblWebSettings.update(updateData, {
                where: { WebSettingsID },
            });

            if (!updated) {
                return res.status(404).json({ message: "SMTP settings not found" });
            }

            res.json({ message: "SMTP settings updated successfully" });
        } catch (error) {
            console.error("Error updating SMTP settings:", error);
            res.status(500).json({ message: "Error updating SMTP settings", error });
        }
    },
};

module.exports = SMTPController;
