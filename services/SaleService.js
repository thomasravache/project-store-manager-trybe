const SaleModels = require('../models/SaleModel');
const ProductModels = require('../models/ProductModel');

const create = async (salesOrder) => {
  const productId = 'product_id';
  const products = await ProductModels.getAll();

  const error = salesOrder
    .some((sale) => !products.some(({ id }) => id === sale[productId])); // console.log(`produto com id ${sale[productId]} foi encontrado? ${products.some(({ id }) => id === sale[productId])} então retorne error = ${!products.some(({ id }) => id === sale[productId])}`);

  if (error) throw new Error('There are product(s) that were not found');

  const { insertId } = await SaleModels.create(salesOrder);

  return {
    id: insertId,
    itemsSold: salesOrder,
  };
};

module.exports = {
  create,
};