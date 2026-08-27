import mongoose from 'mongoose';
const schema = new mongoose.Schema({ incidentId: { type: String, unique: true }, title: String, description: String, category: String, location: String, priority: String, linkedComplaints: [mongoose.Schema.Types.ObjectId], status: String, aiSummary: String, createdBy: mongoose.Schema.Types.ObjectId, resolvedAt: Date }, { timestamps: true });
export default mongoose.models.MasterIncident || mongoose.model('MasterIncident', schema);
