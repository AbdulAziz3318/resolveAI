import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name: String, startTime: String, endTime: String, workingDays: [String], isActive: { type: Boolean, default: true } }, { timestamps: true });
export default mongoose.models.Shift || mongoose.model('Shift', schema);
