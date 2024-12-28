const yup = require("yup");
const {
  storeOutletService,
  getOutletService,
  softDeleteOutletService,
  updateByOutletByIdService,
} = require("../services/outletService");

const storeOutletController = async (req, res) => {
  try {
    const outlet = await storeOutletService(req.body);
    return res.status(201).json({
      message: "Outlet created successfully",
      data: outlet,
    });
  } catch (error) {
    const decoded = JSON.parse(error.message);
    const errors = JSON.parse(decoded.errors);
    return res.status(errors.status).json(errors);
  }
};

const storeOutletSchema = yup.object().shape({
  name: yup.string().required("name field is required"),
  address: yup.string().required("address fiels is required"),
  phone: yup.string().matches(/^\d{9,16}$/, {
    message: "phone number must have 9 - 16 digits (example: 0812345678321)",
  }),
  email: yup
    .string()
    .email("Invalid Email (example : example@gmail.com)")
    .required("email field is required"),
});

const getOutletController = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const search = req.query.search || "";
    const perPage = req.query.perPage || null;
    const outlets = await getOutletService(page, search, perPage);

    if (outlets.outlets.length == 0)
      throw Error(JSON.stringify({ status: 404, message: "data not found" }));

    return res.status(200).json({
      message: "data found",
      data: outlets.outlets,
      pagination: {
        currentPage: outlets.currentPage,
        prev: outlets.prev,
        next: outlets.next,
        totalData: outlets.total,
        totalPages: outlets.totalPages,
      },
    });
  } catch (error) {
    const decoded = JSON.parse(error.message);
    return res.status(decoded.status).json(decoded.message);
  }
};

const deleteOutletController = async (req, res) => {
  try {
    const id = req.params?.id || null;
    const deleted = await softDeleteOutletService(id);
    return res.status(200).json({
      data: deleted,
      message: "success delete outlet",
    });
  } catch (error) {
    const decoded = JSON.parse(error.message);
    const errors = JSON.parse(decoded.errors);
    return res.status(errors.status).json(errors);
  }
};

const updateOutletController = async (req, res) => {
  const id = req.params?.id || null;
  const { body } = req;
  try {
    const update = await updateByOutletByIdService(id, body);
    return res.status(200).json({
      message: "success update outlet",
      data: update,
    });
  } catch (error) {
    const decoded = JSON.parse(error.message);
    const errors = JSON.parse(decoded.errors);
    return res.status(errors.status).json(errors);
  }
};

const updateOutletSchema = yup.object().shape({
  name: yup.string(),
  address: yup.string(),
  phone: yup.string().matches(/^\d{9,16}$/, {
    message: "phone number must have 9 - 16 digits (example: 0812345678321)",
  }),
  email: yup.string().email("invalid email, (example : example@gmail.com)"),
});
module.exports = {
  storeOutletController,
  getOutletController,
  deleteOutletController,
  updateOutletController,
  storeOutletSchema,
  updateOutletSchema,
};
