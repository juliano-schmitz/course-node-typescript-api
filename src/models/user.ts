import mongoose, { Document, Model } from "mongoose";

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

export enum CustomValidation {
  DUPLICATED = 'DUPLICATED',
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: [true, 'Email must be unique'] },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

schema.path('email').validate(async (email: string) => {
    const count = await mongoose.models.User.countDocuments({ email });
    return !count;
  },
  'already exists in the database.',
  CustomValidation.DUPLICATED
);

interface UserModel extends Omit<User, '_id'>, Document {}

export const User: Model<UserModel> = mongoose.model('User', schema);
