const express = require('express');
const productSchema = require('../joiSchemas/product');
const ProductServices = require('../services/ProductService');

const productRouter = express.Router();

const validate = (name, quantity) => {
  const { error } = productSchema.validate({ name, quantity });
  console.log(error);
  if (error) throw error;

  return true;
};

const create = async (req, res, next) => {
  try {
    const { name, quantity } = req.body;
    validate(name, quantity);
    const createdProduct = await ProductServices.create({ name, quantity });
    return res.status(201).json(createdProduct);
  } catch (e) {
    next(e);
  }
};

/* ----- ROTAS ----- */
productRouter.post('/', create);

module.exports = {
  productRouter,
  create,
  validate,
};
