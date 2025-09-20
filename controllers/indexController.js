const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

exports.home = async(req, res) => {
    const suppliers = await Supplier.find();
    const supplierId = req.query.supplierId || null;
    const q = req.query.search || '';
    const filter = {};
    if (supplierId) filter.supplierId = supplierId;
    if (q) filter.name = new RegExp(q, 'i');
    const products = await Product.find(filter).populate('supplierId').limit(50);
    res.render('index', { suppliers, products, supplierId, q });
};