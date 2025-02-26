// Import dependencies
const express = require('express');
const { Op } = require('sequelize');
const { Order, User, ActivityLog, Participant, DocumentLocation } = require('../../models');
const sequelize = require('../../config/dbConfig');


const dashboardCtrl = {


    dashboardOverview: async (req, res) => {
        try {
            // Default near deadline days to 2 if not provided
            const { days = 2, fromDate, toDate } = req.query;
            const currentDate = new Date();
            const upcomingDate = new Date();
            upcomingDate.setDate(currentDate.getDate() + parseInt(days));

            // Set default date range for trends (last 7 days)
            const startDate = fromDate ? new Date(fromDate) : new Date(currentDate.setDate(currentDate.getDate() - 6));
            const endDate = toDate ? new Date(toDate) : new Date();

            // Fetch all required data in parallel
            const [
                totalOrders,
                orderStatuses,
                urgentOrders,
                pendingOrders,
                // pendingCancellations,
                cancelledOrders,
                ordersOnTime,
                // pendingApprovals,
                missedDeadlines,
                participantCount,
                documentLocationCount,
                // nearDeadlineOrders,
                recentActivities,
                recentOrders,
                orderTrends,
                ordersNearingDeadline
            ] = await Promise.all([
                Order.count(), // Total orders count

                Order.findAll({ // Order status count
                    attributes: ["status", [sequelize.fn("COUNT", sequelize.col("status")), "count"]],
                    group: ["status"],
                }),

                Order.count({ where: { urgent: true } }), // Urgent orders count

                Order.count({ where: { status: "In Progress" } }), // Pending orders count

                // Order.count({ where: { status: "pending_cancellation" } }), // Pending cancellation count

                Order.count({ where: { status: "Cancelled" } }), // Cancelled orders count

                // Order.count({ where: { status: "approved" } }), // Pending approvals count

                // Orders On Time Percentage Calculation
                (async () => {
                    const totalCompletedOrders = await Order.count({ where: { status: "Completed" } });
                    const onTimeOrders = await Order.count({
                        where: {
                            status: "Completed",
                            completed_at: { [Op.lte]: sequelize.col("needed_by") }
                        }
                    });
                    return totalCompletedOrders > 0 ? ((onTimeOrders / totalCompletedOrders) * 100).toFixed(2) : "0";
                })(),

                Order.count({
                    where: { needed_by: { [Op.lt]: currentDate } },
                    order: [["createdAt", "DESC"]],
                    limit: 10,
                }), // Missed deadline orders count

                Participant.count(), // Participant count

                DocumentLocation.count(), // Document location count


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

                // Fetch order trends for the last few days
                (async () => {
                    const orderPlaced = await Order.findAll({
                        attributes: [
                            [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
                            [sequelize.fn("COUNT", sequelize.col("id")), "count"]
                        ],
                        where: { createdAt: { [Op.between]: [startDate, endDate] } },
                        group: ["date"],
                        order: [["date", "ASC"]],
                    });

                    const documentUploaded = await DocumentLocation.findAll({
                        attributes: [
                            [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
                            [sequelize.fn("COUNT", sequelize.col("id")), "count"]
                        ],
                        where: { createdAt: { [Op.between]: [startDate, endDate] } },
                        group: ["date"],
                        order: [["date", "ASC"]],
                    });

                    const orderCompleted = await Order.findAll({
                        attributes: [
                            [sequelize.fn("DATE", sequelize.col("completed_at")), "date"],
                            [sequelize.fn("COUNT", sequelize.col("id")), "count"]
                        ],
                        where: {
                            status: "Completed",
                            completed_at: { [Op.between]: [startDate, endDate] }
                        },
                        group: ["date"],
                        order: [["date", "ASC"]],
                    });

                    return {
                        orderPlaced,
                        documentUploaded,
                        orderCompleted,
                    };
                })(),

                // Orders Nearing Deadline Over Time (For Graph)
                (async () => {
                    const nextWeek = new Date();
                    nextWeek.setDate(currentDate.getDate() + 30); // Get date 7 days ahead

                    const results = await Order.findAll({
                        attributes: [
                            [sequelize.fn("DATE", sequelize.col("needed_by")), "date"],
                            [sequelize.fn("COUNT", sequelize.col("id")), "count"]
                        ],
                        where: {
                            needed_by: { [Op.between]: [currentDate, nextWeek] }, // Orders due in the next 7 days
                            status: { [Op.notIn]: ["Completed", "Cancelled"] } // Exclude completed/cancelled orders
                        },
                        group: ["date"],
                        order: [["date", "ASC"]],
                        raw: true // Ensure raw output (avoids unnecessary metadata)
                    });

                    return results; // Will return only [{ date: "YYYY-MM-DD", count: N }]
                })()
            ]);

            // Send response
            res.json({
                totalOrders,
                orderStatuses,
                urgentOrders,
                pendingOrders,
                // pendingCancellations,
                cancelledOrders,
                // pendingApprovals,
                ordersOnTime: `${ordersOnTime}%`,
                missedDeadlines,
                participantCount,
                documentLocationCount,
                // nearDeadlineOrders,
                recentActivities,
                recentOrders,
                orderTrends,
                ordersNearingDeadline // New Data for Graph
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
            const overdueOrders = await Order.findAll({ where: { needed_by: { [Op.lt]: new Date() }, status: { [Op.ne]: 'Completed' } } });
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
