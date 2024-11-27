const express = require('express');
const { getMovies, getMovieDetails, toggleFavorite } = require('../controllers/movieController');
const {requireSignIn} = require('../middlewares/authMiddleware');
const router = express.Router();
const Favorite = require('../models/favoriteModel');
router.get('/', getMovies);

router.get('/movies/:movieId', getMovieDetails);


router.get('/favorites', requireSignIn, async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.user._id });
        res.json(favorites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching favorites' });
    }
});

router.post('/favorites', requireSignIn, (req, res) => {
    console.log('Hit /api/movies/favorites');
    toggleFavorite(req, res);
});

module.exports = router;
