const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movieId: {
        type: String, 
        required: true
    },
    movieDetails: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model('Favorite', favoriteSchema);
