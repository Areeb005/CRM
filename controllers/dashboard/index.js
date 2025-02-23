// Import dependencies
const express = require('express');
const { Op } = require('sequelize');
const { Order, User, ActivityLog, Participant, DocumentLocation } = require('../../models');
const sequelize = require('../../config/dbConfig');


const dashboardCtrl = {


    dashboardOverview: async (req, res) => {
        try {
            // Default near deadline days to 2 if not provided
            const { days = 2 } = req.query;
            const currentDate = new Date();
            const upcomingDate = new Date();
            upcomingDate.setDate(currentDate.getDate() + parseInt(days));

            // Fetch all required data in parallel
            const [
                totalOrders,
                orderStatuses,
                urgentOrders,
                missedDeadlines,
                participantCount,
                documentLocationCount,
                nearDeadlineOrders,
                recentActivities,
                recentOrders
            ] = await Promise.all([
                Order.count(), // Total orders count

                Order.findAll({ // Order status count
                    attributes: ["status", [sequelize.fn("COUNT", sequelize.col("status")), "count"]],
                    group: ["status"],
                }),

                Order.count({ where: { urgent: true } }), // Urgent orders count

                Order.count({ where: { needed_by: { [Op.lt]: currentDate } } }), // Missed deadline orders count

                Participant.count(), // Participant count

                DocumentLocation.count(), // Document location count

                Order.findAll({ // Near deadline orders
                    where: { needed_by: { [Op.between]: [currentDate, upcomingDate] } },
                    order: [["needed_by", "ASC"]],
                }),

                ActivityLog.findAll({ // Recent activities
                    order: [["createdAt", "DESC"]],
                    limit: 10,
                }),

                Order.findAll({ // Recent orders
                    order: [["createdAt", "DESC"]],
                    limit: 10,
                    include: [
                        { model: User, as: "orderByUser", attributes: ["username"] },
                        { model: User, as: "createdByUser", attributes: ["username"] },
                        { model: User, as: "updatedByUser", attributes: ["username"] },
                    ],
                }),
            ]);

            // Send response
            res.json({
                totalOrders,
                orderStatuses,
                urgentOrders,
                missedDeadlines,
                participantCount,
                documentLocationCount,
                nearDeadlineOrders,
                recentActivities,
                recentOrders,
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            res.status(500).json({ message: "Error fetching dashboard data", error });
        }
    },

    // Dashboard Overview API
    overview: async (req, res) => {
        try {
            const totalOrders = await Order.count();
            const orderStatuses = await Order.findAll({
                attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
                group: ['status'],
            });

            const urgentOrders = await Order.count({ where: { urgent: true } });
            const missedDeadlines = await Order.count({ where: { needed_by: { [Op.lt]: new Date() } } });
            const participantCount = await Participant.count();
            const documentLocationCount = await DocumentLocation.count();

            res.json({ totalOrders, orderStatuses, urgentOrders, missedDeadlines, participantCount, documentLocationCount });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching dashboard data', error });
        }
    },

    nearDeadline: async (req, res) => {
        try {
            const { days = 2 } = req.query; // Default to 2 days if not provided
            const currentDate = new Date();
            const upcomingDate = new Date();
            upcomingDate.setDate(currentDate.getDate() + parseInt(days));

            const nearDeadlineOrders = await Order.findAll({
                where: {
                    needed_by: {
                        [Op.between]: [currentDate, upcomingDate],
                    },
                },
                order: [["needed_by", "ASC"]],
            });

            res.json({ nearDeadlineOrders });
        } catch (error) {
            res.status(500).json({ message: "Error fetching near-deadline orders", error });
        }
    },

    // Recent Activity API
    recent_activities: async (req, res) => {
        try {
            const activities = await ActivityLog.findAll({
                order: [['createdAt', 'DESC']],
                limit: 10,
            });
            res.json(activities);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching activities', error });
        }
    },

    // Recent Orders API
    recent_orders: async (req, res) => {
        try {
            const orders = await Order.findAll({
                order: [['createdAt', 'DESC']],
                limit: 10,
                include: [
                    { model: User, as: "orderByUser", attributes: ["username"] },
                    { model: User, as: "createdByUser", attributes: ["username"] },
                    { model: User, as: "updatedByUser", attributes: ["username"] },
                ],
            });

            res.json(orders);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Error fetching orders', error });
        }
    },

    // Cron Job for Missed Deadlines
    checkMissedDeadlines: async () => {
        try {
            const overdueOrders = await Order.findAll({ where: { needed_by: { [Op.lt]: new Date() }, status: { [Op.ne]: 'completed' } } });
            for (const order of overdueOrders) {
                await ActivityLog.create({ order_id: order.id, action_type: 'order_deadline_missed', description: `Order {${order.id}} missed its deadline.` });
            }
            console.log('Checked missed deadlines');
        } catch (error) {
            console.error('Error checking missed deadlines', error);
        }
    }


}

// Run every hour
setInterval(dashboardCtrl.checkMissedDeadlines, 60 * 60 * 1000);


module.exports = dashboardCtrl;
