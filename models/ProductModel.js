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
      name, quantity
    FROM
      products;
  `;

  const [products] = await connection.execute(query);

  return products;
};

module.exports = {
  create,
  getAll,
};
