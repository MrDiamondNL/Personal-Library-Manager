const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Item = require("./models/Item.js");
const { connectToDb, getDb } = require("./db.js");

const app = express();
const port = 5000;

app.use(cors()); //commented out to see what happens
app.use(express.json());

//connect to the database
let db

connectToDb((err) => {
    if (!err) {
        app.listen(port, () => {
            console.log(`Server is running on localhost:${port}`);
        });
        db = getDb();
    }
})

// mongoose.connect("mongodb://localhost:27017/personal-library-manager")
//     .then(() => {
//         console.log("connected to database");
//     })
//     .catch(err => {
//         console.log("error connecting to database", err);
//     });

//endpoints
app.get("/", (req, res) => {
    
    db.collection("library")
    .find()
    .toArray()
    .then((result) => {
        res.json(result);
    })
    .catch(err => {
        console.log(err);
    });
    
    
})


