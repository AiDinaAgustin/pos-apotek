const {
    createRequestService,
    getRequestByIdService,
    getRequestsService,
    updateRequestStatusService
  } = require('../services/itemRequestService');
  
  const yup = require("yup");
  
  const createRequestController = async (req, res) => {
    try {
      const userId = req.user.userToken;
      const requestData = req.body;
  
      const request = await createRequestService(requestData, userId);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const getRequestByIdController = async (req, res) => {
    try {
      const request = await getRequestByIdService(req.params.id);
      res.status(200).json({
        message: "Data found",
        data: request,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };
  
  const getRequestsController = async (req, res) => {
    try {
      const { page, search, sortBy, perPage } = req.query;
      const outletId = req.query.outlet_id || null;
      const userId = req.query.user_id || null;
      const requests = await getRequestsService(page, search, sortBy, perPage, outletId, userId);
  
      res.status(200).json({
        message: "Data found",
        data: requests.requests,
        pagination: {
          currentPage: requests.currentPage,
          prev: requests.prev,
          next: requests.next,
          totalData: requests.total,
          totalPages: requests.totalPages,
        },
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const updateRequestStatusController = async (req, res) => {
    try {
      const { status } = req.body;
      const requestId = req.params.id;
  
      const updatedRequest = await updateRequestStatusService(requestId, status);
      res.status(200).json(updatedRequest);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const validationCreateRequest = yup.object().shape({
    outlet_id: yup.string().required("Outlet ID is required"), 
    requested_at: yup.date().required("Requested at is required"), 
  });
  
  const validationCreateRequestDetails = yup.object().shape({
    request_id: yup.string().required("Request ID is required"),
    item_id: yup.string().required("Item ID is required"),
    qty: yup
      .number()
      .required("Quantity is required")
      .positive("Quantity must be a positive number")
      .integer("Quantity must be an integer"),
  });
  
  module.exports = {
    createRequestController,
    getRequestByIdController,
    getRequestsController,
    updateRequestStatusController,
    validationCreateRequest,
    validationCreateRequestDetails
  };