// Import dependencies
const express = require('express');
const { Op } = require('sequelize');
const { Order, User, ActivityLog, Participant, DocumentLocation, TblOrder, tblOrderCaseParties, TblOrderDocLocation } = require('../../models');
const sequelize = require('../../config/dbConfig');
const formatDate = (date) => date.toISOString().split("T")[0]; // => 'YYYY-MM-DD'


const dashboardCtrl = {


    dashboardOverview: async (req, res) => {
        try {
            const { days = 2, fromDate, toDate } = req.query;
            const currentDate = new Date();
            const upcomingDate = new Date();
            upcomingDate.setDate(currentDate.getDate() + parseInt(days));

            const startDate = fromDate ? new Date(fromDate) : new Date(new Date().setDate(currentDate.getDate() - 6));
            const endDate = toDate ? new Date(toDate) : new Date();


            const [
                totalOrders,
                orderStatuses,
                urgentOrders,
                activeOrders,
                completedOrders,
                cancelledOrders,
                ordersOnTime,
                missedDeadlines,
                participantCount,
                documentLocationCount,
                recentActivities,
                recentOrders,
                orderTrends,
                ordersNearingDeadline,
                topTenUrgentOrders,
            ] = await Promise.all([
                TblOrder.count(),

                (async () => {
                    const defaultData = [
                        { RequestStatus: "Active", count: 0 },
                        { RequestStatus: "Completed", count: 0 },
                        { RequestStatus: "Cancelled", count: 0 }
                    ];

                    let data = await TblOrder.findAll({
                        attributes: ["RequestStatus", [sequelize.fn("COUNT", sequelize.col("RequestStatus")), "count"]],
                        group: ["RequestStatus"],
                        raw: true
                    });

                    return defaultData.map(d => {
                        const found = data.find(item => item.RequestStatus === d.RequestStatus);
                        return found || d;
                    });
                })(),

                TblOrder.count({ where: { IsRush: true } }),
                TblOrder.count({ where: { RequestStatus: "Active" } }),
                TblOrder.count({ where: { RequestStatus: "Completed" } }),
                TblOrder.count({ where: { RequestStatus: "Cancelled" } }),

                TblOrder.count({
                    where: {
                        RequestStatus: "Completed",
                        CompletedDate: { [Op.lte]: sequelize.col("NeededBy") }
                    }
                }),

                TblOrder.count({
                    where: { NeededBy: { [Op.lt]: currentDate } }
                }),

                tblOrderCaseParties.count(),
                TblOrderDocLocation.count(),

                ActivityLog.findAll({
                    order: [["CreatedAt", "DESC"]],
                    limit: 10,
                }),

                TblOrder.findAll({
                    order: [["OrderID", "DESC"]],
                    limit: 10,
                    include: [
                        { model: User, as: "orderByUser", attributes: ["UserName"] },
                        { model: User, as: "createdByUser", attributes: ["UserName"] },
                    ]
                }),

                (async () => {


                    const orderPlaced = await TblOrder.findAll({
                        attributes: [
                            [sequelize.literal("CAST([CreatedDate] AS DATE)"), "date"],
                            [sequelize.fn("COUNT", sequelize.col("OrderID")), "count"]
                        ],
                        where: sequelize.where(
                            sequelize.literal("CAST([CreatedDate] AS DATE)"),
                            {
                                [Op.between]: [formatDate(startDate), formatDate(endDate)]
                            }
                        ),
                        group: [sequelize.literal("CAST([CreatedDate] AS DATE)")],
                        order: [[sequelize.literal("CAST([CreatedDate] AS DATE)"), "ASC"]],
                        raw: true
                    });


                    const formattedStart = formatDate(startDate);
                    const formattedEnd = formatDate(endDate);


                    const orderCompleted = await TblOrder.findAll({
                        attributes: [
                            [sequelize.literal("CONVERT(DATE, [CompletedDate])"), "date"],
                            [sequelize.fn("COUNT", sequelize.col("OrderID")), "count"]
                        ],
                        where: {
                            RequestStatus: "Completed",
                            [Op.and]: [
                                sequelize.where(
                                    sequelize.literal("CONVERT(DATE, [CompletedDate])"),
                                    { [Op.between]: [formattedStart, formattedEnd] }
                                )
                            ]
                        },
                        group: [sequelize.literal("CONVERT(DATE, [CompletedDate])")],
                        order: [[sequelize.literal("CONVERT(DATE, [CompletedDate])"), "ASC"]],
                        raw: true
                    });

                    return {
                        orderPlaced,
                        orderCompleted,
                        documentUploaded: []
                    };
                })(),

                (async () => {
                    const nextMonth = new Date();
                    nextMonth.setDate(currentDate.getDate() + 30);

                    return TblOrder.findAll({
                        attributes: [
                            [sequelize.fn("CONVERT", sequelize.literal("DATE"), sequelize.col("NeededBy")), "date"],
                            [sequelize.fn("COUNT", sequelize.col("OrderID")), "count"]
                        ],
                        where: {
                            NeededBy: { [Op.between]: [currentDate, nextMonth] },
                            RequestStatus: { [Op.notIn]: ["Completed", "Cancelled"] }
                        },
                        group: [sequelize.fn("CONVERT", sequelize.literal("DATE"), sequelize.col("NeededBy"))],
                        order: [[sequelize.fn("CONVERT", sequelize.literal("DATE"), sequelize.col("NeededBy")), "ASC"]],
                        raw: true
                    });
                })(),

                TblOrder.findAll({
                    where: { IsRush: true },
                    limit: 10,
                    order: [["CreatedDate", "DESC"]]
                })
            ]);

            res.json({
                totalOrders,
                orderStatuses,
                urgentOrders,
                activeOrders,
                completedOrders,
                cancelledOrders,
                ordersOnTime,
                missedDeadlines,
                participantCount,
                documentLocationCount,
                recentActivities,
                recentOrders,
                orderTrends,
                ordersNearingDeadline,
                topTenUrgentOrders
            });
        } catch (error) {
            console.error("❌ Error fetching dashboard data:", error);
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
            const now = new Date();

            const overdueOrders = await TblOrder.findAll({
                where: {
                    NeededBy: { [Op.lt]: now },
                    RequestStatus: { [Op.ne]: 'Completed' }
                }
            });

            if (!overdueOrders.length) {
                console.log("✅ No missed deadlines found at", now.toISOString());
                return;
            }

            let newLogs = 0;

            for (const order of overdueOrders) {
                const alreadyLogged = await ActivityLog.findOne({
                    where: {
                        order_id: order.OrderID,
                        action_type: "order_deadline_missed"
                    }
                });

                if (!alreadyLogged) {
                    await ActivityLog.create({
                        order_id: order.OrderID,
                        action_type: "order_deadline_missed",
                        description: `🚨 Order {${order.OrderID}} missed its deadline (${order.NeededBy}).`
                    });

                    newLogs++;
                }
            }

            console.log(`🔔 ${newLogs} new missed deadlines logged at ${now.toISOString()}`);
        } catch (error) {
            console.error("❌ Error checking missed deadlines:", error);
        }
    }


}
// Run every hour
setInterval(dashboardCtrl.checkMissedDeadlines, 60 * 60 * 1000);


module.exports = dashboardCtrl;
