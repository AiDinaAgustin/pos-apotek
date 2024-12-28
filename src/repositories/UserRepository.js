const prisma = require("../db");
const bcrypt = require("bcryptjs");

const generateNextUserId = async () => {
  const epochTime = Date.now();
  const nextReceptionId = `USR${epochTime}`;
  return nextReceptionId;
};

const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const userId = await generateNextUserId();
  const user = await prisma.user.create({
    data: {
      id: userId,
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      outlet: userData.outlet_id ? { connect: { id: userData.outlet_id } } : undefined
    },
  });
  return user;
};


const createAdmin = async (userData, role = "ADMIN") => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const userId = await generateNextUserId();
  const user = await prisma.user.create({
    data: {
      id: userId,
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: role,
      outlet: userData.outlet_id ? { connect: { id: userData.outlet_id } } : undefined
    },
  });
  return user;
};

const findUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      outlet: true
    }
  });
  return user;
};

const findUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email
    },
    include: {
      outlet: true
    }
  });
  return user;
};

const findUserByName = async (name) => {
  const user = await prisma.user.findUnique({
    where: {
      name: name
    },
    include: {
      outlet: true
    }
  });
  return user;
};

const get = async (skip, pageSize = 10, search, sortBy) => {
  try {
    const searchConditions = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } }
    ];

    const validRoles = ["STAFF", "KASIR", "ADMIN"];
    if (validRoles.includes(search)) {
      searchConditions.push({ role: { equals: search } });
    }

    const orderBy = {};
    if (sortBy) {
      const [field, direction] = sortBy.split(':');
      orderBy[field] = direction.toLowerCase();
    }

    const users = await prisma.user.findMany({
      where: {
        deleted: false,
        OR: searchConditions,
      },
      skip: skip,
      take: pageSize,
      orderBy: orderBy,
      include: {
        outlet: true
      }
    });
    return users;
  } catch (error) {
    throw new Error(error.message);
  } finally {
    prisma.$disconnect();
  }
};

const deleteUser = async (userId) => {
  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      deleted: true
    }
  });
  return user;
};

const updateUser = async (userId, userData) => {
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  const { outlet_id, ...restUserData } = userData;
  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      ...restUserData,
      outlet: outlet_id ? { connect: { id: outlet_id } } : undefined
    },
    include: {
      outlet: true
    }
  });
  return user;
};

const toggleDeleteUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { deleted: !user.deleted },
  });

  return updatedUser;
};

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
  findUserByName,
  get,
  deleteUser,
  updateUser,
  createAdmin,
  toggleDeleteUser
};