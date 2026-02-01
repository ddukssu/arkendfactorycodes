const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    photo: { type: String }
}, { _id: false });

const submissionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    code: { type: String, required: true },
    imageUrl: { type: String },
    modules: { type: [String], required: true },
    space: { type: Number, required: true },
    energy: { type: Number, required: true },
    materials: [materialSchema],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);