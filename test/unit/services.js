const { expect } = require('chai');
const sinon = require('sinon');

const ProductModels = require('../../models/ProductModel');
const ProductServices = require('../../services/ProductService');

describe('--- TESTES DA CAMADA DE SERVICE ---', () => {
  describe('--- (create) --- Insere um novo produto no banco de dados', () => {
    describe('quando o payload é válido', () => {
      const payload = {
        name: 'Coca cola',
        quantity: 2,
      };

      before(async () => {
        sinon.stub(ProductModels, 'create').resolves({
          id: 1,
          name: 'Coca cola',
          quantity: 2,
        });
      });

      after(async () => {
        ProductModels.create.restore();
      });

      it('deve retornar um objeto', async () => {
        const response = await ProductServices.create(payload);

        expect(response).to.be.a('object');
      });

      it('deve conter as chaves "id", "name", "quantity"', async () => {
        const response = await ProductServices.create(payload);

        expect(response).to.have.keys('id', 'name', 'quantity');
      });

      it('deve conter o "id" mais valores correspondentes retornados pelo banco de dados', async () => {
        const response = await ProductServices.create(payload);

        expect(response).to.deep.equal({
          id: 1,
          name: 'Coca cola',
          quantity: 2,
        });
      })
    });
  });
});