const prisma = require("../db");
const createOrder = async (request = {}) => {
  try {
    const nextId = await prisma.$queryRawUnsafe(
      "SELECT nextval('order_id_seq')"
    );

    const formattedId = `ORD${String(nextId[0].nextval).padStart(4, "0")}`;

    request.public_id = formattedId;

    const order = await prisma.$transaction(async (prisma) => {
      return await prisma.orders.create({
        data: request,
      });
    });

    return order;
  } catch (error) {
    // Menangani error dengan baik
    throw Error(JSON.stringify({ status: 500, errors: error.message }));
  }
};

const getOrderById = async (id = null) => {
  try {
    if (!id) throw new Error("ID is required");

    const order = await prisma.orders.findUnique({
      where: {
        id: id,
      },
      include: {
        order_details: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!order) throw new Error("Order not found");

    order.order_details = order.order_details
      .map((detail) => ({
        ...detail,
        items: { ...detail.items, name: detail.items.name },
      }))
      .sort((a, b) => a.items.name.localeCompare(b.items.name));

    return order;
  } catch (error) {
    console.error("Error fetching order:", error.message);
    throw Error(
      JSON.stringify({
        status: 500,
        message: "Internal Server Error",
        errors: error.message,
      })
    );
  }
};

const getOrderByPublicId = async (id = null) => {
  try {
    const orders = await prisma.orders.findUnique({
      where: {
        public_id: id,
      },
      include: {
        order_details: {
          include: {
            items: true,
          },
        },
      },
    });
    return orders;
  } catch (error) {
    throw Error(JSON.stringify({ status: 500, errors: error.message }));
  }
};

const getOrderOnlyHoldStatus = async (outletId = null) => {
  try {
    const orders = await prisma.orders.findMany({
      where: {
        status: "on_process",
        outlet_id: outletId,
      },
      include: {
        order_details: {
          include: {
            items: true,
          },
        },
      },
    });
    return orders;
  } catch (error) {
    throw Error(JSON.stringify({ status: 500, errors: error.message }));
  }
};

const updateOrderById = async (id = null, request = {}) => {
  try {
    await prisma.$transaction(async (prisma) => {
      const update = await prisma.orders.update({
        where: { id: id },
        data: request,
      });

      return update;
    });
  } catch (error) {
    throw new Error(`error performing update order : ${error}`);
  }
};
module.exports = {
  createOrder,
  getOrderById,
  updateOrderById,
  getOrderOnlyHoldStatus,
  getOrderByPublicId,
};
