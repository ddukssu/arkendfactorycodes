const Template = require('../models/Template');

exports.getAllTemplates = async (req, res) => {
    try {
        const { search, material } = req.query;
        let query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        if (material) {
            query['materials.name'] = material;
        }

        const templates = await Template.find(query);
        res.status(200).json(templates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTemplateById = async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(template);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createTemplate = async (req, res) => {
    try {
        const template = new Template(req.body);
        await template.save();
        res.status(201).json(template);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateTemplate = async (req, res) => {
    try {
        const updatedTemplate = await Template.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedTemplate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTemplate = async (req, res) => {
    try {
        await Template.findByIdAndDelete(req.params.id);
        res.json({ message: 'Template deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};