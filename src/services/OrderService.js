const { v7: uuidv7 } = require("uuid");
const {
  createOrder,
  getOrderById,
  updateOrderById,
  getOrderOnlyHoldStatus,
} = require("../repositories/OrderRepository");
const {
  createOrderDetail,
  updateOrderDetailByOrderId,
  findOrderDetailById,
  deleteDetailOrder,
  findOrderDetailByOrderId,
} = require("../repositories/OrderDetailRepository");
const { findUserById } = require("../repositories/UserRepository");
const { findById } = require("../repositories/OutletRepository");
const { findItemById, updateItem } = require("../repositories/ItemRepository");
const {
  createStockCard,
  findStockCardLatest: findStockById,
} = require("../repositories/stockCardRepository");

const createOrderService = async (request) => {
  const { user_id, outlet_id } = request;

  try {
    const [findUser, findOutlet] = await Promise.all([
      findUserById(user_id),
      findById(outlet_id),
    ]);

    validateCreateOrderService(findUser, findOutlet);

    const order = await createOrder({
      id: "ORD" + uuidv7(),
      user_id: user_id,
      outlet_id: outlet_id,
      amount: 0,
      total_payment: 0,
      status: "on_process",
    });
    return order;
  } catch (error) {
    throw Error(error.message);
  }
};

const validateCreateOrderService = async (findUser, findOutlet) => {
  let errorResponse = { status: 400, errors: {} };
  if (!findUser) errorResponse.errors.user_id = "user not found";
  if (!findOutlet) errorResponse.errors.outlet_id = "outlet not found";

  if (Object.keys(errorResponse.errors).length > 0)
    throw Error(JSON.stringify(errorResponse));
};

