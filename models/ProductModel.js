const connection = require('./connection');

const create = async ({ name, quantity }) => {
  const query = `
    INSERT INTO
      products (name, quantity)
    VALUES
      (?, ?);
  `;
  
  const [createdRow] = await connection.execute(query, [name, quantity]);

  return {
    id: createdRow.insertId,
    name,
    quantity,
  };
};

const getAll = async () => {
  const query = `
    SELECT
      id, name, quantity
    FROM
      products;
  `;

  const [products] = await connection.execute(query);

  return products;
};

const getById = async ({ id }) => {
  const query = `
    SELECT
      id, name, quantity
    FROM
      products
    WHERE
      id = ?
  `;

  const [product] = await connection.execute(query, [id]);

  return product;
};

const update = async ({ id, name, quantity }) => {
  const query = `
    UPDATE
      products
    SET
      name = ?, quantity = ?
    WHERE
      id = ?
  `;

  const [result] = await connection.execute(query, [name, quantity, id]);

  return result;
};

const removeProduct = async ({ id }) => {
  const query = `
    DELETE FROM
      products
    WHERE
      id = ?
  `;

  const [result] = await connection.execute(query, [id]);
  return result;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  removeProduct,
};
