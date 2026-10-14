import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const token = request.headers['x-api-token'];
    const expectedToken = this.configService.get<string>('API_TOKEN');

    if (!expectedToken || token !== expectedToken) {
      throw new UnauthorizedException('Invalid or missing API token');
    }

    return true;
  }
}