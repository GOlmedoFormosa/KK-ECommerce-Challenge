import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      if (!request || !request.cookies || !request.cookies['jwt']) {
        return false;
      }
      const user = await this.authService.authorize(request.cookies['jwt']);
      return user ? true : false;
    } catch (err) {
      console.log('error', err);
      return false;
    }
  }
}
