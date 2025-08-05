const paginate = async (model, query, page = 1, limit=10) => {

  if(limit === undefined || limit === null) {
    limit = 10;
  }

  const currentPage = parseInt(page, 10);
  const itemsPerPage = parseInt(limit, 10);
  const skip = (currentPage - 1) * itemsPerPage;

  const totalCount = await model.countDocuments(query);
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return {
    skip,
    pagination: {
      itemsPerPage,
      currentPage,
      totalItems: totalCount,
      totalPages,
    }
  };
};

module.exports = {
  paginate
};