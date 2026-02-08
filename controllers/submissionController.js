const Submission = require('../models/Submission');
const Template = require('../models/Template');
const User = require('../models/User');

exports.createSubmission = async (req, res) => {
    try {
        let authorName = 'Anonymous';

        if (req.userId) {
            const user = await User.findById(req.userId);
            if (user) {
                authorName = user.username || user.email.split('@')[0];
            }
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
        const submissions = await Submission.find().populate('userId', 'email username');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.approveSubmission = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id).populate('userId');
        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        const newTemplate = new Template({
            title: req.body.title || submission.title,
            width: req.body.width || submission.width,
            height: req.body.height || submission.height,
            energy: req.body.energy || submission.energy,
            imageUrl: req.body.imageUrl || submission.imageUrl,
            materials: req.body.materials || submission.materials,

            modules: submission.modules,
            code: submission.code,

            userId: submission.userId ? submission.userId._id : null,
            authorName: submission.authorName || 'Anonymous'
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
        await Submission.findByIdAndDelete(req.params.id);
        res.json({ message: 'Submission rejected' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};