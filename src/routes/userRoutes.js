const express = require("express");
const {
    handleCreateUser,
    handleGetUser,
    handleGetUsers,
    handleUpdateUser,
    handleDeleteUser,
    handleSignIn,
    signInSchema,
    updateUserSchema,
    signUpSchema,
    handleCreateAdmin
} = require("../controllers/userController");

const validateRequest = require("../validations/validations");
const { auth, admin } = require("../middlewares/auth")

const router = express.Router();

// Create User Staff & Kasir
router.post("/users", validateRequest(signUpSchema), auth, admin, handleCreateUser);

// Create Admin
router.post("/admins", handleCreateAdmin);

// signin
router.post("/signin", validateRequest(signInSchema), handleSignIn);

// Get a user by ID
router.get("/users/:id", auth,admin, handleGetUser);

// Get all users
router.get("/users", auth, admin, handleGetUsers);

// Update a user by ID
router.put("/users/:id", auth, admin, validateRequest(updateUserSchema), handleUpdateUser);

// Delete a user by ID
router.delete("/users/:id", auth, admin, handleDeleteUser);

module.exports = router;
