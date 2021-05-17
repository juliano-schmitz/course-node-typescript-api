import { Controller, Get } from '@overnightjs/core';
import { Beach } from '@src/models/beach';
import { Forecast } from '@src/services/forecast';
import { Request, Response } from 'express';
import { BaseController } from '@src/controllers/base';

const forecastService = new Forecast();

@Controller('forecast')
export class ForecastController extends BaseController {
  
  @Get('')
  public async getForecastForLoggedUser(
    _: Request,
    res: Response
  ): Promise<void> {
    try {
      const beaches = await Beach.find({});
      const forecastData = await forecastService.processForecastForBeaches(
        beaches
      );
      res.status(200).send(forecastData);
    } catch (error) {
      this.sendCreatedUpdatedErrorResponse(res, error);
    }
  }
}
