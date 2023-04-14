import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { User } from './model/user.entity';

@Injectable()
export class AuthService {
  constructor(private httpService: HttpService) {}

  async authorize(cookie: string) {
    const request = this.httpService
      .get(`http://user-service:3000/api/auth/authorize`, {
        headers: {
          Cookie: `jwt=${cookie}`,
        },
      })
      .pipe(map((response) => response.data));
    const user: User = await lastValueFrom(request);
    return user;
  }
}
