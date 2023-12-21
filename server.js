import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import userRoutes from './routes/userRoutes.js';
// import productRoutes from "./controllers/productController.js";
// import foodCategoryRoutes from"./routes/foodCategory.js"
// import menuRoutes from"./routes/menu.js"
// import billRoutes from"./routes/bill.js"
// import bodyParser from "body-parser";
import sequelize from "./connection.js";


import userRoutes from './routes/postgres/userRoutes.js';
import menuRoutes from './routes/postgres/menu.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ["http://localhost:5173", "https://pinvent-app.vercel.app", "https://invoice.edtechmastery.tech"],
  credentials: true,
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});
app.use('/api/users', userRoutes);
// app.use('/api', productRoutes);
// app.use('/api/category', foodCategoryRoutes);
app.use('/api', menuRoutes);
// app.use('/api/bill', billRoutes);

const PORT = process.env.PORT || 9000;

sequelize.authenticate()
  .then(() => {
    console.log('Connection to the PostgreSQL database has been established successfully.');
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => {
    console.error('Unable to connect to the PostgreSQL database:', error);
  });
