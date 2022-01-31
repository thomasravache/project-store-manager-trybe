const { expect } = require('chai');
const sinon = require('sinon');

const connection = require('../../models/connection');
const ProductModels = require('../../models/ProductModel');

describe('--- TESTES DA CAMADA DE MODEL ---', () => {
  describe('--- (create) --- Insere um produto no banco de dados', () => {
    describe('quando é inserido com sucesso', () => {
      const payload = {
        id: 1,
        name: 'produto',
        quantity: 10
      };

      before(async () => {
        const executed = [{ insertId: 1 }];

        sinon.stub(connection, 'execute').resolves(executed);
      });

      after(async () => {
        connection.execute.restore();
      });

      it('deve retornar um objeto', async () => {
        const response = await ProductModels.create(payload);

        expect(response).to.be.a('object');
      });

      it('deve conter as chaves "id", "name", "quantity"', async () => {
        const response = await ProductModels.create(payload);

        expect(response).to.have.keys('id', 'name', 'quantity');
      });
    });
  });
});
