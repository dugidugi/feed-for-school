import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Admin } from '@src/admins/schemas/admin.schema';

export type SchoolDocument = HydratedDocument<School>;

@Schema({ timestamps: true, id: false })
export class School {
  _id: string;

  @Prop({ required: true, index: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
  admin: Admin;

  @Prop({ required: true })
  address: string;
}

export const SchoolSchema = SchemaFactory.createForClass(School);
