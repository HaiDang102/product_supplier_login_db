// Optional seed file - run `node seed.js` or `npm run seed` to add sample data.
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Supplier = require('./models/Supplier');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/product_supplier_db';

async function seed(){
  await mongoose.connect(MONGO_URI);
  await Supplier.deleteMany({});
  await Product.deleteMany({});

  const s1 = await Supplier.create({ name: 'ABC Supplies', address: '123 Tran Hung Dao', phone: '0123456789' });
  const s2 = await Supplier.create({ name: 'Best Goods', address: '45 Le Lai', phone: '0987654321' });

  await Product.create({ name: 'Phone Model X', price: 799, quantity: 10, supplierId: s1._id });
  await Product.create({ name: 'Headphones H1', price: 99, quantity: 50, supplierId: s2._id });

  console.log('Seeding done');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
