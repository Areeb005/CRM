// Import dependencies
const { Op } = require('sequelize');
const sequelize = require('../../config/dbConfig');
const { Location, Customer, Court } = require('../../models');


const locationCtrl = {


    get_locations: async (req, res) => {
        try {
            const { locat_name, locat_city } = req.query;

            if ((!locat_name || locat_name.length < 3) && (!locat_city || locat_city.length < 3)) {
                return res.status(400).json({ error: "Either 'locat_name' and 'locat_city' must be at least 3 characters long." });
            }

            const locations = await Location.findAll({
                attributes: [
                    "locat_name",
                    "locat_address",
                    "locat_city",
                    "locat_state",
                    "locat_zip",
                    "locatid"
                ],
                where: {
                    [Op.or]: [
                        locat_name ? { locat_name: { [Op.like]: `%${locat_name}%` } } : null,
                        locat_name ? { locat_city: { [Op.like]: `%${locat_name}%` } } : null,
                        locat_name ? { locat_address: { [Op.like]: `%${locat_name}%` } } : null,
                    ]
                },
                order: [
                    ["locat_name", "ASC"]
                ],
                limit: 10
            });

            res.json({ data: locations });
        } catch (error) {
            console.error("Error fetching locations:", error);
            res.status(500).json({ error: "Server error" });
        }
    },
    get_customers: async (req, res) => {
        try {
            const { locat_name, locat_city } = req.query;

            if ((!locat_name || locat_name.length < 3) && (!locat_city || locat_city.length < 3)) {
                return res.status(400).json({ error: "Either 'locat_name' and 'locat_city' must be at least 3 characters long." });
            }

            const locations = await Customer.findAll({
                attributes: ["custcode", "acctno", "active", "locatid"],
                where: {
                    active: 1, // Equivalent to `Customer.Active = 1`
                },
                include: [
                    {
                        model: Location,
                        attributes: [
                            "locat_name",
                            "locat_address",
                            "locat_city",
                            "locat_state",
                            "locat_zip",
                            "locatid"
                        ],
                        where: {
                            [Op.or]: [
                                locat_name ? { locat_name: { [Op.like]: `%${locat_name}%` } } : null,
                                locat_name ? { locat_city: { [Op.like]: `%${locat_name}%` } } : null,
                                locat_name ? { locat_address: { [Op.like]: `%${locat_name}%` } } : null,
                            ]
                        },
                        as: "location"
                    }
                ],
                order: [
                    ["custcode", "ASC"]
                ],
                limit: 10
            });

            res.json({ data: locations });
        } catch (error) {
            console.error("Error fetching locations:", error);
            res.status(500).json({ error: "Server error" });
        }
    },
    get_courts: async (req, res) => {
        try {
            const { locat_name, locat_city } = req.query;

            if ((!locat_name || locat_name.length < 3) && (!locat_city || locat_city.length < 3)) {
                return res.status(400).json({ error: "Either 'locat_name' and 'locat_city' must be at least 3 characters long." });
            }

            const locations = await Court.findAll({
                attributes: ["court_id", "court_type", "CourtTypeId", "branchid", "locatid"],
                include: [
                    {
                        model: Location,
                        attributes: [
                            "locat_name",
                            "locat_address",
                            "locat_city",
                            "locat_state",
                            "locat_zip",
                            "locatid"
                        ],
                        where: {
                            [Op.or]: [
                                locat_name ? { locat_name: { [Op.like]: `%${locat_name}%` } } : null,
                                locat_name ? { locat_city: { [Op.like]: `%${locat_name}%` } } : null,
                                locat_name ? { locat_address: { [Op.like]: `%${locat_name}%` } } : null,
                            ]
                        },
                        as: "location"
                    }
                ],
                order: [
                    ["court_id", "ASC"]
                ],
                limit: 10
            });

            res.json({ data: locations });
        } catch (error) {
            console.error("Error fetching locations:", error);
            res.status(500).json({ error: "Server error" });
        }
    },

}


module.exports = locationCtrl;
