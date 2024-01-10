import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaTypes } from 'mongoose';
import { Admin } from 'src/admins/schemas/admin.schema';

export type NewsDocument = HydratedDocument<News>;

@Schema()
export class News {
  @Prop({ type: SchemaTypes.ObjectId })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
  admin: Admin;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'School' })
  school: Admin;
}

export const NewsSchema = SchemaFactory.createForClass(News);
