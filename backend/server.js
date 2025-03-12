require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectToDb = require("./db.js");
const cookieParser = require('cookie-parser');
const { checkForCustomToken, checkForFirebaseToken } = require("./middleware/authMiddleware.js");
const itemController = require("./controllers/itemController.js");

const app = express();
const port = 5000;
let activeDb = "library";

app.use(cors({
    origin: process.env.ORIGIN_URL,
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

app.get("/", itemController.getAllItems);
app.get("/details/:id", checkForCustomToken, itemController.getItemDetails);
app.post("/library", itemController.saveItemToLibrary);
app.put("/lend", itemController.lendItem);
app.put("/return", itemController.returnItem);
app.put("/comment", itemController.updateComments);
app.delete("/delete", itemController.deleteITem);

app.get("/api/auth/authenticate", checkForFirebaseToken);
