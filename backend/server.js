require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectToDb = require("./db.js");
const cookieParser = require('cookie-parser');
const { checkForCustomToken, checkForFirebaseToken } = require("./middleware/authMiddleware.js");
const itemRoutes = require("./routes/itemRoutes.js");

const app = express();
const port = 5000;
let activeDb = "library";

app.use(cors({
    origin: process.env.ORIGIN_URL || "http://localhost:5173" ,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// some debugging 
app.use((req, res, next) => {
    console.log(`${req.method} request received at ${req.url}`);
    next();
});

//connect to the database
connectToDb().then(result => {
    app.listen(port, () => {
        console.log(`Server is running on localhost:${port}`);
    });
});

//app.use("/api/*", checkForCustomToken)
app.use(itemRoutes);

app.get("/api/auth/authenticate", checkForFirebaseToken);
