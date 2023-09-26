import dotenv from "dotenv";
import app from "./app";
import { db } from "./config/db";

dotenv.config();
db();

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is up and running on port ${port}`));
