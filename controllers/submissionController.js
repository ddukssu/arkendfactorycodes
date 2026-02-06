const Submission = require('../models/Submission');
const Template = require('../models/Template');

exports.createSubmission = async (req, res) => {
    try {
        const submission = new Submission({
            ...req.body,
            userId: req.userId || null, // Null if guest
            authorName: req.userId ? undefined : 'Anonymous', // Add flag/name logic
            status: 'pending'
        });
        await submission.save();
        res.status(201).json({ message: 'Submission sent for approval' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPendingSubmissions = async (req, res) => {
    try {
        // Populate if user exists, otherwise we handle "Anonymous" in frontend
        const submissions = await Submission.find({ status: 'pending' }).populate('userId', 'email');
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.approveSubmission = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);
        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        const newTemplate = new Template({
            title: submission.title,
            code: submission.code,
            imageUrl: submission.imageUrl,
            modules: submission.modules,
            space: submission.space,
            energy: submission.energy,
            materials: submission.materials,
        });

        await newTemplate.save();
        await Submission.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Approved and published' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.rejectSubmission = async (req, res) => {
    try {
        await Submission.findByIdAndUpdate(req.params.id, { status: 'rejected' });
        res.status(200).json({ message: 'Submission rejected' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};