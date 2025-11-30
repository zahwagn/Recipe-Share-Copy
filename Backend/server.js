require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configuration
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- Vulnerability ---

// Vulnerable data storage
let recipes = [
    { 
        id: 1, 
        name: 'Nasi Goreng Mafia', 
        description: 'Pedas gila dengan bumbu rahasia para mafia.',
        image: 'nasi_goreng.png', 
        ingredients: ['Nasi', 'Cabai Setan', 'Bawang', 'Kecap', 'Telur'],
        steps: ['Tumis bumbu', 'Masak telur', 'Campur nasi', 'Sajikan dengan tatapan tajam'],
        images: [], 
        comments: []
    },
    { 
        id: 2, 
        name: 'Smoothie Bowl Naga', 
        description: 'Sehat, segar, dan estetik untuk feed Instagram.',
        image: 'smoothie.png', 
        ingredients: ['Buah Naga', 'Pisang', 'Susu Almond', 'Chia Seeds'],
        steps: ['Blender buah', 'Tuang ke mangkuk', 'Hias topping', 'Foto dulu sebelum makan'],
        images: [],
        comments: []
    },
    { 
        id: 3, 
        name: 'Indomie Carbonara', 
        description: 'Anak kosan style tapi rasa restoran bintang lima.',
        image: 'indomie.png', 
        ingredients: ['Indomie', 'Susu UHT', 'Keju Cheddar', 'Sosis'],
        steps: ['Rebus mie setengah matang', 'Masak kuah susu dan keju', 'Campur semua', 'Sajikan hangat'],
        images: [],
        comments: []
    },
    { 
        id: 4, 
        name: 'Sate Ayam Madura', 
        description: 'Sate ayam juicy dengan bumbu kacang kental asli Madura.',
        image: 'sate_ayam.png', 
        ingredients: ['Daging Ayam', 'Kacang Tanah', 'Kecap Manis', 'Bawang Merah', 'Jeruk Limau'],
        steps: ['Potong daging dadu', 'Tusuk ke tusukan sate', 'Bakar sambil dioles kecap', 'Sajikan dengan bumbu kacang'],
        images: [],
        comments: []
    },
    { 
        id: 5, 
        name: 'Rendang Daging Sapi', 
        description: 'Masakan terlezat di dunia, dimasak 8 jam penuh cinta.',
        image: 'rendang.png', 
        ingredients: ['Daging Sapi', 'Santan', 'Lengkuas', 'Serai', 'Cabai', 'Rempah Rahasia'],
        steps: ['Tumis bumbu halus', 'Masukkan daging dan santan', 'Masak api kecil sampai kering (8 jam)', 'Siap disantap'],
        images: [],
        comments: []
    },
    { 
        id: 6, 
        name: 'Gado-Gado Jakarta', 
        description: 'Salad-nya orang Indonesia dengan bumbu kacang medok.',
        image: 'gado_gado.png', 
        ingredients: ['Lontong', 'Tauge', 'Kangkung', 'Tahu', 'Tempe', 'Kerupuk'],
        steps: ['Rebus semua sayuran', 'Goreng tahu tempe', 'Ulek bumbu kacang', 'Campur semua bahan'],
        images: [],
        comments: []
    },
    { 
        id: 7, 
        name: 'Soto Ayam Lamongan', 
        description: 'Kuah kuning segar dengan taburan koya yang gurih.',
        image: 'soto_ayam.png', 
        ingredients: ['Ayam Kampung', 'Kunyit', 'Jahe', 'Soun', 'Telur Rebus', 'Bubuk Koya'],
        steps: ['Rebus ayam dengan bumbu kuning', 'Suwir ayam', 'Tata soun dan kol di mangkuk', 'Siram kuah panas'],
        images: [],
        comments: []
    },
    { 
        id: 8, 
        name: 'Bakso Beranak', 
        description: 'Bakso jumbo yang di dalamnya ada bakso kecil-kecil.',
        image: 'bakso.png', 
        ingredients: ['Daging Sapi Giling', 'Tepung Tapioka', 'Bawang Putih', 'Kaldu Sapi', 'Mie Kuning'],
        steps: ['Bentuk adonan bakso besar', 'Isi dengan bakso kecil', 'Rebus hingga mengapung', 'Sajikan dengan kuah'],
        images: [],
        comments: []
    },
    { 
        id: 9, 
        name: 'Pempek Kapal Selam', 
        description: 'Pempek isi telur besar dengan cuko pedas manis.',
        image: 'pempek.png', 
        ingredients: ['Ikan Tenggiri', 'Tepung Sagu', 'Telur Bebek', 'Gula Merah', 'Asam Jawa'],
        steps: ['Uleni ikan dan tepung', 'Bentuk mangkuk, isi telur', 'Rebus hingga matang', 'Goreng dan sajikan dengan cuko'],
        images: [],
        comments: []
    },
    { 
        id: 10, 
        name: 'Martabak Manis Keju', 
        description: 'Terang bulan tebal dengan topping keju susu melimpah.',
        image: 'martabak.png', 
        ingredients: ['Tepung Terigu', 'Gula Pasir', 'Telur', 'Soda Kue', 'Keju Parut', 'Susu Kental Manis'],
        steps: ['Buat adonan martabak', 'Panggang di teflon panas', 'Oles mentega', 'Tabur keju parut', 'Lipat dan potong'],
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
        // Allow custom file names without sanitization
        const finalName = req.body.customName || file.originalname;
        cb(null, finalName);  // no sanitization
    }
});

