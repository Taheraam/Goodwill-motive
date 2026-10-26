import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  // The Nest scaffold test still expected "Hello World!" and had been failing silently,
  // because CI never ran. GET /api is also Render's health check, so its shape matters.
  it('returns a health payload', () => {
    expect(appController.getHello()).toMatchObject({ status: 'ok', message: expect.any(String) });
  });
});
