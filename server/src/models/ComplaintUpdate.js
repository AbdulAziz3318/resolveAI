import mongoose from 'mongoose';
const schema = new mongoose.Schema({ complaint: mongoose.Schema.Types.ObjectId, createdBy: mongoose.Schema.Types.ObjectId, message: String, type: String }, { timestamps: true });
export default mongoose.models.ComplaintUpdate || mongoose.model('ComplaintUpdate', schema);
