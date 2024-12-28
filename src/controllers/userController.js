const {
  createUserService,
  createAdminService,
  signInService,
  getUserService,
  getUsersService,
  updateUserService,
  deleteUserService
} = require("../services/userService");

const jwt = require("jsonwebtoken");
const yup = require("yup");

const handleCreateUser = async (req, res) => {
  try {
    const newUserData = req.body;
    const newUser = await createUserService(newUserData);
    delete newUser.password;
    res.status(201).json({ message: "User created successfully", data: newUser });
  } catch (error) {
    const errorMessage = JSON.parse(error.message);
    res.status(errorMessage.status).json({ errors: errorMessage.errors });
  }
};

const handleCreateAdmin = async (req, res) => {
  try {
    const newAdminData = req.body;
    const newAdmin = await createAdminService(newAdminData);
    delete newAdmin.password;
    res.status(201).json({ message: "Admin created successfully", user: newAdmin });
  } catch (error) {
    const errorMessage = JSON.parse(error.message);
    res.status(errorMessage.status).json({ errors: errorMessage.errors });
  }
};

const handleSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await signInService(email, password);
    const token = jwt.sign(
      {
        userToken: user.id,
        name: user.name,
        outlet_id: user.outlet_id,
        email: user.email,
        role: user.role,
        exp: parseInt(new Date().getTime() / 1000 + 6 * 60 * 60),
      },
      process.env.JWT_SECRET
    );
    res.cookie("jwt", token, { httpOnly: false, maxAge: 6 * 60 * 60 * 1000 });
    res.cookie('user', (user.email), { httpOnly: false });
    delete user.password;
    res.status(200).json({ message: "Login successful", data: user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const handleGetUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserService(userId);
    delete user.password;
    res.status(200).json({
      message: "Data found",
      data: user
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const handleGetUsers = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "created_at:desc";
    const users = await getUsersService(page, search, sortBy);


    const usersWithoutPassword = users.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.status(200).json({
      message: "Data found",
      data: usersWithoutPassword,
      pagination: {
        currentPage: users.currentPage,
        prev: users.prev,
        next: users.next,
        totalData: users.total,
        totalPages: users.totalPages,
      },
    });
  } catch (error) {
    if (error.message === "data not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const handleUpdateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;
    const updatedUser = await updateUserService(userId, userData);
    delete updatedUser.password;
    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const handleDeleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await deleteUserService(userId);
    delete updatedUser.password;
    res.status(200).json({
      message: `User ${updatedUser.deleted ? 'deleted' : 'restored'} successfully`,
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUserSchema = yup.object().shape({
  name: yup.string().required().max(50, "Name must be at most 50 characters long"),
  email: yup
    .string()
    .email("Email must be a valid email address")
    .matches(/^[^\s]*$/, "Email must not contain spaces"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/^[^\s]*$/, "Password must not contain spaces"),
  role: yup.string().oneOf(["STAFF", "KASIR", "ADMIN"]),
  outlet_id: yup.string().required()
});

const signUpSchema = yup.object().shape({
  name: yup.string().required().max(50, "Name must be at most 50 characters long"),
  email: yup
    .string()
    .required("Email is required")
    .email("Email must be a valid email address")
    .matches(/^[^\s]*$/, "Email must not contain spaces"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/^[^\s]*$/, "Password must not contain spaces"),
  role: yup.string().oneOf(["STAFF", "KASIR", "ADMIN"]),
  outlet_id: yup.string().required()
});

const signInSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Email must be a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/^[^\s]*$/, "Password must not contain spaces"),
});

module.exports = {
  handleCreateUser,
  handleGetUser,
  handleGetUsers,
  handleUpdateUser,
  handleDeleteUser,
  handleCreateAdmin,
  signUpSchema,
  updateUserSchema,
  signInSchema,
  handleSignIn
};