import { Test, TestingModule } from '@nestjs/testing';
import { CanActivate } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { randomInt } from 'crypto';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductCreateDto } from './dtos/product-create.dto';
import { ProductUpdateDto } from './dtos/product-update.dto';
import { AuthGuard } from '../auth/auth/auth.guard';

const testProduct = {
  id: faker.datatype.uuid(),
  title: faker.lorem.words(5),
  description: faker.lorem.words(12),
  price: randomInt(10, 100),
};
const testProduct2 = {
  id: faker.datatype.uuid(),
  title: faker.lorem.words(5),
  description: faker.lorem.words(12),
  price: randomInt(10, 100),
};
const testProduct3 = {
  id: faker.datatype.uuid(),
  title: faker.lorem.words(5),
  description: faker.lorem.words(12),
  price: randomInt(10, 100),
};
describe('ProductController', () => {
  const mock_AuthGuard: CanActivate = { canActivate: jest.fn(() => true) };
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getAll: jest
              .fn()
              .mockResolvedValue([testProduct, testProduct2, testProduct3]),
            getSummary: jest.fn().mockResolvedValue([
              {
                id: testProduct.id,
                price: testProduct.price,
              },
              {
                id: testProduct2.id,
                price: testProduct2.price,
              },
              {
                id: testProduct3.id,
                price: testProduct3.price,
              },
            ]),
            findOne: jest
              .fn()
              .mockImplementation(({ id }) =>
                Promise.resolve({ ...testProduct, id }),
              ),
            insertOne: jest
              .fn()
              .mockImplementation((prod: ProductCreateDto) =>
                Promise.resolve({ id: 'some uuid create', ...prod }),
              ),
            updateOne: jest
              .fn()
              .mockImplementation((id: string, prod: ProductCreateDto) =>
                Promise.resolve({ id, ...prod }),
              ),
            deleteOne: jest.fn().mockResolvedValue({
              message: 'success',
            }),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mock_AuthGuard)
      .compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('all', () => {
    it('should get an array of products', () => {
      expect(controller.all()).resolves.toEqual([
        testProduct,
        testProduct2,
        testProduct3,
      ]);
    });
  });

  describe('summary', () => {
    it('should get an array of id and price of products', () => {
      expect(controller.summary()).resolves.toEqual([
        {
          id: testProduct.id,
          price: testProduct.price,
        },
        {
          id: testProduct2.id,
          price: testProduct2.price,
        },
        {
          id: testProduct3.id,
          price: testProduct3.price,
        },
      ]);
    });
  });

  describe('get by :id', () => {
    it('should get a single product', () => {
      expect(controller.get(testProduct.id)).resolves.toEqual(testProduct);
    });
  });

  describe('create', () => {
    it('should create a new product', () => {
      const productCreateDto: ProductCreateDto = {
        title: faker.lorem.words(5),
        description: faker.lorem.words(12),
        price: randomInt(10, 100),
      };
      expect(controller.create(productCreateDto)).resolves.toEqual({
        id: 'some uuid create',
        ...productCreateDto,
      });
    });
  });

  describe('update', () => {
    it('should update a new cat', () => {
      const id = 'some uuid update';
      const productUpdateDto: ProductUpdateDto = {
        title: faker.lorem.words(5),
        description: faker.lorem.words(12),
        price: randomInt(10, 100),
      };
      expect(controller.update(id, productUpdateDto)).resolves.toEqual({
        id,
        ...productUpdateDto,
      });
    });
  });

  describe('delete', () => {
    it('should return success and call the delete func', () => {
      expect(controller.delete('existingUuid')).resolves.toEqual({
        message: 'success',
      });
    });
    it('should return that it did not delete a cat', () => {
      const deleteSpy = jest
        .spyOn(service, 'deleteOne')
        .mockResolvedValueOnce(
          Promise.reject({ message: 'uuid does not exists' }),
        );
      expect(controller.delete('unexistingUuid')).resolves.toEqual({
        message: 'uuid does not exists',
      });
      expect(deleteSpy).toBeCalledWith('unexistingUuid');
    });
  });
});
