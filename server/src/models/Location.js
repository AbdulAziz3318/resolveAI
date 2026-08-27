import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name: String, type: String, parentLocation: mongoose.Schema.Types.ObjectId, description: String, isActive: { type: Boolean, default: true } }, { timestamps: true });
export default mongoose.models.Location || mongoose.model('Location', schema);
