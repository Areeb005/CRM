const { Represent } = require("../../models");

const RepresentCtrl = {
    // 🔹 Get All Case Types
    get_all_represent: async (req, res) => {
        try {
            const represents = await Represent.findAll();
            if (!represents || represents.length === 0) {
                return res.status(404).json({ success: false, message: "No case types found" });
            }
            res.status(200).json({ success: true, data: represents });
        } catch (error) {
            console.error("Error fetching case types:", error);
            res.status(500).json({ success: false, message: "Error fetching case types", error });
        }
    }
};

module.exports = RepresentCtrl;
