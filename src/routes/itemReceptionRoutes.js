const express = require('express');
const router = express.Router();
const {
  createReceptionController,
  getReceptionByIdController,
  getReceptionsController,
  validationCreateReception,
  validationCreateReceptionDetails
} = require('../controllers/itemReceptionController');
const { auth } = require("../middlewares/auth");
const validateRequest = require("../validations/validations");


router.post('/receptions',auth, validateRequest(validationCreateReception,validationCreateReceptionDetails), createReceptionController);
router.get('/receptions/:id',auth, getReceptionByIdController);
router.get('/receptions',auth, getReceptionsController);

module.exports = router;
