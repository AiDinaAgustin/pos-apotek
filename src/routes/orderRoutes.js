const express = require("express");

const router = express.Router();

const validateRequest = require("../validations/validations");
const {
  storeOrderController,
  storeOrderSchema,
  storeOrderDetailController,
  storeOrderDetailSchema,
  updateOrderDetailController,
  successOrderController,
  holdOrderController,
  cancelOrderController,
  getOrdersController,
  deleteOrderDetailController,
  getHoldStatusOrdersController,
} = require("../controllers/OrderController");

router.get("/orders/hold",  getHoldStatusOrdersController);
router.post(
  "/orders",
  validateRequest(storeOrderSchema),
  storeOrderController
);
router.post(
  "/orders/:orderId/detail",
  validateRequest(storeOrderDetailSchema),
  storeOrderDetailController
);
router.get("/orders/:orderId",  getOrdersController);
router.put(
  "/orders/:orderId/detail/:orderDetailId",
  updateOrderDetailController
);
router.put(
  "/orders/:orderId/success",
  successOrderController
);
router.put("/orders/:orderId/hold", holdOrderController);
router.put(
  "/orders/:orderId/cancel",
  cancelOrderController
);
router.delete(
  "/orders/:orderId/detail/:orderDetailId",
  deleteOrderDetailController
);

module.exports = router;
