const {
    get,
    getById,
    count,
    getOrdersAndRevenue,
} = require("../repositories/historyRepository")

const getHistoryService = async (page, search, perPage, status, outletId, userId, sortBy, earlyPeriod, latePeriod) => {
    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = perPage ? parseInt(perPage) : await count();
    const skip = (currentPage -1) * pageSize;
    try {
        const getHistories = await get(skip, pageSize, search, status, outletId, userId, sortBy, earlyPeriod, latePeriod);
        const totalData = getHistories.length;
        const totalPages = Math.ceil(await count() / pageSize);
        return {
            data: getHistories,
            currentPage: currentPage,
            total: totalData,
            totalPages: totalPages,
            prev: currentPage == 1 ? null : currentPage - 1,
            next: currentPage == totalPages ? null : currentPage + 1
        };
    } catch (error) {
        throw Error(JSON.stringify({ status: 500, errors: error.message }));
    }
};

const getHistoryByIdService = async (OrderId) => {
    try {
        const getHistoryById = await getById(OrderId);
        return getHistoryById;
    } catch (error) {
        throw Error(JSON.stringify({ status: 500, errors: error.message }));
    }
};

const getOrderAndRevenueService = async (period, outletId) => {
    try {
        const { result, orders } = await getOrdersAndRevenue(period, outletId);
        return { result, orders };
    } catch (error) {
        throw Error(JSON.stringify({ status: 500, errors: error.message }));
    }
};


module.exports = {
    getHistoryService,
    getHistoryByIdService,
    getOrderAndRevenueService
};