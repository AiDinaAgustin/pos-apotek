const express = require('express');
const router = express.Router();
const {
  createRequestController,
  getRequestByIdController,
  getRequestsController,
  updateRequestStatusController,
  validationCreateRequest,
  validationCreateRequestDetails
} = require('../controllers/itemRequestController');
const { auth } = require("../middlewares/auth");
const validateRequest = require("../validations/validations");

router.post('/requests', auth, validateRequest(validationCreateRequest, validationCreateRequestDetails), createRequestController);
router.get('/requests/:id', auth, getRequestByIdController);
router.get('/requests', auth, getRequestsController);
router.put('/requests/:id', auth, updateRequestStatusController);


module.exports = router;