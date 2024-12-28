const prisma = require("../db");

const generateNextReceptionId = async () => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const nextReceptionId = `RCP${randomNumber}`;
  return nextReceptionId;
};

const generateNextReceptionDetailId = async () => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const nextReceptionId = `RCPD${randomNumber}`;
  return nextReceptionId;
};

const createReception = async (receptionData, userId) => {
  if (!receptionData.outlet_id || !receptionData.kode_po) {
    throw new Error("Outlet ID and Kode PO are required");
  }

  const receptionId = await generateNextReceptionId();

  const reception = await prisma.item_receptions.create({
    data: {
      id: receptionId,
      user: {
        connect: {
          id: userId,
        },
      },
      outlet: {
        connect: {
          id: receptionData.outlet_id,
        },
      },
      request: {
        connect: {
          id: receptionData.kode_po,
        },
      },
      date_po: new Date(receptionData.date_po),
    },
  });
  return reception;
};

const createReceptionDetails = async (item) => {
  const receptionDetailId = await generateNextReceptionDetailId();
  try {
    const receptionDetails = [];
    const detail = await prisma.item_reception_details.create({
      data: {
        id: receptionDetailId,
        receptions_id: item.receptions_id,
        item_id: item.item_id,
        quantity: item.quantity,
      },
    });
    receptionDetails.push(detail);

    return receptionDetails;
  } catch (error) {
    throw new Error(`Failed to create reception details: ${error.message}`);
  }
};

const getReceptionById = async (receptionId) => {
  const reception = await prisma.item_receptions.findUnique({
    where: {
      id: receptionId,
    },
    include: {
      item_reception_details: {
        include: {
          item: true,
        },
      },
      user: true,
      outlet: true,
      request: true,
    },
  });
  return reception;
};

const getAllReceptions = async (
  skip,
  pageSize = 10,
  search,
  sortBy,
  outletId,
  userId
) => {
  try {
    const whereConditions = {};

    if (search) {
      whereConditions.OR = [
        { id: { contains: search, mode: "insensitive" } },
      ];
    }

    if (outletId) {
      whereConditions.outlet_id = outletId;
    }

    if (userId) {
      whereConditions.user_id = userId;
    }

    const orderBy = {};
    if (typeof sortBy === "string") {
      const [field, direction] = sortBy.split(":");
      if (["asc", "desc"].includes(direction.toLowerCase())) {
        orderBy[field] = direction.toLowerCase();
      } else {
        orderBy["created_at"] = "desc"; 
      }
    }

    const receptions = await prisma.item_receptions.findMany({
      where: whereConditions,
      include: {
        item_reception_details: {
          include: {
            item: true,
          },
        },
        user: true,
        outlet: true,
        request: true,
      },
      orderBy: orderBy,
      skip: skip,
      take: pageSize,
    });

    return receptions;
  } catch (error) {
    throw new Error(error.message);
  }
};

const countReceptions = async (search, outletId, userId) => {
  try {
    const whereConditions = {};

    if (search) {
      whereConditions.OR = [
        { id: { contains: search, mode: "insensitive" } },
      ];
    }

    if (outletId) {
      whereConditions.outlet_id = outletId;
    }

    if (userId) {
      whereConditions.user_id = userId;
    }

    const totalReceptions = await prisma.item_receptions.count({
      where: whereConditions,
    });

    return totalReceptions;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getReceptionDetailsByReceptionId = async (receptionId) => {
  try {
    const receptionDetails = await prisma.item_reception_details.findMany({
      where: {
        receptions_id: receptionId,
      },
      include: {
        item: true,
      },
    });

    return receptionDetails;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createReception,
  createReceptionDetails,
  countReceptions,
  getReceptionById,
  getAllReceptions,
  getReceptionDetailsByReceptionId,
};