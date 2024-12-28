const {
  createStockCardService,
  getStockCardService,
  getStockCardLatestService,
  findStockCardByIdService,
} = require("../services/stockCardService");

const yup = require("yup");

const handleCreateStockCard = async (req, res) => {
  try {
    const newItemData = req.body;
    const newItem = await createStockCardService(newItemData);
    res
      .status(201)
      .json({ message: "Item created successfully", data: newItem });
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

const handleGetStockCardLatest = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await getStockCardLatestService(itemId);
    res.status(200).json({
      message: "Data found",
      data: item,
    });
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

const handleGetStockCard = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await findStockCardByIdService(itemId);
    res.status(200).json({
      message: "Data found",
      data: item,
    });
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

const handleGetStockCards = async (req, res) => {
  try {
    const search = req.query.search || "";
    const outletId = req.query.outlet_id || null;
    const itemId = req.query.item_id || null;
    const page = parseInt(req.query.page) || 1;
    const sortBy = req.query.sortBy || "created_at:desc";
    const items = await getStockCardService(
      page,
      search,
      sortBy,
      outletId,
      itemId
    );
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
    res.status(400).json({ error: error.errors || error.message });
  }
};

const validasiCreateStockCard = yup.object().shape({
  item_id: yup.string().required("Item ID is required"),

  outlet_id: yup.string().required("Outlet ID is required"),

  stock_in: yup
    .number()
    .required("Stock In is required")
    .min(0, "Stock In must be 0 or greater"),

  stock_out: yup
    .number()
    .required("Stock Out is required")
    .min(0, "Stock Out must be 0 or greater"),

  current_stock: yup
    .number()
    .required("Current Stock is required")
    .min(0, "Current Stock must be 0 or greater"),

  transaction_type: yup
    .string()
    .required("Transaction Type is required")
    .oneOf(
      ["reception", "sales"],
      "Transaction Type must be one of: reception, sales"
    ),

  transaction_id: yup.string().required("Transaction ID is required"),
});

module.exports = {
  handleCreateStockCard,
  handleGetStockCard,
  handleGetStockCardLatest,
  handleGetStockCards,
  validasiCreateStockCard,
};
