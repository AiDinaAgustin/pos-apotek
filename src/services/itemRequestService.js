const {
    createRequest,
    createRequestDetails,
    getRequestById,
    getAllRequests,
    getRequestDetailsByRequestId,
    updateRequestStatus,
    countRequests
  } = require('../repositories/itemRequestRepository');
  const {
    updateItem,
    findItemById,
  } = require('../repositories/ItemRepository');
  
  const createRequestService = async (data, userId) => {
    const { items, ...requestData } = data;
    if (!Array.isArray(items)) {
      throw new Error('Items should be an array');
    }
    const newRequest = await createRequest(requestData, userId);
    for (const item of items) {
      await createRequestDetails({
        request_id: newRequest.id,
        item_id: item.item_id,
        qty: item.qty,
      });
    }
    return newRequest;
  };
  
  const getRequestByIdService = async (requestId) => {
    const request = await getRequestById(requestId);
    if (!request) throw new Error('Request not found');
  
    const requestDetails = await getRequestDetailsByRequestId(requestId);
    return {
      ...request,
      request_details: requestDetails
    };
  };
  
  const getRequestsService = async (page, search, sortBy, perPage, outletId, userId) => {
    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = perPage ? parseInt(perPage, 10) : 10;
    const skip = (currentPage - 1) * pageSize;
    sortBy = sortBy || 'created_at:desc';
  
    try {
      const [getRequests, totalData] = await Promise.all([
        getAllRequests(skip, pageSize, search, sortBy, outletId, userId),
        countRequests(search, outletId, userId),
      ]);
  
      const totalPages = Math.ceil(totalData / pageSize);
  
      return {
        requests: getRequests,
        currentPage: currentPage,
        total: totalData,
        totalPages: totalPages,
        prev: currentPage === 1 ? null : currentPage - 1,
        next: currentPage === totalPages ? null : currentPage + 1,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const updateRequestStatusService = async (requestId, status) => {
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }
    const updatedRequest = await updateRequestStatus(requestId, status);
    return updatedRequest;
  };
  
  module.exports = {
    createRequestService,
    getRequestByIdService,
    getRequestsService,
    updateRequestStatusService
  };