const prisma = require("../db");

const getById = async (OrderId) => {
    try {
        const order = await prisma.orders.findUnique({
            where: {
                id: OrderId
            },
            include: {
                order_details: {
                    include: {
                        items: true,
                    }
                },
                user: true,
                outlet: true
            }
        });
        return order;
    } catch (error) {
        throw new Error(error.message);
    } finally {
        prisma.$disconnect();
    }
}

const get = async (skip, pageSize, search, status, outletId, userId, sortBy, earlyPeriod, latePeriod) => {
    try {
        const searchConditions = [
            { id: { contains: search, mode: "insensitive" } }
        ];

        const whereConditions = {
            OR: searchConditions
        };

        if (status) {
            whereConditions.status = status;
        }

        if (outletId) {
            whereConditions.outlet_id = outletId;
        }

        if (userId) {
            whereConditions.user_id = userId;
        }

        if (earlyPeriod) {
            whereConditions.created_at = { ...whereConditions.created_at, gte: new Date(earlyPeriod) };
        }

        if (latePeriod) {
            whereConditions.created_at = { ...whereConditions.created_at, lte: new Date(latePeriod) };
        }

        const orderBy = {};
        if (sortBy) {
            const [field, direction] = sortBy.split(':');
            orderBy[field] = direction.toLowerCase();
        }

        const orders = await prisma.orders.findMany({
            where: whereConditions,
            orderBy: orderBy,
            skip: skip,
            take: pageSize,
            include: {
                order_details: {
                    include: {
                        items: true
                    }
                },
                user: true,
                outlet: true
            }
        });
        return orders;
    } catch (error) {
        throw new Error(error.message);
    } finally {
        prisma.$disconnect();
    }
}

const count = async () => {
    try {
        const orders = await prisma.orders.count({});
        return orders;
    } catch (error) {
        throw new Error(error.message);
    } finally {
        prisma.$disconnect();
    }
}


const getOrdersAndRevenue = async (period, outletId) => {
    let startDate, endDate;

    const today = new Date();
    switch (period) {
        case 'day':
            startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
            endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
            break;
        case 'month':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
            break;
        case 'year':
            startDate = new Date(today.getFullYear(), 0, 1, 0, 0, 0);
            endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59);
            break;
        default:
            throw new Error("Invalid period");
    }

    try {
        const whereConditions = {
            status: 'success',
            created_at: {
                gte: startDate,
                lt: endDate
            }
        };

        if (outletId) {
            whereConditions.outlet_id = outletId;
        }

        const result = await prisma.orders.aggregate({
            _sum: { amount: true },
            _count: { id: true },
            where: whereConditions
        });

        const orders = await prisma.orders.findMany({
            where: whereConditions,
            include: {
                order_details: {
                    include: {
                        items: true
                    }
                },
                user: true,
                outlet: true
            }
        });

        if (orders.length === 0) {
            return { result: { _sum: { amount: 0 }, _count: { id: 0 } }, orders: [] };
        }

        return { result, orders };
    } catch (error) {
        throw new Error(error.message);
    } finally {
        prisma.$disconnect();
    }
};


module.exports = {
    getById,
    get,
    count,
    getOrdersAndRevenue
}