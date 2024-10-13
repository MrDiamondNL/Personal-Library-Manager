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
            res.status(201).send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Could not fetch collection");
        })
});

app.post("/library", (req, res) => {
    let newItem = new Item(req.body);
    newItem.save()
        .then(() => {
            console.log("item added succesfully");
            // res.status(201).send("Item added successfully");
            res.redirect("https://localhost:5173/");
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("error adding item");
        });    
});

app.delete("/delete", async (req, res) => {
    try {
        // Convert the ID to ObjectId
        let deleteItemID = mongoose.Types.ObjectId(req.body.id);
        console.log(`Attempting to delete item with ID: ${deleteItemID}`);

        // Try to find and delete the item
        const result = await Item.findByIdAndDelete(deleteItemID);

        if (result) {
            // If item is found and deleted, respond with success
            console.log("Item successfully deleted:", result);
            res.status(200).json({ message: "Entry was successfully deleted" });
        } else {
            // If item wasn't found, respond with not found
            res.status(404).json({ message: "Item not found" });
        }
    } catch (err) {
        // If any error occurs, log and respond with error status
        console.error("Error deleting item:", err);
        res.status(500).json({ message: "Error deleting item" });
    }
});

