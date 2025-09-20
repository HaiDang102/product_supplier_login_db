// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const app = express();

// Load environment variables
dotenv.config();

// =====================
// MODELS
// =====================
const Supplier = require('./models/Supplier');
const Product = require('./models/Product');

// =====================
// MIDDLEWARE
// =====================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());

// =====================
// SESSION CONFIG
// =====================
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/product_supplier_login_db';
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'mysecretkey',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: mongoUri }),
        cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }, // 1 day
    })
);

// Make current user available in all views
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
});

// =====================
// ROUTES
// =====================
const authRoutes = require('./routes/auth');
const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');

// Index route with search/filter
app.get('/', async(req, res) => {
    try {
        const suppliers = await Supplier.find();
        const query = {};
        if (req.query.supplierId) query.supplierId = req.query.supplierId;
        if (req.query.search) query.name = { $regex: req.query.search, $options: 'i' };

        const products = await Product.find(query).populate('supplierId');

        res.render('index', {
            suppliers,
            products,
            search: req.query.search || '',
            selectedSupplier: req.query.supplierId || '',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Mount routes
app.use('/auth', authRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/products', productRoutes);

// =====================
// SWAGGER SETUP
// =====================
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Product-Supplier API',
            version: '1.0.0',
            description: 'API CRUD cho Product và Supplier',
        },
        servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// =====================
// MONGODB CONNECTION
// =====================
mongoose
    .connect(mongoUri)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📖 Swagger docs: http://localhost:${PORT}/api-docs`);
});