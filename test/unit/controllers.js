const { expect } = require('chai');
const sinon = require('sinon');
const ProductServices = require('../../services/ProductService');
const ProductControllers = require('../../controllers/ProductController');
const ErrorController = require('../../controllers/ErrorController');

describe('--- TESTES DA CAMADA DE CONTROLLER ---', () => {
  describe('--- (create) --- Insere um novo produto', () => {
    describe('quando o req.body é válido', () => {
      const req = {};
      const res = {};
      let next = () => {};

      before(() => {
        req.body = { name: 'Coca cola', quantity: 2 };

        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns();
        next = sinon.stub().returns();

        sinon.stub(ProductServices, 'create').resolves({
          id: 1,
          name: 'Coca cola',
          quantity: 2,
        });
      });

      after(() => {
        ProductServices.create.restore();
      });

      it('deve retornar status "201"', async () => {
        await ProductControllers.create(req, res, next);
        
        expect(res.status.calledWith(201)).to.be.true;
      });
  
      it('deve retornar os dados inseridos', async () => {
        const json = {
          id: 1,
          name: 'Coca cola',
          quantity: 2,
        };
        await ProductControllers.create(req, res, next);
  
        expect(res.json.calledWith(json)).to.be.true;
      });
    });

    describe('quando o req.body não é valido', () => {
      const req = {};
      const res = {};
      let next = () => {};

      const testCases = [
        {},
        { quantity: 100 },
        { name: 'pro', quantity: 100 },
        { name: 'produto' },
        { name: 'produto', quantity: 'string' },
        { name: 'produto', quantity: -1 },
        { name: 'produto', quantity: 0 },
      ];

      before(() => {
        res.status = sinon.stub().returns(res);
        
        res.json = sinon.stub().returns();
        next = sinon.stub().returns();

        sinon.stub(ProductServices, 'create').resolves({
          id: 1,
          name: 'Coca cola',
          quantity: 2,
        });
      });

      after(() => {
        ProductServices.create.restore();
      });

      testCases.forEach((testCase) => {
        it(`funcao validate lança um erro quando req.body = ${JSON.stringify(testCase)}`, async () => {
          req.body = testCase;
          try {
            ProductControllers.validate(req.body);
          } catch (e) {
            expect(e).to.be.exist;
          }
        });

        it(`status não é 201 e json não é válido quando req.body = ${JSON.stringify(testCase)}`, async () => {
          req.body = testCase;
          await ProductControllers.create(req, res, next);
          
          expect(res.status.calledWith(201)).to.be.false;
          expect(res.json.calledWith({
            id: 1,
            name: 'Coca cola',
            quantity: 2,
          })).to.be.false;
        });
      })
    });
  });

  describe('--- (getAll) --- Retorna os produtos cadastrados ao client', () => {
    describe('quando existem registros a serem retornados', () => {
      const req = {};
      const res = {};
  
      const payload = [
        {
          id: 1,
          name: 'Produto 1',
          quantity: 2,
        },
        {
          id: 2,
          name: 'Produto 2',
          quantity: 2
        }
      ];
  
      before(() => {
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns();
  
        sinon.stub(ProductServices, 'getAll').resolves(payload);
      });
  
      after(() => {
        ProductServices.getAll.restore();
      });
  
      it('deve retornar status "200" e o json com o produto', async () => {
        await ProductControllers.getAll(req, res);
  
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(payload)).to.be.true;
      });
    });

    describe('quando não existem registros a sem retornados', () => {
      const req = {};
      const res = {};
  
      const payload = [];
  
      before(() => {
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns();
  
        sinon.stub(ProductServices, 'getAll').resolves([]);
      });
  
      after(() => {
        ProductServices.getAll.restore();
      });

      it('deve retornar status "200" com um json contendo um array vazio', async () => {
        await ProductControllers.getAll(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(payload)).to.be.true;
      });
    });
  });

  describe('--- (getById) --- Retorna um produto com base no id', () => {
    describe('quando o produto é encontrado', () => {
      const req = {};
      const res = {};
      let next = () => {};
      const payload = {
        id: 1,
        name: 'Produto 1',
        quantity: 1,
      };

      before(() => {
        req.params = { id: 1 };
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns();
        next = sinon.stub().returns();


        sinon.stub(ProductServices, 'getById').resolves(payload);
      });

      after(() => {
        ProductServices.getById.restore();
      });

      it('status seja "200" e o json contendo o produto', async () => {
        await ProductControllers.getById(req, res, next);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(payload)).to.be.true;
      });
    });

    describe('quando o produto não é encontrado', () => {
      const req = {};
      const res = {};
      let next = () => {};

      const payload = {
        id: 1,
        name: 'Produto 1',
        quantity: 1,
      };

      before(() => {
        req.params = { id: 1 };
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns();
        next = sinon.stub().returns();

        sinon.stub(ProductServices, 'getById').rejects(new Error('Product not found'));
      });

      after(() => {
        ProductServices.getById.restore();
      });

      it('status não deve ser "200" e json não deve conter um produto', async () => {
        await ProductControllers.getById(req, res, next);

        expect(res.status.calledWith(200)).not.to.be.true;
        expect(res.json.calledWith(payload)).not.to.be.true;
      });
    });
  });

  describe('--- (errorController) --- Trata os erros de input || negocio || inesperados', () => {
    describe('quando um erro é identificado', () => {
      describe('e o erro é de input (Joi)', () => {
        const errorTypes = [
          { code: 400, type: 'any.required' },
          { code: 422, type: 'string.min' },
          { code: 422, type: 'number.base' },
          { code: 422, type: 'string.base' },
          { code: 422, type: 'number.min' }
        ];
        let err = {
          isJoi: true,
          details: [
            {},
          ]
        };
        const req = {};
        const res = {};
        let next = () => {};
  
        before(() => {
          res.status = sinon.stub().returns(res);
          res.json = sinon.stub().returns();
          next = sinon.stub().returns();
  
        });
  
        it('Possui as keys "isJoi" e "details"', () => {
          ErrorController(err, req, res, next);
  
          expect(err).to.have.keys('isJoi', 'details');
        });

        it('se o tipo de erro não estiver tipificado deve retornar status "422"', () => {
          err.details[0].type = 'erro do joi não tipificado';
          
          ErrorController(err, req, res, next);

          expect(res.status.calledWith(422)).to.be.true;
        });

        errorTypes.forEach((errorType) => {
          let err = {
            isJoi: true,
            details: [
              { type: errorType.type, message: 'mensagem de erro do Joi' },
            ]
          };

          it(`retorna status "${errorType.code}" se o tipo for "${errorType.type}" e a mensagem de erro do Joi`, () => {
            ErrorController(err, req, res, next);
  
            expect(res.status.calledWith(errorType.code)).to.be.true;
            expect(res.json.calledWith({ message: 'mensagem de erro do Joi' })).to.be.true;
          });
        });
      });
    });
    
    describe('e o erro é de regra de negócio', () => {
      const errorTypes = [
        { code: 409, message: 'Product already exists' },
        { code: 404, message: 'Product not found' },
      ]
      const req = {};
      const res = {};
      let next = () => {};

      before(() => {
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns();
        next = sinon.stub().returns();
      });

      errorTypes.forEach((errorType) => {
        const err = {
          message: errorType.message,
        }
        it(`devolve status ${errorType.code} se o erro for "${errorType.message}"`, () => {
          ErrorController(err, req, res, next);

          expect(res.status.calledWith(errorType.code)).to.be.true;
        });

        it('devolve o json com a mensagem de erro respectiva', () => {
          ErrorController(err, req, res, next);

          expect(res.json.calledWith({ message: errorType.message })).to.be.true;
        });
      });
    });

    describe('e o erro é inesperado', () => {
      const err = {
        isJoi: false,
        message: undefined,
      };
      const req = {};
      const res = {};
      let next = () => {};

      before(() => {
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns();
        next = sinon.stub().returns();
      });

      it('o status deve ser "500"', () => {
        ErrorController(err, req, res, next);
        expect(res.status.calledWith(500)).to.be.true;
      });

      it('o json deve retornar a mensagem "Erro inesperado!"', () => {
        ErrorController(err, req, res, next);

        expect(res.json.calledWith({ message: 'Erro inesperado!' }));
      });
    });
  });
});