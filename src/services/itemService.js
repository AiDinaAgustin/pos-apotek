const {
  createItem,
  get,
  findItemById,
  updateItem,
  toggleDeleteItem,
  count,
  getLowStockItems
} = require("../repositories/ItemRepository");


const {createStockCard} = require("../repositories/stockCardRepository")

const createItemService = async (itemData) => {
  const newItem = await createItem(itemData);
  await createStockCard({
    item_id: newItem.id,
    outlet_id: itemData.outlet_id,
    stock_in: itemData.stock,
    stock_out: 0,
    current_stock: itemData.stock,
    transaction_type: 'initial_stock',
    transaction_id: newItem.id,
  });
  return newItem;
};

const getItemsService = async (page, search, sortBy, perPage, outletId) => {
const currentPage = Math.max(parseInt(page, 10) || 1, 1);
const pageSize = perPage ? parseInt(perPage) : await count();
const skip = (currentPage - 1) * pageSize;
sortBy = sortBy || 'created_at:desc'; 
try {
  const getItems = await get(skip, pageSize, search, sortBy, outletId);
  const totalData = getItems.length;
  const totalPages = Math.ceil(await count() / pageSize);
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

const findItemByIdService = async (itemId) => {
  const item = await findItemById(itemId);
  if (!item) throw new Error("Item not found");
  return item;
};

const updateItemService = async (itemId, itemData) => {
  const existingItem = await findItemById(itemId);
  if (!existingItem) throw new Error("Item not found");
  return await updateItem(itemId, itemData);
};

const deleteItemService = async (itemId) => {
  const item = await findItemById(itemId);
  if (!item) throw new Error("Item not found");

  return await toggleDeleteItem(itemId);
};

const getLowStockItemsService = async (page, search, sortBy, perPage, outletId) => {
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = perPage ? parseInt(perPage) : await count();
  const skip = (currentPage - 1) * pageSize;
  sortBy = sortBy || 'created_at:desc'; 
  try {
    const items = await getLowStockItems(skip, pageSize, search, sortBy, outletId);
    const totalData = items.length;
    const totalPages = Math.ceil(await count() / pageSize);
    return {
      items: items,
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


module.exports = {
  createItemService,
  getItemsService,
  findItemByIdService,
  updateItemService,
  deleteItemService,
  getLowStockItemsService
};