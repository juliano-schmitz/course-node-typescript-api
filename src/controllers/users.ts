import { Controller, Post } from '@overnightjs/core';
import { User } from '@src/models/user';
import { Request, Response } from 'express';
import { BaseController } from '@src/controllers/base';

@Controller('users')
export class UsersController extends BaseController {
  
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = new User(req.body);
      const result = await beach.save();
      res.status(201).send(result);
    } catch (error) {
      this.sendCreatedUpdatedErrorResponse(res, error);
    }
  }
}
