import { AppController } from './app.controller';
import { AppService } from './app.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(() => {
    appController = new AppController(new AppService());
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
