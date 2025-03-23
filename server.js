const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Song = require('./songModel');
const SingleSong = require('./songModel1');
const bodyParser = require('body-parser');
const port = 3000;
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const User = require('./UserModel');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'duejdbs48',
    api_key: '291572288538863',
    api_secret: 'iG9MsVtarL8DVTkCOGYwhjHloLY'
});

// Configure Multer storage to use Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'songs',
        resource_type: 'auto'
    }
});

const upload = multer({ storage: storage });

// Controller for creating a song
const createSong = async (req, res) => {
    const { title, artist } = req.body;
    const songUrl = req.files.song[0].path;
    const artworkUrl = req.files.artwork[0].path;

    const newSongData = {
        url: songUrl,
        title,
        artist,
        artwork: artworkUrl
    };

    try {
        // Find the existing Song document or create a new one if it doesn't exist
        let song = await Song.findOne({});
        if (!song) {
            song = new Song({ data: [] });
        }

        // Add the new song data to the array
        song.data.push(newSongData);

        // Save the updated Song document
        const updatedSong = await song.save();
    res.status(201).json({status:"success",updatedSong});
    } catch (err) {
        res.status(400).json({ status:"false", message: err.message });
    }
};

//add song 
app.post('/api/songs', upload.fields([{ name: 'song', maxCount: 1 }, { name: 'artwork', maxCount: 1 }]), createSong);

// Get all songs

app.get('/api/songs', async (req, res) => {
    try {
        const songs = await Song.find({});
        res.status(200).json(songs);
    } catch (err) {
        res.status(500).json({ status: "false" ,message: err.message});
    }
});

app.post('/api/signup', async (req, res) => {
    try {
        // Sign up logic here
        const { username, email, password } = req.body; // Get the username, email and password from the request body
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ status: "false", message: 'User already exists' });
        }
        // Create a new user document
        const newUser = new User({ username, email, password, role: 'User' });
        // Save the user document
        await newUser.save();
        // Send a success message
        res.status(201).json({
            status: 'success',
            role: 'User',
            message: 'User created successfully'
        });
    } catch (err) {
        res.status(500).json({ status: "false", message: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body; // Get the email and password from the request body
        console.log("req email--->",email)
        console.log("req password--->",password)
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('Invalid email or password');
        }   else {
            // Check if the password is correct
            const validPassword = (user.password === password);
            
            if (!validPassword) {
                return res.status(401).json({status: false, message: 'Invalid email or password'});
            }
        
            res.json({
                status:'success',
                role: 'user',
                message: 'Logged in successfully',
            });
        }
    } catch (err) {
        res.status(500).json({status: "false", message:err.message});
    }
}
);

app.post('/single', upload.fields([{ name: 'song', maxCount: 1 }, { name: 'artwork', maxCount: 1 }]) ,async (req, res) => {
    const { title, artist } = req.body;
    const songUrl = req.files.song[0].path;
    const artworkUrl = req.files.artwork[0].path;

    const newSongData = {
        url: songUrl,
        title,
        artist,
        artwork: artworkUrl
    };
    
    try {
        const song = await SingleSong.create(newSongData);
        console.log("Song--->",song);
        res.status(201).json({data:[song]});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

app.get('/single', async (req, res) => {
    try {
        const songs = await SingleSong.find({});
        res.json(songs);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);

    // Connect to MongoDB
    mongoose.connect('mongodb+srv://admin:admin123@cluster0.mbkdi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.log('Failed to connect to MongoDB');
        console.log(err);
    });
    
    
})