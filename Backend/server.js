// importing Necessary Modules
import express from "express";
import mongoose from "mongoose";
import bodyparser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
// config dotenv for Load Environment variables from .env file
dotenv.config();

// Creating setup of an express application
const app = express();

// Enabling Cors for all routes
app.use(cors());
// use express Json for parsing incoming json requests
app.use(bodyParser.json());

// Connecting MongoDB
mongoose
  .connect(process.env.MongoURI)
  .then(() => console.log("MongoDb has Connected"))
  .catch((err) => console.log(`Error in conecting mongoose ${err}`));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`app listening on PORT ${PORT}`);
});
