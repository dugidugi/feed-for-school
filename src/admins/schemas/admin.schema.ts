import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema()
export class Admin {
  @Prop({ type: SchemaTypes.ObjectId })
  id: string;

  @Prop({ required: true })
  name: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
