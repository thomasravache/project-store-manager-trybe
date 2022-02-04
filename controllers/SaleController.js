const express = require('express');
const saleSchema = require('../joiSchemas/sale');
const SaleServices = require('../services/SaleService');

const salesRouter = express.Router();

const validate = (productId, quantity) => {
  const { error } = saleSchema.validate({ productId, quantity });

  if (error) throw error;

  return true;
};

const create = async (req, res, next) => {
  try {
    req.body.forEach(({ product_id, quantity }) => {
      validate(product_id, quantity);
    });
    const sale = await SaleServices.create(req.body);

    return res.status(201).json(sale);
  } catch (e) {
    return next(e);
  }
};

const getAll = async (_req, res) => {
  const sales = await SaleServices.getAll();

  res.status(200).json(sales);
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sale = await SaleServices.getById({ id });

    return res.status(200).json(sale);
  } catch (e) {
    return next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;

    body.forEach(({ product_id, quantity }) => {
      validate(product_id, quantity);
    });

    const updatedSale = await SaleServices.update({ saleId: parseInt(id, 10), salesOrder: body });

    res.status(200).json(updatedSale);
  } catch (e) {
    return next(e);
  }
};

salesRouter.post('/', create);
salesRouter.get('/', getAll);
salesRouter.get('/:id', getById);
salesRouter.put('/:id', update);

module.exports = {
  salesRouter,
  validate,
  create,
  getAll,
  getById,
};
