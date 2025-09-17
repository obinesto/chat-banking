import mongoose, { Document, Schema } from "mongoose";
import { ConversationState } from "./conversationState.enum";

export interface ICustomer extends Document {
  whatsappId: string;
  nin?: string;
  fullName?: string;
  bvn?: string;
  pin?: string;
  accountNumber?: string;
  walletBalance: number;
  tier: number;
  conversationState: ConversationState;
}

const CustomerSchema: Schema = new Schema({
  whatsappId: { type: String, required: true, unique: true },
  nin: { type: String },
  fullName: { type: String },
  bvn: { type: String },
  pin: { type: String },
  accountNumber: { type: String },
  walletBalance: { type: Number, default: 0.0 },
  tier: { type: Number, default: 1 },
  conversationState: {
    type: String,
    enum: Object.values(ConversationState),
    default: ConversationState.GREETING,
  },
});

export const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema);
