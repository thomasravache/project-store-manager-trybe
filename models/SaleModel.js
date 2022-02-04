const connection = require('./connection');

const serialize = (sale) => {
  const productId = 'product_id';

  return {
    saleId: sale.id,
    date: sale.date,
    [productId]: sale.product_id,
    quantity: sale.quantity,
  };
};

const create = async (salesOrder) => {
  const saleQuery = `
    INSERT INTO
      sales (date)
    VALUES
      (NOW());
  `;

  const [saleRow] = await connection.execute(saleQuery);

  const productSaleQuery = `
    INSERT INTO
    sales_products (sale_id, product_id, quantity)
    VALUES
    (?, ?, ?)
  `;
  
  const productId = 'product_id';
  salesOrder.forEach(async (sale) => {
    await connection.execute(productSaleQuery, [saleRow.insertId, sale[productId], sale.quantity]);
  });

  return saleRow;
};

const getAll = async () => {
  const query = `
    SELECT
      s.id, s.date, sp.product_id, sp.quantity
    FROM
      sales AS s
      INNER JOIN sales_products AS sp ON s.id = sp.sale_id;
  `;

  const [sales] = await connection.execute(query);

  return sales.map(serialize);
};

const getById = async ({ id }) => {
  const query = `
    SELECT
      s.date, sp.product_id, sp.quantity
    FROM
      sales AS s
    INNER JOIN
      sales_products AS sp ON s.id = sp.sale_id
    WHERE
      s.id = ?;
  `;
  const [saleRow] = await connection.execute(query, [id]);
  return saleRow.map(serialize);
};

const update = async ({ saleId, salesOrder }) => {
  const query = `
    UPDATE
      sales_products
    SET
      quantity = ?
    WHERE
      sale_id = ? AND product_id = ?;
  `;

  const productId = 'product_id';

  salesOrder.forEach(async (sale) => {
    await connection.execute(query, [sale.quantity, saleId, sale[productId]]);
  });
};

const removeSale = async ({ saleId }) => {
  const query = `
    DELETE FROM
      sales
    WHERE
      id = ?;
  `;

  await connection.execute(query, [saleId]);
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  removeSale,
};