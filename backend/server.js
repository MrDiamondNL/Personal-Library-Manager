require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Item = require("./models/Item.js");
const connectToDb = require("./db.js");

const app = express();
const port = 5000;
let activeDb = "library"

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//connect to the database
connectToDb().then(result => {
    app.listen(port, () => {
        console.log(`Server is running on localhost:${port}`);
    });
});

app.get("/", (req, res) => {
    Item.find()
        .then((result) => {
            res.status(201).send({"Response": "success"});
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Could not fetch collection");
        })
})

app.post("/library", (req, res) => {
    let newItem = new Item(req.body);
    newItem.save()
        .then(() => {
            console.log("item added succesfully");
            // res.status(201).send("Item added successfully");
            res.redirect("http://localhost:5173/");
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("error adding item");
        });    
})

