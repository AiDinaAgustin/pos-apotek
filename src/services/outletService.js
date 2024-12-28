const {
  insert,
  get,
  sofDelete,
  findById,
  updateById,
  findByEmail,
  findByName,
  findByPhone,
  count
} = require("../repositories/OutletRepository");

const storeOutletService = async (request) => {
  try {
    const { name, address, email, phone } = request;
    const findOutletByEmail = await findByEmail(email);
    const findOutletByName = await findByName(name);
    const findOutletByPhone = await findByPhone(phone);

    if (findOutletByEmail)
      throw Error(
        JSON.stringify({
          status: 400,
          errors: { email: "email already exist" },
        })
      );
    if (findOutletByName)
      throw Error(
        JSON.stringify({ status: 400, errors: { name: "name already exist" } })
      );
    if (findOutletByPhone)
      throw Error(
        JSON.stringify({
          status: 400,
          errors: { phone: "phone number already exist" },
        })
      );

    const insertOutlet = await insert({
      id: "OUT" + Date.now(),
      name,
      address,
      email,
      phone,
      deleted: false,
    });
    return insertOutlet;
  } catch (error) {
    throw Error(JSON.stringify({ status: 500, errors: error.message }));
  }
};

const getOutletService = async (page, search, perPage) => {
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = perPage ? parseInt(perPage) : await count();
  const skip = (currentPage - 1) * pageSize;
  try {
    const getOutlets = await get(skip, pageSize, search);
    const totalData = getOutlets.length;
    const totalPages = Math.ceil(await count() / pageSize);
    return {
      outlets: getOutlets,
      currentPage: currentPage,
      total: totalData,
      totalPages: totalPages,
      prev: currentPage == 1 ? null : currentPage - 1,
      next: currentPage == totalPages ? null : currentPage + 1,
    };
  } catch (error) {
    throw Error(JSON.stringify({ status: 500, errors: error.message }));
  }
};

const softDeleteOutletService = async (id) => {
  try {
    const find = await findById(id);
    if (find === null)
      throw Error(JSON.stringify({ status: 404, errors: "data not found" }));
    const deleted = await sofDelete(id);
    return deleted;
  } catch (error) {
    throw Error(JSON.stringify({ status: 500, errors: error.message }));
  }
};

const updateByOutletByIdService = async (id, data) => {
  try {
    const { name, email, phone } = data;

    const [findOutletByEmail, findOutletByName, findOutletByPhone] =
      await Promise.all([
        findByEmail(email),
        findByName(name),
        findByPhone(phone),
      ]);

    if (findOutletByEmail && findOutletByEmail.id !== id) {
      throw new Error(
        JSON.stringify({
          status: 400,
          errors: { email: "Email already exists" },
        })
      );
    }
    if (findOutletByName && findOutletByName.id !== id) {
      throw new Error(
        JSON.stringify({ status: 400, errors: { name: "Name already exists" } })
      );
    }
    if (findOutletByPhone && findOutletByPhone.id !== id) {
      throw new Error(
        JSON.stringify({
          status: 400,
          errors: { phone: "Phone number already exists" },
        })
      );
    }

    const find = await findById(id);
    if (!find) {
      throw new Error(
        JSON.stringify({ status: 404, errors: "Data not found" })
      );
    }

    const updated = await updateById(id, data);
    return updated;
  } catch (error) {
    throw Error(JSON.stringify({ status: 500, errors: error.message }));
  }
};

module.exports = {
  storeOutletService,
  getOutletService,
  softDeleteOutletService,
  updateByOutletByIdService,
};
