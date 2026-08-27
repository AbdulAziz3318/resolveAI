import mongoose from 'mongoose';
const schema = new mongoose.Schema({ action: String, complaint: mongoose.Schema.Types.ObjectId, assignment: mongoose.Schema.Types.ObjectId, user: mongoose.Schema.Types.ObjectId, message: String, metadata: mongoose.Schema.Types.Mixed }, { timestamps: true });
export default mongoose.models.AutomationLog || mongoose.model('AutomationLog', schema);
