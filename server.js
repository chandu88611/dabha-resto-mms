import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
// import helmet from "helmet";
// import morgan from "morgan";
import userRoutes from './routes/userRoutes.js';
import productRoutes from "./controllers/productController.js";
import foodCategoryRoutes from"./routes/foodCategory.js"
import menuRoutes from"./routes/menu.js"
import billRoutes from"./routes/bill.js"
import bodyParser from "body-parser";
// import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

// app.use(express.json());  // This is equivalent to bodyParser.json()
// app.use(express.urlencoded({ extended: false })); 
// app.use(bodyParser.json());
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
app.use(express.json());
// app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://pinvent-app.vercel.app","https://invoice.edtechmastery.tech"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});
app.use('/api/users', userRoutes);
app.use('/api', productRoutes);
app.use('/api/category', foodCategoryRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/bill', billRoutes);

const PORT = 9000;

mongoose.set('strictQuery', false);

mongoose
  .connect("mongodb+srv://chandan:H3cgaWqIrHFnEi83@cluster0.7uth0pi.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
