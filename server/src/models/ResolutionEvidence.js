import mongoose from 'mongoose';
const schema = new mongoose.Schema({ complaint: mongoose.Schema.Types.ObjectId, worker: mongoose.Schema.Types.ObjectId, description: String, imageUrl: String, aiVerification: mongoose.Schema.Types.Mixed }, { timestamps: true });
export default mongoose.models.ResolutionEvidence || mongoose.model('ResolutionEvidence', schema);
