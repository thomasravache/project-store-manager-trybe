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

  describe('--- (getAll) --- Retorna todos os produtos cadastrados', () => {
    describe('quando os produtos são encontrados', () => {
      before(async () => {
        const modelReturn = [
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
        ];

        sinon.stub(ProductModels, 'getAll').resolves(modelReturn);
      });

      after(async () => {
        ProductModels.getAll.restore();
      });

      it('deve ser retornado um array de objetos', async () => {
        const products = await ProductServices.getAll();

        expect(products).to.be.an('array');

        products.forEach((product) => {
          expect(product).to.be.a('object');
          expect(product).to.have.all.keys('id', 'name', 'quantity');
        });
      });
    });

    describe('quando não encontra os produtos', () => {
      before(async () => {
        sinon.stub(ProductModels, 'getAll').resolves([]);
      });

      after(async () => {
        ProductModels.getAll.restore();
      });

      it('retorna um array vazio', async () => {
        const products = await ProductServices.getAll();

        expect(products).to.be.an('array').that.is.empty;
      });
    });
  });

  describe('--- (getById) --- Retorna um produto pelo Id', () => {
    const ID_EXAMPLE = 1;
    describe('quando o produto é encontrado', () => {
      before(async () => {
        sinon.stub(ProductModels, 'getById').resolves([{
          id: 1,
          name: 'Produto 1',
          quantity: 1,
        }]);
      });

      after(async () => {
        ProductModels.getById.restore();
      });

      it('deve retornar um objeto contendo o produto', async () => {
        const product = await ProductServices.getById(ID_EXAMPLE);

        expect(product).to.be.a('object');
        expect(product).to.deep.equal({
          id: 1,
          name: 'Produto 1',
          quantity: 1,
        });
      });
    });

    describe('quando o produto não é encontrado', () => {
      before(async () => {
        sinon.stub(ProductModels, 'getById').resolves([]);
      });

      after(async () => {
        ProductModels.getById.restore();
      });

      it('deve lançar um erro com a mensagem "Product not found"', async () => {
        try {
          await ProductServices.getById(ID_EXAMPLE);
        } catch (e) {
          expect(e).to.be.exist;
          expect(e.message).to.be.equal('Product not found');
        }
      });
    });
  });

  describe('--- (update) --- Atualiza um produto', () => {
    describe('quando o produto a ser alterado existe', () => {
      const payload = {
        id: 1,
        name: 'Produto alterado',
        quantity: 20,
      };

      before(async () => {
        sinon.stub(ProductModels, 'getById').resolves([
          {
            id: 1,
            name: 'Produto 1',
            quantity: 10,
          }
        ]);
        sinon.stub(ProductModels, 'update').resolves({ changedRows: 1 });
      });

      after(async () => {
        ProductModels.getById.restore();
        ProductModels.update.restore();
      });

      it('deve retornar um objeto com o produto alterado', async () => {
        const updatedProduct = await ProductServices.update(payload);

        expect(updatedProduct).to.be.a('object');
        expect(updatedProduct).to.deep.equal(payload);
      });
    });

    describe('quando o produto a ser alterado não existe', () => {
      const payload = {
        id: 38,
        name: 'produto que não existe',
        quantity: 3,
      };

      before(async () => {
        sinon.stub(ProductModels, 'getById').resolves([]);
        // sinon.stub(ProductModels, 'update').resolves([[]]);
      });

      after(async () => {
        // ProductModels.update.restore();
        ProductModels.getById.restore();
      });

      it('deve ser lançado um erro com a mensagem "Product not found"', async () => {
        try {
          await ProductServices.update(payload);
        } catch (e) {
          expect(e).to.be.exist;
          expect(e.message).to.be.equal('Product not found');
        }
      });
    });
  });

  describe('--- (removeProduct) --- remove um produto do banco de dados', () => {
    describe('quando o produto a ser deletado existe', () => {
      const ID_EXAMPLE = 1;
      before(async () => {
        sinon.stub(ProductModels, 'getById').resolves([
          {
            id: 1,
            name: 'Produto 1',
            quantity: 1,
          },
        ]);

        sinon.stub(ProductModels, 'removeProduct').resolves({ affectedRows: 1 });
      });

      after(async () => {
        ProductModels.getById.restore();
        ProductModels.removeProduct.restore();
      });

      it('deve devolver um objeto com o produto deletado', async () => {
        const result = await ProductServices.removeProduct({ id: ID_EXAMPLE });

        expect(result).to.deep.equal({
          id: 1,
          name: 'Produto 1',
          quantity: 1,
        });
      });
    });

    describe('quando o produto a ser deletado não existe', () => {
      const ID_EXAMPLE = 1;
      before(async () => {
        sinon.stub(ProductModels, 'getById').resolves([]);
      });

      after(async () => {
        ProductModels.getById.restore();
      });

      it('um erro deve ser lançado com a mensagem "Product not found"', async () => {
        try {
          await ProductServices.removeProduct({ id: ID_EXAMPLE });
        } catch (e) {
          expect(e).to.be.exist;
          expect(e.message).to.be.equal('Product not found');
        }
      });
    });
  });
});