const axios = require('axios');
const Favorite = require('../models/favoriteModel');

exports.getMovies = async (req, res) => {
    try {
        const response = await axios.get('https://itunes.apple.com/search', {
            params: { term: 'star', country: 'au', media: 'movie', all: '' },
        });
        res.json(response.data.results);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching movies' });
    }
};

exports.toggleFavorite = async (req, res) => {
    const { movieId, movieDetails } = req.body;

    if (!movieId || !movieDetails) {
        return res.status(400).json({ message: 'movieId and movieDetails are required' });
    }

    try {
        // check if the movie is already in the user's favorites
        const existing = await Favorite.findOne({ userId: req.user._id, movieId });

        if (existing) {
            // remove from favorites using deleteOne
            await Favorite.deleteOne({ _id: existing._id });
            return res.json({ message: 'Removed from favorites' });
        }

        // add new movie to favorites
        const newFavorite = new Favorite({
            userId: req.user._id,
            movieId,
            movieDetails,
        });

        await newFavorite.save();
        res.json({ message: 'Added to favorites' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error toggling favorite' });
    }
};

exports.getMovieDetails = async (req, res) => {
    const { movieId } = req.params;  

    try {
        const response = await axios.get('https://itunes.apple.com/lookup', {
            params: {
                id: movieId,  
                country: 'au',
                media: 'movie'
            }
        });

        if (response.data.resultCount > 0) {
            res.json(response.data.results[0]);  
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching movie details' });
    }
};
