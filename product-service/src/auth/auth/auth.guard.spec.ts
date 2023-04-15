import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { randomInt } from 'crypto';
import { ExecutionContext } from '@nestjs/common';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let service: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            authorize: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    guard = new AuthGuard(service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true with auth', async () => {
    const context = createMock<ExecutionContext>();

    context.switchToHttp().getRequest.mockReturnValue({
      cookies: {
        jwt: 'thisIsACookie',
      },
    });
    const user = {
      id: randomInt(10, 100),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
    };
    jest.spyOn(service, 'authorize').mockResolvedValue(user);
    const res = await guard.canActivate(context);
    expect(res).toBeTruthy();
  });

  it('should return false without cookie', async () => {
    const context = createMock<ExecutionContext>();

    context.switchToHttp().getRequest.mockReturnValue(undefined);
    const res = await guard.canActivate(context);
    expect(res).toBeFalsy();
  });

  it('should return false with an invalid credential', async () => {
    const context = createMock<ExecutionContext>();

    context.switchToHttp().getRequest.mockReturnValue({
      cookies: {
        jwt: 'thisIsACookie',
      },
    });
    jest.spyOn(service, 'authorize').mockReturnValue(undefined);
    const res = await guard.canActivate(context);
    expect(res).toBeFalsy();
  });
});
