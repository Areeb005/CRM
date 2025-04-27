const { ProcAction } = require("../../models");

const ProcActionCtrl = {
    // 🔹 Get All Case Types
    get_all_proc_action: async (req, res) => {
        try {
            const procActions = await ProcAction.findAll();
            if (!procActions || procActions.length === 0) {
                return res.status(404).json({ success: false, message: "No case types found" });
            }
            res.status(200).json({ success: true, data: procActions });
        } catch (error) {
            console.error("Error fetching case types:", error);
            res.status(500).json({ success: false, message: "Error fetching case types", error });
        }
    }
};

module.exports = ProcActionCtrl;
