import { CustomValidation } from "@src/models/user";
import { Response } from "express";
import { Error as MongooseError } from 'mongoose';

export interface ErrorResponse {
  code: number;
  error: string;
}

export abstract class BaseController {
  protected sendCreatedUpdatedErrorResponse(res: Response, error: MongooseError.ValidationError | Error): Response {
    if (error instanceof MongooseError.ValidationError) {
      const clientError: ErrorResponse = this.handleClientError(error);
      return res.status(clientError.code).send(clientError);
    }
    return res.status(500).send({ code: 500, error: 'Something went error.' });
  }

  private handleClientError(error: MongooseError.ValidationError): ErrorResponse {
    const duplicatedKindErrors = Object.values(error.errors).filter((field) => field.kind === CustomValidation.DUPLICATED);

    if (duplicatedKindErrors.length) {
      return { code: 409, error: error.message };
    }
    return { code: 422, error: error.message };
  }
}