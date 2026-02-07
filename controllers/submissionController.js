const Submission = require('../models/Submission');
const Template = require('../models/Template');
const User = require('../models/User');

exports.createSubmission = async (req, res) => {
    try {
        let authorName = 'Anonymous';
        if (req.userId) {
            const user = await User.findById(req.userId);
            if (user) authorName = user.username;
        }

        const submission = new Submission({
            ...req.body,
            userId: req.userId || null,
            authorName: authorName,
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
        const submission = await Submission.findById(req.params.id).populate('userId');
        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        const newTemplate = new Template({
            title: submission.title,
            code: submission.code,
            imageUrl: submission.imageUrl,
            modules: submission.modules,
            width: submission.width,
            height: submission.height,
            energy: submission.energy,
            materials: submission.materials,
            userId: submission.userId,
            authorName: submission.authorName
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