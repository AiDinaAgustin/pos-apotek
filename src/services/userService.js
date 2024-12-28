const {
  createUser,
  findUserById,
  findUserByEmail,
  get,
  updateUser,
  createAdmin,
  toggleDeleteUser
} = require("../repositories/UserRepository");

const bcrypt = require("bcryptjs");

const createUserService = async (userData) => {
  const { email } = userData;

  const existingUserByEmail = await findUserByEmail(email);
  if (existingUserByEmail) {
    throw new Error(
      JSON.stringify({
        status: 400,
        errors: { email: "email already exists" },
      })
    );
  }

  return await createUser(userData);
};

const createAdminService = async (userData) => {
  const { email } = userData;

  const existingUserByEmail = await findUserByEmail(email);
  if (existingUserByEmail) {
    throw new Error(
      JSON.stringify({
        status: 400,
        errors: { email: "email already exists" },
      })
    );
  }

  return await createAdmin(userData);
};

const signInService = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }
  return user;
};

const getUserService = async (userId) => {
  const user = await findUserById(userId);
  if (!user) throw Error(
    JSON.stringify({
      status: 404,
      errors: { id: "user not found" },
    })
  );
  return user;
};

const getUsersService = async (page, search, sortBy) => {
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = 10;
  const skip = (currentPage - 1) * pageSize;
  try {
    const getUsers = await get(skip, pageSize, search, sortBy);
    const totalData = getUsers.length;
    const totalPages = Math.ceil(totalData / pageSize);
    return {
      users: getUsers,
      currentPage: currentPage,
      total: totalData,
      totalPages: totalPages,
      prev: currentPage == 1 ? null : currentPage - 1,
      next: currentPage == totalPages ? null : currentPage + 1,
    };
  } catch (error) {
    throw Error(error.message);
  }
};

const updateUserService = async (userId, userData) => {
  const existingUser = await findUserById(userId);
  if (!existingUser) throw Error(
    JSON.stringify({
      status: 404,
      errors: { id: "user not found" },
    })
  );
  return await updateUser(userId, userData);
};

const deleteUserService = async (userId) => {
  const user = await findUserById(userId);
  if (!user) throw Error(
    JSON.stringify({
      status: 404,
      errors: { id: "user not found" },
    })
  );

  return await toggleDeleteUser(userId);
};

module.exports = {
  createUserService,
  createAdminService,
  signInService,
  getUserService,
  getUsersService,
  updateUserService,
  deleteUserService
};