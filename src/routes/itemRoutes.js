const express = require("express");
const {
    handleCreateItem,
    handleGetItem,
    handleGetItems,
    handleUpdateItem,
    handleDeleteItem,
    validasiCreateItem,
    validasiUpdateItem,
    handleGetLowStockItems
} = require("../controllers/itemController");

const validateRequest = require("../validations/validations");
const { auth, admin } = require("../middlewares/auth");

const router = express.Router();

router.post("/items", validateRequest(validasiCreateItem), auth, admin, handleCreateItem);

router.get("/items", auth, handleGetItems);

router.get("/items/low-stock",  handleGetLowStockItems);

router.get("/items/:id", auth, handleGetItem);

router.put("/items/:id", auth, admin, validateRequest(validasiUpdateItem), handleUpdateItem);

router.delete("/items/:id", auth, admin, handleDeleteItem);

module.exports = router;