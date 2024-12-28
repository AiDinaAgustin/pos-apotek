const express = require("express");
const {
  handleCreateStockCard,
  handleGetStockCard,
  handleGetStockCards,
  handleGetStockCardLatest,
  validasiCreateStockCard,
} = require("../controllers/stockCardController");

const validateRequest = require("../validations/validations");
const { auth, admin } = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/stock-cards",
  validateRequest(validasiCreateStockCard),
  auth,
  admin,
  handleCreateStockCard
);

router.get("/stock-cards", auth, handleGetStockCards);

router.get("/stock-cards/latest", auth, handleGetStockCardLatest);

router.get("/stock-cards/:id", auth, handleGetStockCard);

module.exports = router;
