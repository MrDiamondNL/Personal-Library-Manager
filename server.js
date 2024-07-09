const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Item = require("./models/item.js");

const app = express();
const port = 5000;

app.use(cors()); //commented out to see what happens
app.use(express.json());

//connect to the database
mongoose.connect("mongodb://localhost:27017/personal-library-manager")
    .then(() => {
        console.log("connected to database");
    })
    .catch(err => {
        console.log("error connecting to database", err);
    });

//endpoints
app.get("/", async (req, res) => {
    await Item.find()
    .then((result) => {
        console.log(result);
        res.send(result);
    })
    .catch(err => {
        console.log(err);
    });
})

//set up server
app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
})