import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { User } from './model/user.entity';

@Injectable()
export class UserService {
  constructor(private httpService: HttpService) {}

  async findOne(id: number) {
    const request = this.httpService
      .get(`http://user-service:3000/api/users/${id}`)
      .pipe(map((response) => response.data));
    const user: User = await lastValueFrom(request);
    return user;
  }
}
