const connection = require('./connection');

const productId = 'product_id';

const updateProductsQuantityQuery = (type) => {
  let procedure = '';

  if (type === 'create') procedure = '- ?'; // Ao criar uma venda é preciso diminuir a quantidade de produtos disponíveis
  if (type === 'update') procedure = '+ ? - ?'; // atualiza a quantidade dos produtos quando a venda é atualizada (qtdAtual + qtdVendaAnterior - qtdVendaAtualizada)
  if (type === 'remove') procedure = '+ ?'; // Ao remover uma venda é necessário devolver os produtos ao estoque.

  return `
    UPDATE products
    SET quantity=quantity ${procedure}
    WHERE id = ?;
  `;
};

const getLastQuantitySaleProduct = async (saleId, idProduct) => {
  const [lastSaleQuantity] = await connection.execute(`
    SELECT quantity FROM sales_products WHERE sale_id = ? AND product_id = ?
  `, [saleId, idProduct]);

  return lastSaleQuantity[0].quantity;
};

const serialize = (sale) => ({
    saleId: sale.id,
    date: sale.date,
    [productId]: sale.product_id,
    quantity: sale.quantity,
  });

const create = async (salesOrder) => {
  const saleQuery = `
    INSERT INTO sales (date) VALUES (NOW());
  `;
  const productSaleQuery = `
    INSERT INTO sales_products (sale_id, product_id, quantity)
    VALUES (?, ?, ?);
  `;

  const [saleRow] = await connection.execute(saleQuery);

  salesOrder.forEach(async (sale) => {
    await connection.execute(productSaleQuery, [saleRow.insertId, sale[productId], sale.quantity]); // cadastra a venda
    await connection
      .execute(updateProductsQuantityQuery('create'), [sale.quantity, sale[productId]]); // atualiza a quantidade de produtos disponíveis
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
    UPDATE sales_products
    SET quantity = ?
    WHERE sale_id = ? AND product_id = ?;
  `;

  salesOrder.forEach(async (sale) => {
    const lastQuantityInserted = await getLastQuantitySaleProduct(saleId, sale[productId]);
    await connection.execute(query, [sale.quantity, saleId, sale[productId]]); // atualiza as quantidades na venda
    await connection.execute(
          updateProductsQuantityQuery('update'),
          [lastQuantityInserted, sale.quantity, sale[productId]],
        ); // atualiza a quantidade de produtos disponíveis
  });
};

const removeSale = async ({ saleId }) => {
  const query = `
    DELETE FROM
      sales
    WHERE
      id = ?;
  `;

  const sale = await getById({ id: saleId });

  sale.forEach(async (soldProduct) => {
    await connection.execute(
      updateProductsQuantityQuery('remove'),
      [soldProduct.quantity, soldProduct[productId]],
    ); // devolve os produtos ao estoque após a deleção
  });

  await connection.execute(query, [saleId]);
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  removeSale,
};
