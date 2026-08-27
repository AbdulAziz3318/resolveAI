import mongoose from 'mongoose';
const schema = new mongoose.Schema({ complaint: mongoose.Schema.Types.ObjectId, level: String, reason: String, escalatedTo: mongoose.Schema.Types.ObjectId, acknowledgedAt: Date, resolvedAt: Date, status: String }, { timestamps: true });
export default mongoose.models.Escalation || mongoose.model('Escalation', schema);
