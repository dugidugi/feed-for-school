import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Admin } from '@src/admins/schemas/admin.schema';

export type NewsDocument = HydratedDocument<News>;

@Schema({ timestamps: true, id: false })
export class News {
  _id: string;

  @Prop({ required: true, index: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
  admin: Admin;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'School' })
  school: Admin;

  @Prop({ index: true })
  createdAt: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);
