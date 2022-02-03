const connection = require('./connection');

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

module.exports = {
  create,
};