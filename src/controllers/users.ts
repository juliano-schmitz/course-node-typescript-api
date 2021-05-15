import { Controller, Post } from '@overnightjs/core';
import { User } from '@src/models/user';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    const beach = new User(req.body);
    const result = await beach.save();
    res.status(201).send(result);
  }
}
