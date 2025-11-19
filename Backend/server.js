require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Vulnerability ---

// Vulnerable data storage
let recipes = [
    { 
        id: 1, 
        name: 'Nasi Goreng Spesial', 
        description: 'Nasi goreng dengan telur dan ayam',
        images: [],
        comments: []
    },
    { 
        id: 2, 
        name: 'Mie Ayam Bakso', 
        description: 'Mie ayam dengan bakso sapi',
        images: [],
        comments: []
    },
    { 
        id: 3, 
        name: 'Sate Ayam Madura', 
        description: 'Sate ayam dengan bumbu kacang khas Madura',
        images: [],
        comments: []
    }
];

// Vulnerable file upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');         // no validation
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);  // no sanitization
    }
});

const upload = multer({ 
    storage: storage      // no file filter
});

// --- Middleware ---

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- Routes ---

// Home - List Recipes
app.get('/', (req, res) => {
    res.json({
        message: "Recipe Share API - Backend Ready for Testing",
        endpoints: {
            home: "GET /",
            recipe_detail: "GET /recipe/:id", 
            post_comment: "POST /recipe/:id/comment",
            upload_file: "POST /recipe/:id/upload"
        },
        recipes: recipes
    });
});

// Recipe Detail - Show specific recipe
app.get('/recipe/:id', (req, res) => {
    const recipeId = parseInt(req.params.id);
    const recipe = recipes.find(r => r.id === recipeId);
    
    if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.json({
        message: `Recipe ${recipeId} details`,
        recipe: recipe
    });
});

// Comments - XSS Stored Vulnerability for specific recipe
app.post('/recipe/:id/comment', (req, res) => {
    const recipeId = parseInt(req.params.id);
    const recipe = recipes.find(r => r.id === recipeId);
    
    if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
    }
    
    const { name, comment } = req.body;
    
    // no input sanitization
    recipe.comments.push({
        id: recipe.comments.length + 1,
        name: name,
        comment: comment, // XSS payload is stored directly
        date: new Date().toLocaleString()
    });
    
    res.json({
        message: "Comment added successfully",
        vulnerability: "XSS Stored - No input sanitization",
        recipe: recipe
    });
});

// Upload - Insecure File Upload Vulnerability for specific recipe
app.post('/recipe/:id/upload', upload.single('recipeImage'), (req, res) => {
    const recipeId = parseInt(req.params.id);
    const recipe = recipes.find(r => r.id === recipeId);
    
    if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
    }
    
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    
    // no file type validation
    recipe.images.push(req.file.filename);
    
    res.json({
        message: "File uploaded successfully", 
        vulnerability: "Insecure File Upload - No file validation",
        file: {
            filename: req.file.filename,
            size: req.file.size,
            path: req.file.path
        },
        recipe: recipe
    });
});

// Serve uploaded files directly
app.use('/uploads', express.static('uploads'));

// --- Start Server ---

app.listen(PORT, () => {
    console.log(`Vulnerable Server running on http://localhost:${PORT}`);
    console.log(`Home: http://localhost:${PORT}/`);
    console.log(`Recipe 1 Detail: http://localhost:${PORT}/recipe/1`);
    console.log(`Recipe 2 Detail: http://localhost:${PORT}/recipe/2`);
    console.log(`XSS Target: POST to http://localhost:${PORT}/recipe/1/comment`);
    console.log(`Upload Target: POST to http://localhost:${PORT}/recipe/1/upload`);
});