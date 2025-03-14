const { CaseType } = require("../../models");

const CaseTypeCtrl = {
    // 🔹 Get All Case Types
    get_all_casetypes: async (req, res) => {
        try {
            const caseTypes = await CaseType.findAll();
            if (!caseTypes || caseTypes.length === 0) {
                return res.status(404).json({ success: false, message: "No case types found" });
            }
            res.status(200).json({ success: true, data: caseTypes });
        } catch (error) {
            console.error("Error fetching case types:", error);
            res.status(500).json({ success: false, message: "Error fetching case types", error });
        }
    }
};

module.exports = CaseTypeCtrl;
