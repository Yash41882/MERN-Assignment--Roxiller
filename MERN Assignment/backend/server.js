import express from "express";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import * as mainController from "./controllers/mainController.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

connectToMongoDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import cors from "cors";
const corsOptions ={
   origin:'*', 
   credentials:true,            
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

// Serve API routes
app.get("/init", mainController.initialize);
app.get("/transactions", mainController.transactions);
app.get("/statistics/:month", mainController.statistics);
app.get("/bar-chart/:month", mainController.barChart);
app.get("/pie-chart/:month", mainController.pieChart);
app.get("/combined-data/:month", mainController.Combine);

// Serve React application
app.use(express.static(path.join(__dirname, 'frontend'), { "extensions": ["jsx"] }));

app.get('/',(req, res) => {
  res.send("Server is Running Just Fine")
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});


app.listen(PORT, () => console.log(`Server Running on ${PORT}`));
