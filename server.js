require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const templateRoutes = require('./routes/templateRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/submissions', submissionRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port https://localhost:${PORT}`));