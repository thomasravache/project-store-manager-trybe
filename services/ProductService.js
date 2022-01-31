const ProductModels = require('../models/ProductModel');

const create = async ({ name, quantity }) => {
  const createdProduct = await ProductModels.create({ name, quantity });

  return createdProduct;
};

module.exports = {
  create,
};
