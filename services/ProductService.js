const ProductModels = require('../models/ProductModel');

const create = async ({ name, quantity }) => {
  const products = await ProductModels.getAll();
  const someAlreadyExists = products.some((product) => product.name === name);
  if (someAlreadyExists) {
    throw new Error('Product already exists');
  }

  const createdProduct = await ProductModels.create({ name, quantity });

  return createdProduct;
};

module.exports = {
  create,
};
