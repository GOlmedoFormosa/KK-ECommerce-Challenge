import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { faker } from '@faker-js/faker';
import { randomInt } from 'crypto';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an authorized user', async () => {
    const fakeUser = {
      id: randomInt(10, 100),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
    };

    jest.spyOn(httpService, 'get').mockReturnValueOnce(
      of({
        data: fakeUser,
        headers: {},
        config: { url: 'http://user-service:3000/api/auth/authorize' },
        status: 200,
        statusText: 'OK',
      }) as any,
    );

    const userRes = await service.authorize('asdf');
    expect(userRes).toEqual(fakeUser);
  });
});
