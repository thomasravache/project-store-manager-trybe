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
    req.body.forEach(({ quantity, product_id }) => {
      validate(product_id, quantity);
    });
    const sale = await SaleServices.create(req.body);

    return res.status(201).json(sale);
  } catch (e) {
    return next(e);
  }
};

salesRouter.post('/', create);

module.exports = {
  salesRouter,
  validate,
  create,
};
