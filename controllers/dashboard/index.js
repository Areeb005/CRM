const sequelize = require('../../config/dbConfig');
const { Order, User, DocumentLocation } = require('../../models');
const { Op } = require('sequelize');


const dashboardCtrl = {
    // Get all dashboard statistics
    getDashboardStats: async (req, res) => {
        try {
            const today = new Date();
            const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

            const [
                totalStats,
                orderTrends,
                urgentOrders,
                recentActivity
            ] = await Promise.all([
                getTotalStats(),
                getOrderTrends(thirtyDaysAgo),
                getTopUrgentOrders(),
                getRecentActivity()
            ]);

            res.json({
                statistics: totalStats,
                orderTrends,
                urgentOrders,
                recentActivity
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
};

// Helper functions for different dashboard components
async function getTotalStats() {
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({
        where: {
            status: 'pending'
        }
    });
    const urgentOrders = await Order.count({
        where: {
            urgent: true,
            status: {
                [Op.ne]: 'completed'
            }
        }
    });
    const pendingCancellation = await Order.count({
        where: {
            cancellation_requested: true,
            status: {
                [Op.ne]: 'cancelled'
            }
        }
    });
    const cancelledOrders = await Order.count({
        where: {
            status: 'cancelled'
        }
    });

    // Calculate orders on time percentage
    const completedOrders = await Order.count({
        where: {
            status: 'completed'
        }
    });
    const ordersOnTime = await Order.count({
        where: {
            status: 'completed',
            completed_at: {
                [Op.lte]: sequelize.col('needed_by')
            }
        }
    });
    const ordersOnTimePercentage = completedOrders > 0
        ? ((ordersOnTime / completedOrders) * 100).toFixed(1)
        : 0;

    return {
        totalOrders,
        pendingOrders,
        urgentOrders,
        pendingCancellation,
        cancelledOrders,
        ordersOnTimePercentage
    };
}

async function getOrderTrends(startDate) {
    const trends = await Order.findAll({
        attributes: [
            [sequelize.fn('DATE', sequelize.col('Order.createdAt')), 'date'],
            [sequelize.fn('COUNT', sequelize.col('Order.id')), 'orders_placed'],
            [sequelize.fn('SUM', sequelize.literal("CASE WHEN Order.status = 'completed' THEN 1 ELSE 0 END")), 'orders_completed'],
            [sequelize.fn('COUNT', sequelize.col('DocumentLocations.id')), 'documents_uploaded']
        ],
        include: [{
            model: DocumentLocation,
            attributes: [],
            required: false // LEFT JOIN to include orders without documents
        }],
        where: {
            createdAt: {
                [Op.gte]: startDate
            }
        },
        group: [sequelize.fn('DATE', sequelize.col('Order.createdAt'))],
        order: [[sequelize.fn('DATE', sequelize.col('Order.createdAt')), 'ASC']]
    });

    // Format the response to ensure consistent data structure
    return trends.map(trend => ({
        date: trend.getDataValue('date'),
        orders_placed: parseInt(trend.getDataValue('orders_placed')) || 0,
        orders_completed: parseInt(trend.getDataValue('orders_completed')) || 0,
        documents_uploaded: parseInt(trend.getDataValue('documents_uploaded')) || 0
    }));
}

async function getTopUrgentOrders() {
    return await Order.findAll({
        where: {
            urgent: true,
            status: {
                [Op.ne]: 'completed'
            }
        },
        attributes: [
            'id',
            'case_name',
            'case_number',
            'needed_by',
            [sequelize.literal('(SELECT full_name FROM users WHERE users.id = Order.order_by)'), 'client_name']
        ],
        order: [['needed_by', 'ASC']],
        limit: 10
    });
}


Order.belongsTo(User, {
    as: 'Creator',
    foreignKey: 'created_by'
});

Order.belongsTo(User, {
    as: 'Updater',
    foreignKey: 'updated_by'
});


async function getRecentActivity() {
    const activities = await Order.findAll({
        attributes: [
            'id',
            'status',
            'createdAt',
            'updatedAt',
            'case_name',  // Including case name for more context
            'case_number'
        ],
        include: [
            {
                model: User,
                as: 'Creator',
                attributes: ['id', 'full_name', 'profile_picture', 'firm_name', 'role'],
                required: true
            },
            {
                model: User,
                as: 'Updater',
                attributes: ['id', 'full_name', 'profile_picture', 'firm_name', 'role'],
                required: false  // Not required as some orders might not have been updated
            }
        ],
        order: [['updatedAt', 'DESC']],
        limit: 5
    });

    return activities.map(activity => {
        let message = '';
        let activityData = {
            order_id: `ORD-${activity.id}`,
            timestamp: activity.updatedAt,
            actor: {
                id: activity.Creator.id,
                name: activity.Creator.full_name,
                profile_picture: activity.Creator.profile_picture,
                firm_name: activity.Creator.firm_name,
                role: activity.Creator.role
            },
            case_details: {
                name: activity.case_name,
                number: activity.case_number
            }
        };

        switch (activity.status) {
            case 'created':
                message = `${activity.Creator.full_name} has created order ORD-${activity.id}`;
                break;
            case 'cancelled':
                if (activity.Updater) {
                    message = `Order ORD-${activity.id} has been cancelled by ${activity.Updater.full_name}`;
                    activityData.actor = {
                        id: activity.Updater.id,
                        name: activity.Updater.full_name,
                        profile_picture: activity.Updater.profile_picture,
                        firm_name: activity.Updater.firm_name,
                        role: activity.Updater.role
                    };
                }
                break;
            case 'completed':
                if (activity.Updater) {
                    message = `Order ORD-${activity.id} has been completed by ${activity.Updater.full_name}`;
                    activityData.actor = {
                        id: activity.Updater.id,
                        name: activity.Updater.full_name,
                        profile_picture: activity.Updater.profile_picture,
                        firm_name: activity.Updater.firm_name,
                        role: activity.Updater.role
                    };
                } else {
                    message = `Order ORD-${activity.id} has been completed`;
                }
                break;
            case 'in_progress':
                if (activity.Updater) {
                    message = `${activity.Updater.full_name} started working on order ORD-${activity.id}`;
                    activityData.actor = {
                        id: activity.Updater.id,
                        name: activity.Updater.full_name,
                        profile_picture: activity.Updater.profile_picture,
                        firm_name: activity.Updater.firm_name,
                        role: activity.Updater.role
                    };
                }
                break;
            case 'pending':
                message = `New order ORD-${activity.id} is pending`;
                break;
        }

        return {
            message,
            ...activityData
        };
    });
}

// Orders nearing deadline
async function getOrdersNearingDeadline() {
    const today = new Date();
    const threeDaysFromNow = new Date(today.setDate(today.getDate() + 3));

    return await Order.count({
        where: {
            needed_by: {
                [Op.between]: [today, threeDaysFromNow]
            },
            status: {
                [Op.ne]: 'completed'
            }
        },
        group: [
            [sequelize.literal(`
        CASE 
          WHEN needed_by <= NOW() + INTERVAL '1 day' THEN '1 or Less Day Left'
          WHEN needed_by <= NOW() + INTERVAL '2 day' THEN '2 Days Left'
          ELSE '3-5 Days Left'
        END
      `)]
        ]
    });
}

module.exports = dashboardCtrl;