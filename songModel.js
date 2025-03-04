const mongoose = require('mongoose');

const song = mongoose.Schema({
    data:[
        {
            url: {type:String,required:true},
            title: {type:String,required:true},
            artist: {type:String,required:true},
            artwork: {type:String,required:true},
        }
    ]
})

const Song = mongoose.model('Song',song);
module.exports = Song;