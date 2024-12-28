const {
  createReception,
  createReceptionDetails,
  getReceptionById,
  getAllReceptions,
  getReceptionDetailsByReceptionId,
  countReceptions
} = require('../repositories/itemReceptionRepository');
const {
  updateItem,
  findItemById,
} = require('../repositories/ItemRepository');

const { createStockCard } = require("../repositories/stockCardRepository");

const createReceptionService = async (data, userId) => {
  const { items, ...receptionData } = data;
  if (!Array.isArray(items)) {
    throw new Error('Items should be an array');
  }
  const newReception = await createReception(receptionData, userId);
  for (const item of items) {
    await createReceptionDetails({
      receptions_id: newReception.id,
      item_id: item.item_id,
      quantity: item.quantity,
    });
    const stockAwal = await findItemById(item.item_id);
    if (!stockAwal) {
      throw new Error(`Item with ID ${item.item_id} not found`);
    }
    const updatedStock = stockAwal.stock + item.quantity;
    await updateItem(item.item_id, { stock: updatedStock });
    await createStockCard({
      item_id: item.item_id,
      outlet_id: receptionData.outlet_id,
      stock_in: item.quantity,
      stock_out: 0,
      current_stock: updatedStock,
      transaction_type: 'receipt',
      transaction_id: newReception.id,
    });
  }
  return newReception;
};

const getReceptionByIdService = async (receptionId) => {
  const reception = await getReceptionById(receptionId);
  if (!reception) throw new Error('Reception not found');

  const receptionDetails = await getReceptionDetailsByReceptionId(receptionId);
  return {
    ...reception,
    reception_details: receptionDetails
  };
};

const getReceptionsService = async (page, search, sortBy, perPage, outletId, userId) => {
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = perPage ? parseInt(perPage, 10) : 10;
  const skip = (currentPage - 1) * pageSize;
  sortBy = sortBy || 'created_at:desc';

  try {
    const [getReceptions, totalData] = await Promise.all([
      getAllReceptions(skip, pageSize, search, sortBy, outletId, userId),
      countReceptions(search, outletId, userId),
    ]);

    const totalPages = Math.ceil(totalData / pageSize);

    return {
      receptions: getReceptions,
      currentPage: currentPage,
      total: totalData,
      totalPages: totalPages,
      prev: currentPage === 1 ? null : currentPage - 1,
      next: currentPage === totalPages ? null : currentPage + 1,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createReceptionService,
  getReceptionByIdService,
  getReceptionsService,
};