const {
  createStockCard,
  get,
  findStockCardById,
  findStockCardLatest,
} = require("../repositories/stockCardRepository");

const createStockCardService = async (itemData) => {
  return await createStockCard(itemData);
};

const getStockCardService = async (page, search, sortBy, outletId, itemId) => {
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = 20;
  const skip = (currentPage - 1) * pageSize;
  try {
    const getItems = await get(
      skip,
      pageSize,
      search,
      sortBy,
      outletId,
      itemId
    );
    const totalData = getItems.length;
    const totalPages = Math.ceil(totalData / pageSize);
    return {
      items: getItems,
      currentPage: currentPage,
      total: totalData,
      totalPages: totalPages,
      prev: currentPage == 1 ? null : currentPage - 1,
      next: currentPage == totalPages ? null : currentPage + 1,
    };
  } catch (error) {
    throw Error(error.message);
  }
};

const findStockCardByIdService = async (itemId) => {
  const item = await findStockCardById(itemId);
  if (!item) throw new Error("Item not found");
  return item;
};

const getStockCardLatestService = async (itemId) => {
  const item = await findStockCardLatest(itemId);
  if (!item) throw new Error("Item not found");
  return item;
};

module.exports = {
  createStockCardService,
  getStockCardService,
  getStockCardLatestService,
  findStockCardByIdService,
};
