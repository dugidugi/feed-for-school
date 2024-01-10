import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaTypes } from 'mongoose';
import { Admin } from 'src/admins/schemas/admin.schema';

export type SchoolDocument = HydratedDocument<School>;

@Schema()
export class School {
  @Prop({ type: SchemaTypes.ObjectId })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
  admin: Admin;

  @Prop({ required: true })
  address: string;
}

export const SchoolSchema = SchemaFactory.createForClass(School);
