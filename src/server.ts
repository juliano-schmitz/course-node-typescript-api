import './util/module-alias';
import { Server } from '@overnightjs/core';
import { urlencoded, json, Application } from 'express';
import * as database from '@src/database';
import { ForecastController } from './controllers/forecast';
import { BeachesController } from './controllers/beaches';

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
    const beachesController = new BeachesController();

    this.addControllers([forecastController, beachesController]);
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

  public start(): void {
    this.app.listen(this.port, () => {
      console.info('Server listening of port:', this.port);
    });
  }
}
