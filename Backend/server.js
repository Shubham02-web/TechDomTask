// importing Necessary Modules
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import Loanrouter from "./Routes/Loan.js";
import Userrouter from "./Routes/User.js";
import cookieParser from "cookie-parser";

// config dotenv for Load Environment variables from .env file
dotenv.config();

// Creating setup of an express application
const app = express();

// Enabling Cors for all routes
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// use express Json for parsing incoming json requests
app.use(bodyParser.json());

// Connecting MongoDB
mongoose
  .connect(process.env.MongoURI)
  .then(() => console.log("MongoDb has Connected"))
  .catch((err) => console.log(`Error in conecting mongoose ${err}`));

// Use loan routes for all requests starting with /api/loan
app.use("/api/loan", Loanrouter);

// use User route for all request starting with /api/user
app.use("/api/user", Userrouter);
// Accessing PORT
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`app listening on PORT ${PORT}`);
});
