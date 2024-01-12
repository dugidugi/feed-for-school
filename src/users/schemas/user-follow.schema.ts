import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { School } from '@src/schools/schemas/school.schema';
import { User } from './user.schema';

export type UserFollowDocument = HydratedDocument<UserFollow>;

@Schema({ timestamps: true, id: false })
export class UserFollow {
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'School', index: true })
  school: School;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true })
  user: User;
}

export const UserFollowSchema = SchemaFactory.createForClass(UserFollow);
