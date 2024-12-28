const {
  createItemService,
  getItemsService,
  findItemByIdService,
  updateItemService,
  deleteItemService,
  getLowStockItemsService
} = require("../services/itemService");

const yup = require("yup");
  
const handleCreateItem = async (req, res) => {
  try {
    const newItemData = req.body;
    const newItem = await createItemService(newItemData);
    res.status(201).json({ message: "Item created successfully", data: newItem });
  } catch (error) {
    const decoded = JSON.parse(error.message);
    const errors = JSON.parse(decoded.errors);
    return res.status(errors.status).json(errors);    }
};

const handleGetItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await findItemByIdService(itemId);
    res.status(200).json({
      message: "Data found",
      data: item,
    });
  } catch (error) {
    const decoded = JSON.parse(error.message);
    return res.status(decoded.status).json(decoded.message);
  }
};

const handleGetItems = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = req.query.page || 1;
    const perPage = req.query.perPage || null;
    const sortBy = req.query.sortBy || "created_at:desc"; 
    const outletId = req.query.outlet_id || null;
    const items = await getItemsService(page, search, sortBy, perPage, outletId);
    res.status(200).json({
      message: "Data found",
      data: items.items,
      pagination: {
        currentPage: items.currentPage,
        prev: items.prev,
        next: items.next,
        totalData: items.total,
        totalPages: items.totalPages,
      },
    });
  } catch (error) {
    const decoded = JSON.parse(error.message);
    return res.status(decoded.status).json(decoded.message);
  }
};

const handleUpdateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const itemData = req.body;
    const updatedItem = await updateItemService(itemId, itemData);
    res.status(200).json({ message: "Item updated successfully", data: updatedItem });
  } catch (error) {
    let decoded;
    try {
      decoded = JSON.parse(error.message);
    } catch (parseError) {
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }

    let errors;
    try {
      errors = JSON.parse(decoded.errors);
    } catch (parseError) {
      return res.status(decoded.status || 500).json(decoded.message || { message: "Internal server error" });
    }

    return res.status(errors.status).json(errors);
  }
};

const handleDeleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const deletedItem = await deleteItemService(itemId);
    res.status(200).json({
      message: `Item ${deletedItem.deleted ? 'deleted' : 'restored'} successfully`,
      data: deletedItem,
    })
  } catch (error) {
    const decoded = JSON.parse(error.message);
    const errors = JSON.parse(decoded.errors);
    return res.status(errors.status).json(errors);    }
};

const handleGetLowStockItems = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = req.query.page || 1;
    const perPage = req.query.perPage || null;
    const sortBy = req.query.sortBy || "created_at:desc"; 
    const outletId = req.query.outlet_id || null;
    const items = await getLowStockItemsService(page, search, sortBy, perPage, outletId);
    res.status(200).json({
      message: "Low stock items found",
      data: items.items,
      pagination: {
        currentPage: items.currentPage,
        prev: items.prev,
        next: items.next,
        totalData: items.total,
        totalPages: items.totalPages,
      },
    });
  } catch (error) {
    const decoded = JSON.parse(error.message);
    return res.status(decoded.status).json(decoded.message);
  }
};

const validUnits = ["pil", "kapsul", "tablet", "sirup", "salep", "gel", "injeksi"];

const validasiCreateItem = yup.object().shape({
  name: yup.string().required().max(50, "Name must be at most 50 characters long"),
  price: yup.number().required("Price is required"), // Change to number
  description: yup.string().required().max(200, "Description must be at most 200 characters long"),
  stock: yup.number().required("Stock is required"),
  unit: yup.string().required().oneOf(validUnits, "Unit must be one of the following: pil, kapsul, tablet, sirup, salep, gel, injeksi").required("Unit is required"),
  outlet_id: yup.string().required("Outlet ID is required")
});

const validasiUpdateItem = yup.object().shape({
  name: yup.string().required().max(50, "Name must be at most 50 characters long"),
  price: yup.number().required("Price is required"), // Change to number
  description: yup.string().required().max(200, "Description must be at most 200 characters long"),
  stock: yup.number().required("Stock is required"),
  unit: yup.string().required().oneOf(validUnits, "Unit must be one of the following: pil, kapsul, tablet, sirup, salep, gel, injeksi").required("Unit is required"),
  outlet_id: yup.string().required("Outlet ID is required")
});

module.exports = {
  handleCreateItem,
  handleGetItem,
  handleGetItems,
  handleUpdateItem,
  handleDeleteItem,
  handleGetLowStockItems,
  validasiCreateItem,
  validasiUpdateItem
};