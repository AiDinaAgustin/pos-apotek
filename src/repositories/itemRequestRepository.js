const prisma = require("../db");

const generateNextRequestId = async () => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const nextRequestId = `REQ${randomNumber}`;
  return nextRequestId;
};

const generateNextRequestDetailId = async () => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const nextRequestDetailId = `REQD${randomNumber}`;
  return nextRequestDetailId;
};

const createRequest = async (requestData, userId) => {
    if (!requestData.outlet_id) {
      throw new Error("Outlet ID is required");
    }
  
    const requestId = await generateNextRequestId();
  
    const request = await prisma.item_requests.create({
      data: {
        id: requestId,
        user: {
          connect: {
            id: userId,
          },
        },
        outlet: {
          connect: {
            id: requestData.outlet_id,
          },
        },
        requested_at: new Date(requestData.requested_at),
        notes: requestData.notes,
      },
    });
    return request;
  };

const createRequestDetails = async (item) => {
  const requestDetailId = await generateNextRequestDetailId();
  try {
    const requestDetails = [];
    const detail = await prisma.item_request_details.create({
      data: {
        id: requestDetailId,
        request_id: item.request_id,
        item_id: item.item_id,
        qty: item.qty,
      },
    });
    requestDetails.push(detail);

    return requestDetails;
  } catch (error) {
    throw new Error(`Failed to create request details: ${error.message}`);
  }
};

const getRequestById = async (requestId) => {
  const request = await prisma.item_requests.findUnique({
    where: {
      id: requestId,
    },
    include: {
      item_request_details: {
        include: {
          item: true,
        },
      },
      user: true,
      outlet: true,
    },
  });
  return request;
};

const getAllRequests = async (
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

    const requests = await prisma.item_requests.findMany({
      where: whereConditions,
      include: {
        item_request_details: {
          include: {
            item: true,
          },
        },
        user: true,
        outlet: true,
      },
      orderBy: orderBy,
      skip: skip,
      take: pageSize,
    });

    return requests;
  } catch (error) {
    throw new Error(error.message);
  }
};

const countRequests = async (search, outletId, userId) => {
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

    const totalRequests = await prisma.item_requests.count({
      where: whereConditions,
    });

    return totalRequests;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getRequestDetailsByRequestId = async (requestId) => {
  try {
    const requestDetails = await prisma.item_request_details.findMany({
      where: {
        request_id: requestId,
      },
      include: {
        item: true,
      },
    });

    return requestDetails;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateRequestStatus = async (requestId, status) => {
    try {
      const updatedRequest = await prisma.item_requests.update({
        where: { id: requestId },
        data: { status: status },
      });
      return updatedRequest;
    } catch (error) {
      throw new Error(`Failed to update request status: ${error.message}`);
    }
  };


module.exports = {
  createRequest,
  createRequestDetails,
  countRequests,
  getRequestById,
  getAllRequests,
  getRequestDetailsByRequestId,
  updateRequestStatus
};