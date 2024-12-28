const express = require("express");
const {
    getHistoryByIdController,
    getHistoryController,
    getOrderAndRevenueController
} = require("../controllers/historyController")

const { auth} = require("../middlewares/auth");

const router = express.Router();

router.get("/histories", auth, getHistoryController);

router.get("/histories/totals", getOrderAndRevenueController);

router.get("/histories/:id", auth, getHistoryByIdController);

module.exports = router;