const createOrderDetailService = async (orderId, request) => {
  const { item_id, quantity } = request;
  try {
    const [findOrder, findItem] = await Promise.all([
      getOrderById(orderId),
      findItemById(item_id),
    ]);

    validateCreateOrderDetailService(findOrder, findItem ,quantity);

    const findOrderDetail = await findOrderDetailByOrderId(orderId, {
      item_id: item_id,
    });

    const price = findItem.price;
    let totalPrice = 0;

    if (findOrderDetail) {
      totalPrice = quantity * price;
      await updateOrderDetailByOrderId(findOrderDetail.id, {
        total_price: findOrderDetail.total_price + totalPrice,
        quantity: findOrderDetail.quantity + quantity,
      });
    } else {
      totalPrice = quantity * price;
      await createOrderDetail({
        id: "ORDD" + uuidv7(),
        order_id: orderId,
        item_id: item_id,
        price: price,
        quantity: quantity,
        total_price: totalPrice,
      });
    }

    await updateOrderById(orderId, {
      total_payment: findOrder.total_payment + totalPrice,
    });

    await updateItem(item_id, {
      stock: findItem.stock - quantity,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateOrderDetailService = async (orderId, detailOrderId, request) => {
  const { item_id, quantity } = request;
  try {
    const [findOrder, findOrderDetail, findItem, findStock] = await Promise.all(
      [
        getOrderById(orderId),
        findOrderDetailById(detailOrderId),
        findItemById(item_id),
        findStockById(item_id),
      ]
    );

    validateUpdateOrderDetailService(findOrder, findItem, findStock);

    let itemPrice = findItem.price;
    let previousQuantity = findOrderDetail.quantity;
    let quantityDifference = 0;
    let newQuantity = 0;
    let totalPrice = findItem.price * quantity;
    let totalPayment = 0;

    if (quantity > previousQuantity) {
      quantityDifference = quantity - previousQuantity;
      newQuantity = findItem.stock - quantityDifference;
      totalPayment = findOrder.total_payment + itemPrice * quantityDifference;
      if (quantityDifference > findItem.stock) {
        throw new Error(
          JSON.stringify({
            status: 404,
            errors: { stock: "insufficient stock" },
          })
        );
      }
    } else {
      quantityDifference = previousQuantity - quantity;
      newQuantity = findItem.stock + quantityDifference;
      totalPayment = findOrder.total_payment - itemPrice * quantityDifference;
    }

    await updateOrderDetailByOrderId(detailOrderId, {
      price: itemPrice,
      quantity: quantity,
      total_price: totalPrice,
    });

    await updateItem(item_id, {
      stock: newQuantity,
    });

    await updateOrderById(orderId, {
      total_payment: totalPayment,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const orderSuccessService = async (orderId = null, request = {}) => {
  const { amount } = request;
  try {
    const findOrder = await getOrderById(orderId);

    validateOrderSuccessService(findOrder, amount);

    await updateOrderById(orderId, {
      status: "success",
      amount: amount,
    });

    for (const orderDetail of findOrder.order_details) {
      const stock = await findStockById(orderDetail.item_id);
      await createStockCard({
        id: "SC" + uuidv7(),
        outlet_id: orderDetail.items.outlet_id,
        item_id: orderDetail.item_id,
        stock_in: 0,
        stock_out: orderDetail.quantity,
        current_stock: stock.current_stock - orderDetail.quantity,
        transaction_type: "sale",
        transaction_id: orderId,
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const orderHoldService = async (orderId = null) => {
  try {
    const [findOrder] = await Promise.all([getOrderById(orderId)]);

    validateOrderHoldService(findOrder);

    await updateOrderById(orderId, {
      status: "on_process",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const cancelOrderService = async (orderId) => {
  try {
    const findOrder = await getOrderById(orderId);

    validateCancelOrderService(findOrder);

    await updateOrderById(orderId, {
      status: "rejected",
    });

    for (const orderDetail of findOrder.order_details) {
      await updateItem(orderDetail.item_id, {
        stock: orderDetail.items.stock + orderDetail.quantity,
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteOrderDetailService = async (orderId, orderDetailId) => {
  try {
    const [findOrder, findOrderDetail] = await Promise.all([
      getOrderById(orderId),
      findOrderDetailById(orderDetailId),
    ]);

    validateDeleteOrderDetail(findOrder, findOrderDetail);
    await deleteDetailOrder(orderDetailId);

    await updateItem(findOrderDetail.item_id, {
      stock: findOrderDetail.items.stock + findOrderDetail.quantity,
    });

    await updateOrderById(orderId, {
      total_payment: findOrder.total_payment - findOrderDetail.total_price,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOrderOnlyHoldStatusService = async (outletId = null) => {
  try {
    const orders = await getOrderOnlyHoldStatus(outletId);
    validateGetOrderOnlyHoldStatus(orders);
    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
};

const validateGetOrderOnlyHoldStatus = (findOrder) => {
  let errorResponse = { status: 404, errors: {} };
  if (!findOrder || findOrder.length <= 0)
    errorResponse.errors.orderDetail = "order not found";
  if (Object.keys(errorResponse.errors).length > 0) {
    throw new Error(JSON.stringify(errorResponse));
  }
};

const validateDeleteOrderDetail = (findOrder, findOrderDetail) => {
  let errorResponse = { status: 404, errors: {} };
  if (!findOrder) errorResponse.errors.orderDetail = "order not found";
  if (!findOrderDetail)
    errorResponse.errors.orderDetail = "order detail not found";
  if (Object.keys(errorResponse.errors).length > 0) {
    throw new Error(JSON.stringify(errorResponse));
  }
};

const validateCancelOrderService = (findOrder) => {
  let errorResponse = { status: 404, errors: {} };

  if (!findOrder) {
    errorResponse.errors.order = "order not found";
  }

  if (Object.keys(errorResponse.errors).length > 0) {
    throw new Error(JSON.stringify(errorResponse));
  }
};

const validateOrderHoldService = (findOrder) => {
  let errorResponse = { status: 404, errors: {} };

  if (!findOrder) {
    errorResponse.errors.order = "order not found";
  }

  if (Object.keys(errorResponse.errors).length > 0) {
    throw new Error(JSON.stringify(errorResponse));
  }
};

const validateOrderSuccessService = (findOrder, amount) => {
  let errorResponse = { status: 400, errors: {} };

  if (!findOrder) {
    errorResponse.errors.order = "order not found";
  }

  if (findOrder && amount < findOrder.total_payment) {
    errorResponse.errors.stock = "insufficient funds";
  }

  if (Object.keys(errorResponse.errors).length > 0) {
    throw new Error(JSON.stringify(errorResponse));
  }
};

const validateUpdateOrderDetailService = (findOrder, findItem, findStock) => {
  let errorResponse = { status: 400, errors: {} };
  if (!findOrder) {
    errorResponse.errors.order = "order not found";
  }
  if (!findItem) {
    errorResponse.errors.item = "item not found";
  }
  if (!findStock) errorResponse.errors.stock = "stock not found";

  if (Object.keys(errorResponse.errors).length > 0) {
    throw new Error(JSON.stringify(errorResponse));
  }
};

const validateCreateOrderDetailService = (findOrder, findItem, quantity) => {
  let errorResponse = { status: 400, errors: {} };

  if (!findOrder) errorResponse.errors.order_id = "order not found";
  if (!findItem) errorResponse.errors.item = "item not found";
  if (quantity > findItem.stock)
    errorResponse.errors.stock = "insufficient stock";

  if (Object.keys(errorResponse.errors).length > 0) {
    throw new Error(JSON.stringify(errorResponse));
  }
};

const getOrderByIdService = async (orderId) => {
  try {
    const order = await getOrderById(orderId);
    if (!order)
      throw new Error(
        JSON.stringify({ data: [], status: 404, errors: "data not found" })
      );
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createOrderService,
  getOrderByIdService,
  createOrderDetailService,
  updateOrderDetailService,
  orderSuccessService,
  orderHoldService,
  cancelOrderService,
  deleteOrderDetailService,
  getOrderOnlyHoldStatusService,
};
