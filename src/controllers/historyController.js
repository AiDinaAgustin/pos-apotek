const {
    getHistoryService,
    getHistoryByIdService,
    getOrderAndRevenueService
} = require("../services/historyService");

const getHistoryController = async (req, res) => {
    try {
        const search = req.query.search || "";
        const page = req.query.page || 1;
        const perPage = req.query.perPage || null;
        const userId = req.query.user_id || null;
        const status = req.query.status || null;
        const outletId = req.query.outlet_id || null;
        const sortBy = req.query.sortBy || "id:desc";
        const earlyPeriod = req.query.earlyPeriod || null;
        const latePeriod = req.query.latePeriod || null;

        const histories = await getHistoryService(page, search, perPage, status, outletId, userId, sortBy, earlyPeriod, latePeriod);

        

        return res.status(200).json({
            message: "data found",
            data: histories.data,
            pagination: {
                currentPage: histories.currentPage,
                prev: histories.prev,
                next: histories.next,
                totalData: histories.total,
                totalPages: histories.totalPages
            }
        });
    } catch (error) {
        const decoded = JSON.parse(error.message);
    return res.status(decoded.status).json(decoded.message);
    }
}

const getHistoryByIdController = async (req, res) => {
    try {
        const OrderId = req.params.id;
        const history = await getHistoryByIdService(OrderId);
        res.status(200).json({
            message: "Data found",
            data: history,
        });
    } catch (error) {
        const decoded = JSON.parse(error.message);
        const errors = JSON.parse(decoded.errors);
        return res.status(errors.status).json(errors);
    }
}

const getOrderAndRevenueController = async (req, res) => {
    try {
        const period = req.query.period || 'day';
        const outletId = req.query.outlet_id || null;

        const data = await getOrderAndRevenueService(period, outletId);

        if (data.orders.length == 0) {
            return res.status(200).json({
                message: "Data found",
                data: {
                    histories: data.orders,
                    summary: 0,
                }
            });
        }
        return res.status(200).json({
            message: "Data found",
            data: {
                histories: data.orders,
                summary: data.result
            }
        });
    } catch (error) {
        const decoded = JSON.parse(error.message);
        return res.status(decoded.status).json(decoded.message);
}
};
module.exports = {
    getHistoryController,
    getHistoryByIdController,
    getOrderAndRevenueController
};