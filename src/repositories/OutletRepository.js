const prisma = require("../db");

const insert = async (request) => {
  try {
    const outlet = await prisma.$transaction(async (prisma) => {
      return await prisma.outlets.create({
        data: request,
      });
    });
    return outlet;
  } catch (error) {
    throw Error(`error performing insert outlet ${error.message}`);
  }
};

const get = async (skip, pageSize, search) => {
  try {
    const outlets = await prisma.outlets.findMany({
      where: {
        deleted: false,
        OR: [
          { id: { contains: search, mode: "insensitive" } },
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      },
      orderBy: { id: "desc" },
      skip: skip,
      take: pageSize,
    });
    return outlets;
  } catch (error) {
    throw new Error(error.message);
  } finally {
    prisma.$disconnect();
  }
};

const sofDelete = async (id) => {
  try {
    await prisma.$transaction(async (prisma) => {
      const deleteOutlet = await prisma.outlets.update({
        where: { id: id },
        data: { deleted: true },
      });
      return deleteOutlet;
    });
  } catch (error) {
    throw Error(`Error performing soft delete outlet : ${error.message}`);
  } finally {
    prisma.$disconnect();
  }
};

const findById = async (id) => {
  try {
    const find = await prisma.outlets.findFirst({
      where: { id: id },
    });
    return find;
  } catch (error) {
    throw Error(`error performing find by id ${error.message}`);
  } finally {
    prisma.$disconnect();
  }
};

const findByName = async (name) => {
  try {
    const find = await prisma.outlets.findFirst({
      where: { name: name },
    });
    return find;
  } catch (error) {
    throw Error(`error performing find by name ${error.message}`);
  } finally {
    prisma.$disconnect();
  }
};

const findByEmail = async (email) => {
  try {
    const find = await prisma.outlets.findFirst({
      where: { email: email },
    });
    return find;
  } catch (error) {
    throw Error(`error performing find by email ${error.message}`);
  } finally {
    prisma.$disconnect();
  }
};

const findByPhone = async (phone) => {
  try {
    const find = await prisma.outlets.findFirst({
      where: { phone: phone },
    });
    return find;
  } catch (error) {
    throw Error(`error performing find by phone ${error.message}`);
  } finally {
    prisma.$disconnect();
  }
};

const updateById = async (id, data) => {
  try {
    await prisma.$transaction(async () => {
      const update = await prisma.outlets.update({
        where: { id: id },
        data: data,
      });
      return update;
    });
  } catch (error) {
    throw Error(`Error performing update by id ${error.message}`);
  } finally {
    prisma.$disconnect();
  }
};

const count = async () => {
  try {
    const outlets = await prisma.outlets.count({
      where: { deleted: false },
    });
    return outlets;
  } catch (error) {
    throw new Error(error.message);
  } finally {
    prisma.$disconnect();
  }
};

module.exports = {
  insert,
  get,
  sofDelete,
  findById,
  updateById,
  findByName,
  findByEmail,
  findByPhone,
  count,
};
