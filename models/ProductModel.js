const connection = require('./connection');

const create = async ({ id, name, quantity }) => {
  const query = `
    INSERT INTO
      products (id, name, quantity)
    VALUES
      (?, ?, ?);
  `;
  
  const [createdRow] = await connection.execute(query, [id, name, quantity]);

  return {
    id: createdRow.insertId,
    name,
    quantity,
  };
};

module.exports = {
  create,
};
