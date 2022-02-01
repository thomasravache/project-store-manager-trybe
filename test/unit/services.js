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
        sinon.stub(ProductModels, 'getAll').resolves([
          {
            id: 1,
            name: 'Produto 1',
            quantity: 1,
          },
          {
            id: 2,
            name: 'Produto 2',
            quantity: 2,
          },
        ]);
        sinon.stub(ProductModels, 'create').resolves({
          id: 1,
          name: 'Coca cola',
          quantity: 2,
        });
      });

      after(async () => {
        ProductModels.getAll.restore();
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

    describe('Quando o payload não é válido', () => {
      describe('o produto já é cadastrado', () => {
        const payload = {
          name: 'produto',
          quantity: 2,
        };

        before(async () => {
          sinon.stub(ProductModels, 'getAll').resolves([
            {
              id: 1,
              name: 'produto',
              quantity: 2
            },
          ]);
        });

        after(async () => {
          ProductModels.getAll.restore();
        });

        it('é lançado o erro "Product already exists"', async () => {
          try {
            await ProductServices.create(payload);
          } catch (e) {
            expect(e).to.be.exist;
            expect(e.message).to.be.equals('Product already exists');
          }
        });
      });
    });
  });
});