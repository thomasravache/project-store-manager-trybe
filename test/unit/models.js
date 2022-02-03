const { expect } = require('chai');
const sinon = require('sinon');

const connection = require('../../models/connection');
const ProductModels = require('../../models/ProductModel');
const SaleModels = require('../../models/SaleModel');

describe('--- TESTES DA CAMADA DE MODEL ---', () => {
  describe('--- PRODUCTS ---', () => {
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
  
    describe('--- (getAll) --- Retorna os produtos cadastrados', () => {
      describe('quando não tem produtos cadastrados', async () => {
        before(async () => {
          sinon.stub(connection, 'execute').resolves([[]]);
        });
    
        after(async () => {
          connection.execute.restore();
        });
    
        it('deve retornar um array vazio', async () => {
          const products = await ProductModels.getAll();
  
          expect(products).to.be.an('array');
          expect(products.length).to.be.equal(0);
        })
      });
  
      describe('quando tem produtos cadastrados', () => {
        const fakeProducts = [
          {
            id: 1,
            name: 'Produto 1',
            quantity: 1,
          },
          {
            id: 2,
            name: 'Produto 2',
            quantity: 2,
          }
        ];
  
        before(async () => {
          sinon.stub(connection, 'execute').resolves([fakeProducts]);
        });
  
        after(async () => {
          connection.execute.restore();
        });
  
        it('deve retornar um array de objetos', async () => {
          const products = await ProductModels.getAll();
  
          expect(products).to.be.an('array');
  
          products.forEach((product) => {
            expect(product).to.have.all.keys('id', 'name', 'quantity');
          })
        });
      });
    });
  
    describe('--- (getById) --- Retorna um produto específico pelo Id', () => {
      describe('quando o produto é encontrado', () => {
        const ID_EXAMPLE = 1;
        const product = {
          id: 1,
          name: 'Produto 1',
          quantity: 1
        };
  
        before(async () => {
          sinon.stub(connection, 'execute').resolves([[product]]);
        });
  
        after(async () => {
          connection.execute.restore();
        });
  
        it('deve retornar um array com apenas um objeto contendo o produto', async () => {
          const response = await ProductModels.getById(ID_EXAMPLE);
  
          expect(response).to.be.a('array');
          expect(response.length).to.be.equals(1);
          expect(response[0]).to.have.all.keys('id', 'name', 'quantity');
          expect(response[0].id).to.be.equals(ID_EXAMPLE);
        });
      });
  
      describe('quando o produto não é encontrado', async () => {
        const ID_EXAMPLE = 1;
  
        before(async () => {
          sinon.stub(connection, 'execute').resolves([[]]);
        });
  
        after(async () => {
          connection.execute.restore();
        });
  
        it('deve retornar um array vazio', async () => {
          const response = await ProductModels.getById(ID_EXAMPLE);
  
          expect(response).to.be.a('array').that.is.empty;
        });
      });
    });
  
    describe('--- (update) --- Atualiza um produto no banco de dados', () => {
      describe('quando a atualização é válida', () => {
        const payload = {
          id: 1,
          name: 'Produto 1',
          quantity: 2,
        };
  
        before(async () => {
          sinon.stub(connection, 'execute').resolves([{ changedRows: 1 }]);
        });
  
        after(async () => {
          connection.execute.restore();
        });
  
        it('deve retornar o objeto com a chave "changedRows" igual a 1', async () => {
          const result = await ProductModels.update(payload);
  
          expect(result.changedRows).to.be.equal(1);
        });
      });
    });
  
    describe('--- (removeProduct) --- Deleta um produto do banco de dados', () => {
      const idToDelete = 1;
  
      before(async () => {
        sinon.stub(connection, 'execute').resolves([{ affectedRows: 1 }]);
      });
  
      after(async () => {
        connection.execute.restore();
      });
  
      it ('deve retornar o objeto com a chave "affectedRows" igual a 1', async () => {
        const result = await ProductModels.removeProduct(idToDelete);
  
        expect(result.affectedRows).to.be.equal(1);
      });
    });
  });

  describe('--- SALES ---', () => {
    describe('--- (create) --- Cadastra uma venda no banco', () => {
      const payload = [
        {
          product_id: 1,
          quantity: 1,
        },
      ];
      before(async () => {
        sinon.stub(connection, 'execute').resolves([{ insertId: 1 }]);
      });

      after(async () => {
        connection.execute.restore();
      });

      it('deve retornar o objeto contendo o "insertId"', async () => {
        const response = await SaleModels.create(payload);

        expect(response.insertId).to.be.exist;
      });
    });
  });
});
