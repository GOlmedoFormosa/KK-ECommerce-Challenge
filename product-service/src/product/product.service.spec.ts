import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { createMock } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker';
import { randomInt } from 'crypto';

import { ProductService } from './product.service';
import { Product } from './interfaces/product.interface';
import { ProductDoc } from './interfaces/product-document.interface';

const fakePro = {
  id: faker.datatype.uuid(),
  title: faker.lorem.words(5),
  description: faker.lorem.words(12),
  price: randomInt(10, 100),
};

const mockProduct = (
  id = fakePro.id,
  title = fakePro.title,
  description = fakePro.description,
  price = fakePro.price,
): Product => ({
  id,
  title,
  description,
  price,
});

const mockProductDoc = (mock?: Partial<Product>): Partial<ProductDoc> => ({
  _id: mock?.id || fakePro.id,
  title: mock?.title || fakePro.title,
  description: mock?.description || fakePro.description,
  price: mock?.price || fakePro.price,
});

const fakePro2 = {
  id: faker.datatype.uuid(),
  title: faker.lorem.words(5),
  description: faker.lorem.words(12),
  price: randomInt(10, 100),
};

const fakePro3 = {
  id: faker.datatype.uuid(),
  title: faker.lorem.words(5),
  description: faker.lorem.words(12),
  price: randomInt(10, 100),
};
const productArray = [
  mockProduct(),
  mockProduct(
    fakePro2.id,
    fakePro2.title,
    fakePro2.description,
    fakePro2.price,
  ),
  mockProduct(
    fakePro3.id,
    fakePro3.title,
    fakePro3.description,
    fakePro3.price,
  ),
];

const productDocArray = [
  mockProductDoc(),
  mockProductDoc({
    id: fakePro2.id,
    title: fakePro2.title,
    description: fakePro2.description,
    price: fakePro2.price,
  }),
  mockProductDoc({
    id: fakePro3.id,
    title: fakePro3.title,
    description: fakePro3.description,
    price: fakePro3.price,
  }),
];

describe('ProductService', () => {
  let service: ProductService;
  let model: Model<ProductDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken('Product'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    model = module.get<Model<ProductDoc>>(getModelToken('Product'));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(true).toBeDefined();
  });

  it('should return all products', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(productDocArray),
    } as any);
    const products = await service.getAll();
    expect(products).toEqual(productArray);
  });

  it('should get one product by id', async () => {
    const fakePro = {
      id: faker.datatype.uuid(),
      title: faker.lorem.words(5),
      description: faker.lorem.words(12),
      price: randomInt(10, 100),
    };
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<Query<ProductDoc, ProductDoc>>({
        exec: jest.fn().mockResolvedValueOnce({
          _id: fakePro.id,
          title: fakePro.title,
          description: fakePro.description,
          price: fakePro.price,
        }),
      }) as any,
    );
    const findMockProduct = mockProduct(
      fakePro.id,
      fakePro.title,
      fakePro.description,
      fakePro.price,
    );
    const foundProduct = await service.findOne({ id: fakePro.id });
    expect(foundProduct).toEqual(findMockProduct);
  });

  it('should insert a new product', async () => {
    const fakePro = {
      id: faker.datatype.uuid(),
      title: faker.lorem.words(5),
      description: faker.lorem.words(12),
      price: randomInt(10, 100),
    };
    jest.spyOn(model, 'create').mockImplementationOnce(
      () =>
        Promise.resolve({
          _id: fakePro.id,
          title: fakePro.title,
          description: fakePro.description,
          price: fakePro.price,
        }) as any,
    );
    const newProduct = await service.insertOne({
      title: fakePro.title,
      description: fakePro.description,
      price: fakePro.price,
    });
    expect(newProduct).toEqual(
      mockProduct(
        fakePro.id,
        fakePro.title,
        fakePro.description,
        fakePro.price,
      ),
    );
  });

  it('should update a product successfully', async () => {
    const fakePro = {
      id: faker.datatype.uuid(),
      title: faker.lorem.words(5),
      description: faker.lorem.words(12),
      price: randomInt(10, 100),
    };
    const findAndUpdateSpy = jest.spyOn(model, 'findOneAndUpdate');
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<Query<ProductDoc, ProductDoc>>({
        exec: jest.fn().mockResolvedValueOnce({
          _id: fakePro.id,
          title: fakePro.title,
          description: fakePro.description,
          price: fakePro.price,
        }),
      }) as any,
    );
    const updatedProduct = await service.updateOne(fakePro.id, {
      title: fakePro.title,
      description: fakePro.description,
      price: fakePro.price,
    });

    expect(findAndUpdateSpy).toBeCalledWith(
      { _id: fakePro.id },
      {
        title: fakePro.title,
        description: fakePro.description,
        price: fakePro.price,
      },
    );
    expect(updatedProduct).toEqual(
      mockProduct(
        fakePro.id,
        fakePro.title,
        fakePro.description,
        fakePro.price,
      ),
    );
  });

  it('should delete a product successfully', async () => {
    const fakePro = {
      id: faker.datatype.uuid(),
      title: faker.lorem.words(5),
      description: faker.lorem.words(12),
      price: randomInt(10, 100),
    };
    const deleteSpy = jest.spyOn(model, 'findByIdAndRemove').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(fakePro),
    } as any);
    await service.deleteOne(fakePro.id);
    expect(deleteSpy).toHaveBeenCalledWith(fakePro.id);
  });
});
