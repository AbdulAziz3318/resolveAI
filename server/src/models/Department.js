import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name: { type: String, required: true }, description: String, supportedCategories: [String], manager: mongoose.Schema.Types.ObjectId, defaultSlaHours: { LOW: Number, MEDIUM: Number, HIGH: Number, CRITICAL: Number }, isActive: { type: Boolean, default: true } }, { timestamps: true });
export default mongoose.models.Department || mongoose.model('Department', schema);
