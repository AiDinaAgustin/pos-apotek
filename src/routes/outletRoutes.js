const express = require("express")

const {storeOutletController, getOutletController, deleteOutletController, updateOutletController, storeOutletSchema, updateOutletSchema} = require("../controllers/outletController")
const router = express.Router();

const { auth, admin } = require("../middlewares/auth");
const validateRequest = require("../validations/validations");

router.post("/outlets", validateRequest(storeOutletSchema), auth, admin, storeOutletController);
router.get("/outlets", auth, getOutletController);
router.delete("/outlets/:id", auth, admin, deleteOutletController)
router.put("/outlets/:id", validateRequest(updateOutletSchema), auth, admin, updateOutletController);

module.exports = router;
