const yup = require("yup");
const {
  createOrderService,
  createOrderDetailService,
  updateOrderDetailService,
  orderSuccessService,
  getOrderByIdService,
  orderHoldService,
  cancelOrderService,
  deleteOrderDetailService,
  getOrderOnlyHoldStatusService,
} = require("../services/OrderService");

const getOrdersController = async (req, res) => {
  const orderId = req.params?.orderId;
  try {
    const response = await getOrderByIdService(orderId);
    return res.status(200).json({ data: response });
  } catch (error) {
    const decoded = JSON.parse(error.message);
    return res.status(decoded.status).json(decoded);
  }
};

const storeOrderController = async (req, res) => {
  const request = req.body;
  try {
    const response = await createOrderService(request);

    return res.status(201).json(response);
  } catch (error) {
    const decoded = JSON.parse(error.message);
    return res.status(decoded.status).json(decoded);
  }
};

const storeOrderDetailController = async (req, res) => {
  const orderId = req.params.orderId;
  const request = req.body;
  try {
    const response = await createOrderDetailService(orderId, request);
    return res.status(201).json(response);
  } catch (error) {
    const decoded = JSON.parse(error.message);
    return res.status(decoded.status).json(decoded);
  }
};

const updateOrderDetailController = async (req, res) => {
  const orderId = req.params.orderId;
  const orderDetailId = req.params.orderDetailId;
  const request = req.body;

  try {
    await updateOrderDetailService(orderId, orderDetailId, request);
    return res
      .status(200)
      .json({ status: 200, message: "success update order detail" });
  } catch (error) {
    const decoded = JSON.parse(error.message);
    return res.status(decoded.status).json(decoded);
  }
};

const successOrderController = async (req, res) => {
  const orderId = req.params.orderId;
  const request = req.body;
  try {
    await orderSuccessService(orderId, request);
    return res.status(200).json({ status: 200, message: "payment success" });
  } catch (error) {
    const decoded = JSON.parse(error.message);
    return res.status(decoded.status).json(decoded);
  }
};

const holdOrderController = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    await orderHoldService(orderId);
    return res
      .status(200)
      .json({ status: 200, message: "payment holding success" });
  } catch (error) {
    const decoded = JSON.parse(error.message);
    return res.status(decoded.status).json(decoded);
  }
};

const deleteOrderDetailController = async (req, res) => {
  const orderId = req.params.orderId;
  const orderDetailId = req.params.orderDetailId;
  try {
    await deleteOrderDetailService(orderId, orderDetailId);
    return res
      .status(200)
      .json({ status: 200, message: "delete order success" });
  } catch (error) {
    const decoded = JSON.parse(error.message);
    return res.status(decoded.status).json(decoded);
  }
};

const cancelOrderController = async (req, res) => {
  const orderId = req.params.orderId;
  const request = req.body;

  try {
    const response = await cancelOrderService(orderId, request);
    return res.status(200).json({ data: response });
  } catch (error) {
    const decoded = JSON.parse(error.message);
    return res.status(decoded.status).json(decoded);
  }
};

const getHoldStatusOrdersController = async (req, res) => {
  const outletId = req.query?.outlet_id;
  try {
    const response = await getOrderOnlyHoldStatusService(outletId);
    return res.status(200).json({ data: response });
  } catch (error) {
    const decoded = JSON.parse(error.message);
    return res.status(decoded.status).json(decoded);
  }
};
const storeOrderSchema = yup.object().shape({
  outlet_id: yup.string().required("outlet_id is required"),
  user_id: yup.string().required("user_id is required"),
});

const storeOrderDetailSchema = yup.object().shape({
  item_id: yup.string().required("item id is required"),
  quantity: yup.number().required("quantity is required"),
});

const updateOrderDetailSchema = yup.object().shape({
  item_id: yup.string().required("item id is required"),
  quantity: yup.number().required("quantity is required"),
});

module.exports = {
  storeOrderController,
  storeOrderSchema,
  storeOrderDetailController,
  storeOrderDetailSchema,
  updateOrderDetailController,
  updateOrderDetailSchema,
  successOrderController,
  holdOrderController,
  cancelOrderController,
  getOrdersController,
  deleteOrderDetailController,
  getHoldStatusOrdersController,
};
