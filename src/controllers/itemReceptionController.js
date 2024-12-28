const {
  createReceptionService,
  getReceptionByIdService,
  getReceptionsService,
} = require('../services/itemReceptionService');

const yup = require("yup");

const createReceptionController = async (req, res) => {
  try {
    const userId = req.user.userToken;
    const receptionData = req.body;

    const reception = await createReceptionService(receptionData, userId);
    res.status(201).json(reception);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getReceptionByIdController = async (req, res) => {
  try {
    const reception = await getReceptionByIdService(req.params.id);
    res.status(200).json({
      message: "Data found",
      data: reception,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getReceptionsController = async (req, res) => {
  try {
    const { page, search, sortBy, perPage } = req.query;
    const outletId = req.query.outlet_id || null;
    const userId = req.query.user_id || null;
    const receptions = await getReceptionsService(page, search, sortBy, perPage, outletId, userId);

    res.status(200).json({
      message: "Data found",
      data: receptions.receptions,
      pagination: {
        currentPage: receptions.currentPage,
        prev: receptions.prev,
        next: receptions.next,
        totalData: receptions.total,
        totalPages: receptions.totalPages,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const validationCreateReception = yup.object().shape({
  outlet_id: yup.string().required("Outlet ID is required"), 
  kode_po: yup.string().required("Kode PO is required"),
  date_po: yup.date().required("Date PO is required"), 
});

const validationCreateReceptionDetails = yup.object().shape({
  receptions_id: yup.string().required("Reception ID is required"),
  item_id: yup.string().required("Item ID is required"),
  quantity: yup
    .number()
    .required("Quantity is required")
    .positive("Quantity must be a positive number")
    .integer("Quantity must be an integer"),
});

module.exports = {
  createReceptionController,
  getReceptionByIdController,
  getReceptionsController,
  validationCreateReception,
  validationCreateReceptionDetails
};