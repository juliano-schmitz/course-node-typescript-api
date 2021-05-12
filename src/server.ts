import './util/module-alias';
import { Server } from '@overnightjs/core';
import { urlencoded, json, Application } from 'express';
import { ForecastController } from './controllers/forecast';
import * as database from '@src/database';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.setupDatabase();
  }

  private setupExpress(): void {
    this.app.use(json());
    this.app.use(
      urlencoded({
        extended: true,
      })
    );
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();

    this.addControllers([forecastController]);
  }

  private async setupDatabase(): Promise<void> {
    await database.connect();
  }

  // TODO: refatorar para fechar toda aplicação, alẽm do banco de dados
  public async close(): Promise<void> {
    await database.close();
  }

  public getApp(): Application {
    return this.app;
  }
}
