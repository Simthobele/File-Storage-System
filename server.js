const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const SECRET_KEY = 'your_secret_key';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Set up storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Mock database
const users = [];
const files = {};

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}


// Register endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    files[username] = [];

    res.status(201).json({ message: 'User registered successfully' });
});
// Sign in endpoint
app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username }, SECRET_KEY);
        res.json({ token });
    } else {
        res.sendStatus(401);
    }
});

// Upload endpoint
app.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
    const username = req.user.username;
    const file = req.file;
    files[username].push(file);
    res.sendStatus(200).json({ message: 'File uploaded successfully' });
});

// Fetch files endpoint
app.get('/files', authenticateToken, (req, res) => {
    const username = req.user.username;
    const userFiles = files[username] || [];
    res.json(userFiles);
});

// Serve files
app.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath); // This sets the Content-Disposition header
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