const upload = multer({ 
    storage: storage      // no file filter
});

// --- Middleware ---

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// --- Routes ---

// Home - List Recipes
app.get('/', (req, res) => {
    res.json({
        message: "Recipe Share API - Vulnerable Mode",
        status: "Active"
    });
});

// Recipes List - Show all recipes
app.get('/recipes', (req, res) => {
    res.json(recipes);
});

// Recipe Detail - Show specific recipe
app.get('/recipes/:id', (req, res) => { 
    const recipeId = parseInt(req.params.id);
    const recipe = recipes.find(r => r.id === recipeId);
    
    if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe); 
});

// Comments - XSS Stored Vulnerability for specific recipe
app.post('/recipes/:id/comment', (req, res) => {
    const recipeId = parseInt(req.params.id);
    const recipe = recipes.find(r => r.id === recipeId);
    
    if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
    }
    
    const { name, comment, user } = req.body; 
    
    // no input sanitization
    recipe.comments.push({
        id: recipe.comments.length + 1,
        user: user || name || 'Anonymous', 
        comment: comment, 
        text: comment,    
        // Save User0Agent for simulating vulnerable logging data
        userAgent: req.headers['user-agent'],
        date: new Date().toLocaleString()
    });
    
    res.json({
        message: "Comment added successfully",
        vulnerability: "XSS Stored - No input sanitization",
        recipe: recipe
    });
});

// Upload - Insecure File Upload Vulnerability for specific recipe
app.post('/recipes/:id/upload', upload.single('file'), (req, res) => { 
    const recipeId = parseInt(req.params.id);
    const recipe = recipes.find(r => r.id === recipeId);
    
    if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
    }
    
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    
    // no file type validation
    // allowed any file type and any filename that can be manipulated
    recipe.images.push(req.file.filename);
    recipe.image = req.file.filename; 
    
    res.json({
        message: "File uploaded successfully", 
        vulnerability: "Insecure File Upload & Path Traversal",
        file: {
            filename: req.file.filename,
            path: req.file.path
        },
        recipe: recipe
    });
});

// Serve uploaded files directly
app.use('/uploads', express.static('uploads'));

// --- Admin Dashboard (XSS Target Trigger) ---
app.get('/admin/dashboard', (req, res) => {
    // Simulation of admin session cookie
    // If hacker succeeds XSS, this cookie will be stolen
    res.cookie('admin_session_token', 'SUPER_SECRET_ADMIN_KEY_12345', { httpOnly: false });

    let allComments = [];
    recipes.forEach(r => {
        r.comments.forEach(c => {
            allComments.push({ recipe: r.name, user: c.user, text: c.text, ua: c.userAgent });
        });
    });

    // Render HTML server-side (Vulnerable to XSS)
    let html = `
    <html>
        <head>
            <title>Admin Dashboard</title>
            <style>
                body { font-family: sans-serif; padding: 20px; background: #f4f4f4; }
                .header { background: #2f3542; color: white; padding: 15px; border-radius: 5px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #ff4757; color: white; }
                tr:nth-child(even) { background-color: #f2f2f2; }
                .alert { padding: 10px; background: #fffae6; border: 1px solid #ffeaa7; margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🔒 Admin Dashboard</h1>
                <p>Welcome, Administrator. Session Active: <span style="color:#ff6b6b">SUPER_SECRET_ADMIN_KEY_12345</span></p>
            </div>
            
            <div class="alert">
                <strong>Monitoring System:</strong> Reviewing latest user comments for moderation.
            </div>

            <h2>User Comments Log</h2>
            <table>
                <tr>
                    <th>Recipe</th>
                    <th>User</th>
                    <th>Comment Content (Rendered Raw)</th>
                    <th>User Agent</th>
                </tr>
                ${allComments.map(c => `
                <tr>
                    <td>${c.recipe}</td>
                    <td><b>${c.user}</b></td>
                    <td>${c.text}</td> <td><small>${c.ua}</small></td>
                </tr>`).join('')}
            </table>
        </body>
    </html>
    `;
    res.send(html);
});

// --- Start Server ---

app.listen(PORT, () => {
    console.log(`Vulnerable Server running on http://localhost:${PORT}`);
    console.log(`Admin XSS Target: http://localhost:${PORT}/admin/dashboard`);
});