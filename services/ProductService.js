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

const getAll = async () => {
  const products = await ProductModels.getAll();

  return products;
};

const getById = async ({ id }) => {
  const product = await ProductModels.getById({ id });

  if (product.length === 0) throw new Error('Product not found');

  return product[0];
};

const update = async ({ id, name, quantity }) => {
  const productToUpdate = await ProductModels.getById({ id });

  if (productToUpdate.length === 0) throw new Error('Product not found');

  await ProductModels.update({ id, name, quantity });

  return {
    id,
    name,
    quantity,
  };
};

const removeProduct = async ({ id }) => {
  const productToDelete = await ProductModels.getById({ id });

  if (productToDelete.length === 0) throw new Error('Product not found');

  await ProductModels.removeProduct({ id });

  return {
    id,
    name: productToDelete[0].name,
    quantity: productToDelete[0].quantity,
  };
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  removeProduct,
};
