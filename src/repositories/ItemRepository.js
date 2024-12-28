const prisma = require("../db");

const generateNextItemId = async () => {
  const epochTime = Date.now();
  const nextReceptionId = `ITM${epochTime}`;
  return nextReceptionId;
};

const createItem = async (itemData) => {
  try {
    const itemId = await generateNextItemId();
    const item = await prisma.items.create({
      data: {
        id: itemId,
        name: itemData.name,
        description: itemData.description,
        price: parseInt(itemData.price, 10),
        unit: itemData.unit,
        stock: itemData.stock,
        outlet: {
          connect: { id: itemData.outlet_id },
        },
      },
    });
    return item;
  } catch (error) {
    throw new Error(JSON.stringify({ status: 500, message: error.message }));
  }
};

const findItemById = async (itemId) => {
  try {
    const item = await prisma.items.findUnique({
      where: {
        id: itemId,
      },
      include: {
        outlet: true,
      },
    });
    return item;
  } catch (error) {
    throw new Error(JSON.stringify({ status: 500, message: error.message }));
  }
};

const get = async (skip, pageSize, search, sortBy, outletId) => {
  try {
    const whereConditions = {
      deleted: false,
    };

    if (outletId) {
      whereConditions.outlet_id = outletId;
    }

    const orderBy = {};
    if (typeof sortBy === "string" && sortBy.includes(":")) {
      const [field, direction] = sortBy.split(":");
      orderBy[field] = direction.toLowerCase();
    } else {
      orderBy["created_at"] = "desc";
    }

    // Ambil semua data tanpa filter pencarian
    const allItems = await prisma.items.findMany({
      where: whereConditions,
      include: {
        outlet: true,
      },
      orderBy: orderBy,
    });

    // Sequential Search
    const searchResults = sequentialSearch(allItems, search);

    // Binary Search
    // const sortedItems = allItems.sort((a, b) => a.name.localeCompare(b.name)); // Sort by name
    // const searchResults = binarySearch(sortedItems, search);

    // Pagination
    const paginatedItems = searchResults.slice(skip, skip + pageSize);

    return paginatedItems;
  } catch (error) {
    throw new Error(error.message);
  } finally {
    await prisma.$disconnect();
  }
};

function sequentialSearch(array, searchTerm) {
  const results = [];
  const searchLower = searchTerm.toLowerCase();

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (
      item.name.toLowerCase().includes(searchLower) || 
      item.description.toLowerCase().includes(searchLower)
    ) {
      console.log(`Match found at index: ${i}, Item:`, item);
      results.push(item);
    }
  }
  return results;
}

function binarySearch(array, searchTerm) {
  const results = [];
  const searchLower = searchTerm.toLowerCase();
  let start = 0;
  let end = array.length - 1;

  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    const midItem = array[mid];

    if (midItem.name.toLowerCase().includes(searchLower)) {
      console.log(`Mid Item Match found at index: ${mid}, Item:`, midItem);
      results.push(midItem);

      // Periksa elemen di sebelah kiri dan kanan mid untuk kecocokan lainnya
      let left = mid - 1;
      while (left >= 0 && array[left].name.toLowerCase().includes(searchLower)) {
        console.log(`Left Item Match found at index: ${left}, Item:`, array[left]);
        results.push(array[left]);
        left--;
      }
      let right = mid + 1;
      while (right < array.length && array[right].name.toLowerCase().includes(searchLower)) {
        console.log(`Right Item Match found at index: ${right}, Item:`, array[right]);
        results.push(array[right]);
        right++;
      }
      break;
    }

    if (midItem.name.toLowerCase() < searchLower) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  return results;
}



const updateItem = async (itemId, itemData) => {
  const item = await prisma.items.update({
    where: {
      id: itemId,
    },
    data: itemData,
    include: {
      outlet: true,
    },
  });

  return item;
};

const deleteItem = async (itemId) => {
  const item = await prisma.items.update({
    where: {
      id: itemId,
    },
    data: {
      deleted: true,
    },
  });

  return item;
};

const toggleDeleteItem = async (itemId) => {
  const item = await prisma.items.findUnique({
    where: {
      id: itemId,
    },
  });

  if (!item) {
    throw new Error("data not found");
  }

  const updatedItem = await prisma.items.update({
    where: {
      id: itemId,
    },
    data: {
      deleted: !item.deleted,
    },
  });

  return updatedItem;
};

const count = async () => {
  try {
    const items = await prisma.items.count({
      where: { deleted: false },
    });
    return items;
  } catch (error) {
    throw new Error(error.message);
  } finally {
    prisma.$disconnect();
  }
};

const getLowStockItems = async (skip, pageSize, search, sortBy, outletId) => {
  try {
    const searchConditions = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];

    const orderBy = {};
    if (typeof sortBy === "string" && sortBy.includes(":")) {
      const [field, direction] = sortBy.split(":");
      orderBy[field] = direction.toLowerCase();
    } else {
      // Default sorting if sortBy is not provided or invalid
      orderBy["created_at"] = "desc";
    }

    const whereConditions = {
      stock: {
        lt: 21,
      },
      deleted: false,
      OR: searchConditions,
    };

    if (outletId) {
      whereConditions.outlet_id = outletId;
    }

    const items = await prisma.items.findMany({
      where: whereConditions,
      include: {
        outlet: true,
      },
      orderBy: orderBy,
      skip: skip,
      take: pageSize,
    });
    return items;
  } catch (error) {
    throw new Error(error.message);
  }
};


module.exports = {
  createItem,
  get,
  findItemById,
  deleteItem,
  updateItem,
  toggleDeleteItem,
  count,
  getLowStockItems,
};
