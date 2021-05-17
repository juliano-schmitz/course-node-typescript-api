import { Controller, Post } from '@overnightjs/core';
import { Beach } from '@src/models/beach';
import { Request, Response } from 'express';
import { BaseController } from '@src/controllers/base';

@Controller('beaches')
export class BeachesController extends BaseController {
  
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = new Beach(req.body);
      const result = await beach.save();
      res.status(201).send(result);
    } catch (error) {
      this.sendCreatedUpdatedErrorResponse(res, error);
    }
  }
}
