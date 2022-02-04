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

const getAll = async () => SaleModels.getAll();

const getById = async ({ id }) => {
  const sale = await SaleModels.getById({ id });

  if (sale.length === 0) throw new Error('Sale not found');

  return sale;
};

const update = async ({ saleId, salesOrder }) => {
  const productId = 'product_id';
  const searchedSale = await SaleModels.getById({ id: saleId });

  if (searchedSale.length === 0) throw new Error('Sale not found');

  const error = salesOrder
  .some((saleToUpdate) => 
    !searchedSale.some((productSaled) => productSaled[productId] === saleToUpdate[productId]));

  if (error) throw new Error('There are products reported that were not found in this sale');

  await SaleModels.update({ saleId, salesOrder });

  return {
    saleId,
    itemUpdated: salesOrder,
  };
};

module.exports = {
  create,
  getAll,
  getById,
  update,
};