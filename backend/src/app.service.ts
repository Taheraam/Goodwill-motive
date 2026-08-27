import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      status: 'ok',
      message: 'Goodwill Motive API is running',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
    };
  }
}
