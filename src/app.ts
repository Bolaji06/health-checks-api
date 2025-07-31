import express, { Request } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Monitor is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
