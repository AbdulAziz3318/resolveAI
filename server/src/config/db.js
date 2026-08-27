import mongoose from 'mongoose';
// Purpose: Provide the optional MongoDB connection boundary.
const stateSchema = new mongoose.Schema({ key: { type: String, unique: true }, payload: mongoose.Schema.Types.Mixed, updatedAt: { type: Date, default: Date.now } }, { collection: 'resolveai_runtime_state' });
const RuntimeState = mongoose.models.ResolveAIRuntimeState || mongoose.model('ResolveAIRuntimeState', stateSchema);

export async function connectDatabase(uri = process.env.MONGODB_URI) {
	if (!uri) return { connected: false, mode: 'demo-store' };
	await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
	return { connected: true, mode: 'mongodb' };
}

export async function hydrateStore(store) {
	const saved = await RuntimeState.findOne({ key: 'store' }).lean();
	if (!saved?.payload) return false;
	for (const [key, value] of Object.entries(saved.payload)) if (Array.isArray(store[key])) { store[key].length = 0; store[key].push(...value); }
	return true;
}

export async function persistStore(store) {
	if (mongoose.connection.readyState !== 1) return false;
	await RuntimeState.findOneAndUpdate({ key: 'store' }, { key: 'store', payload: store, updatedAt: new Date() }, { upsert: true, setDefaultsOnInsert: true });
	return true;
}
