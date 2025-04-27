const { Supword } = require("../../models");

const SupwordsCtrl = {
    // 🔹 Get All Case Types
    get_all_supwords: async (req, res) => {
        try {
            const supwords = await Supword.findAll({
                attributes: ["Word_ID", "Word_Name"]
            });
            if (!supwords || supwords.length === 0) {
                return res.status(404).json({ success: false, message: "No case types found" });
            }
            res.status(200).json({ success: true, data: supwords });
        } catch (error) {
            console.error("Error fetching case types:", error);
            res.status(500).json({ success: false, message: "Error fetching case types", error });
        }
    }
};

module.exports = SupwordsCtrl;
