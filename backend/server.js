require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectToDb = require("./db.js");
const cookieParser = require('cookie-parser');
const { checkForCustomToken, checkForFirebaseToken } = require("./middleware/authMiddleware.js");
const itemRoutes = require("./routes/itemRoutes.js");
const { errorHandler } = require("./middleware/errorHandler.js");

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

app.get("/api/auth/authenticate", checkForFirebaseToken);


app.use("/api", checkForCustomToken);

app.use(itemRoutes);
app.use(errorHandler);

// Test endpoints for stuff

// app.get("/test/body", (req, res) => {
//     const {error, value} = itemValidators.addingItemValidator(req.body);
//     if (error) {
//         console.log(error);
//         return res.send(error.details);
//     }
//     res.send("Successfully passed check");
// })