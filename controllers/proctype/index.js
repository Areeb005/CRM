const { ProcType } = require("../../models");

const ProcTypeCtrl = {
    // 🔹 Get ProcTypes by CaseType ID
    get_proctypes_by_casetype: async (req, res) => {
        try {
            const { casetypeid } = req.params;

            // Validate input
            if (!casetypeid) {
                return res.status(400).json({ success: false, message: "CaseType ID is required" });
            }

            const procTypes = await ProcType.findAll({ where: { casetypeid } });

            if (!procTypes || procTypes.length === 0) {
                return res.status(404).json({ success: false, message: "No ProcTypes found for this CaseType ID" });
            }

            res.status(200).json({ success: true, data: procTypes });
        } catch (error) {
            console.error("Error fetching ProcTypes:", error);
            res.status(500).json({ success: false, message: "Error fetching ProcTypes", error });
        }
    }
};

module.exports = ProcTypeCtrl;
