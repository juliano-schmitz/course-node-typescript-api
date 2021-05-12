import { Controller, Post } from "@overnightjs/core";
import { Request, Response } from "express";

@Controller('beaches')
export class BeachesController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> { // TODO: refatorar para salvar no banco
    res.status(201).send({...req.body, id: 'fake-id'});
  }
}
