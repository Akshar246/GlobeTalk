import express from "express";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { createUser } from "./seeders/user.js";

import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";

dotenv.config({
    path: './.env'
});

const mongoURI = process.env.MONGO_URI;
const PORT  = process.env.PORT || 3000;

// Database connection
connectDB(mongoURI);


const app = express();

// Cookie Parser
app.use(cookieParser());

// Using middleware here
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use("/user", userRoute);
app.use("/chat", chatRoute);

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`Server is running on port 3000 ${PORT}`);
});