const mongoose = require('mongoose');


const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionToken: { type: String, required: true },
    isValid: { type: Boolean, required: true },
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;