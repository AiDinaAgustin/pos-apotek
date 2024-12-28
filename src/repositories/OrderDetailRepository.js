const prisma = require("../db");

const createOrderDetail = async (request = {}) => {
  try {
    const created = await prisma.$transaction(async (prisma) => {
      return await prisma.order_details.create({
        data: request,
      });
    });
    return created;
  } catch (error) {
    throw Error(JSON.stringify({ status: 500, errors: error.message }));
  }
};

const updateOrderDetailByOrderId = async (
  detailOrderId = null,
  request = {}
) => {
  try {
    const updated = await prisma.$transaction(async (prisma) => {
      return await prisma.order_details.update({
        data: request,
        where: {
          id: detailOrderId,
        },
      });
    });
    return updated;
  } catch (error) {
    throw Error(JSON.stringify({ status: 500, errors: error.message }));
  }
};

const findOrderDetailByOrderId = async (orderId, filter = {}) => {
  const properties = {
    where: {
      order_id: orderId,
      ...filter,
    },
    include: {
      items: true,
    },
  };

  try {
    const find = await prisma.order_details.findFirst(properties);
    return find;
  } catch (error) {
    throw Error(JSON.stringify({ status: 500, errors: error.message }));
  }
};

const findOrderDetailById = async (orderDetailId = null) => {
  try {
    const find = await prisma.order_details.findFirst({
      where: { id: orderDetailId },
      include: {
        items: true,
      },
    });
    return find;
  } catch (error) {
    throw Error(JSON.stringify({ status: 500, errors: error.message }));
  }
};

const deleteDetailOrder = async (id = null) => {
  try {
    await prisma.$transaction(async (prisma) => {
      const deleted = await prisma.order_details.delete({
        where: {
          id: id,
        },
      });
      return deleted;
    });
  } catch (error) {
    throw Error(JSON.stringify({ status: 500, errors: error.message }));
  }
};

module.exports = {
  createOrderDetail,
  updateOrderDetailByOrderId,
  deleteDetailOrder,
  findOrderDetailById,
  findOrderDetailByOrderId,
};
