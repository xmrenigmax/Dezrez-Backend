import mongoose, { Schema } from 'mongoose';

const CallLogSchema = new Schema({
  vapiCallId: { type: String, required: true, index: true },
  assistantId: { type: String, required: true },
  status: { type: String },
  durationSeconds: { type: Number, default: 0 },
  cost: { type: Number, default: 0 },
  transcript: { type: String },
  sentiment: { type: String },
  // Store DezRez specific metadata for auditing
  metadata: {
    propertyId: String,
    searchCriteria: Schema.Types.Mixed
  }
}, { timestamps: true });

export default mongoose.models.CallLog || mongoose.model('CallLog', CallLogSchema);