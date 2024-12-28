const prisma = require("../db/index");

const generateNextItemId = async () => {
  try {
    let lastItem = await prisma.stock_cards.findFirst({
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
      },
    });

    let nextIdNumber = 1; // Default to 1 if no previous item is found

    if (lastItem) {
      const lastIdNumber = parseInt(lastItem.id.replace("STK", ""), 10);
      nextIdNumber = lastIdNumber + 1;
    }

    let nextId = `STK${nextIdNumber.toString().padStart(4, "0")}`;

    // Ensure unique ID by checking if the generated ID already exists
    while (await prisma.stock_cards.findUnique({ where: { id: nextId } })) {
      nextIdNumber++;
      nextId = `STK${nextIdNumber.toString().padStart(4, "0")}`;
    }

    return nextId;
  } catch (error) {
    console.error("Error generating the next item ID:", error);
    throw new Error("Failed to generate the next item ID.");
  }
};

const createStockCard = async (itemData) => {
  try {
    const itemId = await generateNextItemId();

    const item = await prisma.$transaction(async (prisma) => {
      return await prisma.stock_cards.create({
        data: {
          id: itemId,
          item_id: itemData.item_id,
          outlet_id: itemData.outlet_id,
          stock_in: itemData.stock_in,
          stock_out: itemData.stock_out,
          current_stock: itemData.current_stock,
          transaction_type: itemData.transaction_type,
          transaction_id: itemData.transaction_id,
        },
      });
    });

    return item;
  } catch (error) {
    console.error("Error creating item:", error.message);
    throw new Error(error);
  }
};

const findStockCardById = async (itemId) => {
  try {
    const item = await prisma.stock_cards.findUnique({
      where: {
        item_id: itemId,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return item;
  } catch (error) {
    throw new Error(JSON.stringify({ status: 500, message: error.message }));
  }
};

const findStockCardLatest = async (itemId) => {
  try {
    const item = await prisma.stock_cards.findFirst({
      where: {
        item_id: itemId,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return item;
  } catch (error) {
    throw new Error(JSON.stringify({ status: 500, message: error.message }));
  }
};

const get = async (skip, pageSize = 10, search, sortBy, outletId, itemId) => {
  try {
    const searchConditions = [
      { id: { contains: search, mode: "insensitive" } },
      { transaction_id: { contains: search, mode: "insensitive" } },
    ];

    const orderBy = {};
    if (typeof sortBy === "string") {
      const [field, direction] = sortBy.split(":");
      orderBy[field] = direction.toLowerCase();
    }

    const whereConditions = {
      OR: searchConditions,
    };

    if (outletId) {
      whereConditions.outlet_id = outletId;
    }
    if (itemId) {
      whereConditions.item_id = itemId;
    }

    const items = await prisma.stock_cards.findMany({
      where: whereConditions,
      orderBy: orderBy,
      skip: skip,
      take: pageSize,
      include: {
        item: true,
        outlet: true,
      },
    });

    return items;
  } catch (error) {
    throw new Error(error.message);
  } finally {
    prisma.$disconnect();
  }
};

module.exports = {
  createStockCard,
  get,
  findStockCardById,
  findStockCardLatest,
};
