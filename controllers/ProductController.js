const express = require('express');
const productSchema = require('../joiSchemas/product');
const ProductServices = require('../services/ProductService');

const productsRouter = express.Router();

const validate = (name, quantity) => {
  const { error } = productSchema.validate({ name, quantity });
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
    return next(e);
  }
};

const getAll = async (_req, res) => {
  const products = await ProductServices.getAll();

  return res.status(200).json(products);
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await ProductServices.getById({ id });

    return res.status(200).json(product);
  } catch (e) {
    return next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, quantity } = req.body;
    validate(name, quantity);
    const updatedProduct = await ProductServices.update({ id, name, quantity });

    return res.status(200).json(updatedProduct);
  } catch (e) {
    return next(e);
  }
};

/* ----- ROTAS ----- */
productsRouter.post('/', create);
productsRouter.get('/', getAll);
productsRouter.get('/:id', getById);
productsRouter.put('/:id', update);

module.exports = {
  productRouter: productsRouter,
  create,
  validate,
  getAll,
  getById,
  update,
};
