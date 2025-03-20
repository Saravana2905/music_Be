const mongoose = require('mongoose');

const singleSongSchema = new mongoose.Schema({
    url: { type: String, required: true },
    title: { type: String, required: true },
    artist: { type: String, required: true },
    artwork: { type: String, required: true }
});

const SingleSong = mongoose.model('SingleSong', singleSongSchema);
module.exports = SingleSong;