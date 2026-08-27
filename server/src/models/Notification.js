import mongoose from 'mongoose';
const schema = new mongoose.Schema({ user: mongoose.Schema.Types.ObjectId, type: String, title: String, message: String, complaint: mongoose.Schema.Types.ObjectId, assignment: mongoose.Schema.Types.ObjectId, isRead: { type: Boolean, default: false } }, { timestamps: true });
export default mongoose.models.Notification || mongoose.model('Notification', schema);
