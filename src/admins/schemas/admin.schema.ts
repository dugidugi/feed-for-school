import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true, id: false })
export class Admin {
  @Prop({ required: true })
  name: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
