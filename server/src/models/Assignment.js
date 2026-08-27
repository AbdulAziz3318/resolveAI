import mongoose from 'mongoose';
const schema = new mongoose.Schema({ complaint: mongoose.Schema.Types.ObjectId, worker: mongoose.Schema.Types.ObjectId, assignmentScore: Number, scoreBreakdown: mongoose.Schema.Types.Mixed, assignedAt: Date, acceptanceDeadline: Date, acceptedAt: Date, expiredAt: Date, completedAt: Date, reassignmentAttempt: Number, status: String }, { timestamps: true });
export default mongoose.models.Assignment || mongoose.model('Assignment', schema);
