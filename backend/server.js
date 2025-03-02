require("dotenv").config();

const serviceAccount = require("./serivceAccountKey.js");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Item = require("./models/Item.js");
const connectToDb = require("./db.js");

const NUM_OF_COMMENTS = -3;

const app = express();
const port = 5000;
let activeDb = "library"

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: process.env.ORIGIN_URL, // Allow requests from your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  }));

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

app.get("/details/:id", (req, res) => {
    const id = req.params.id;
    Item.findById(id)
    .then(result => {
        res.status(201).send(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send("Could not find item");
    })
})

app.post("/library", (req, res) => {
    let newItem = new Item(req.body);
    console.log(req.body);
    newItem.save()
        .then(() => {
            console.log("item added succesfully");
            res.status(201).send("Item added successfully");
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("error adding item");
        });    
});

app.put("/lend", async (req, res) => {
    try {
        const updateItemID = new mongoose.Types.ObjectId(req.body.id);
        const email = req.body.email;
    
        console.log(`Attempting to find item with ID:${updateItemID} in database`);

        const result = await Item.findByIdAndUpdate(
            updateItemID, 
            {
                lentEmail: email,
                isLent: true
            });

        if(result) {
            console.log("Item was successfully updated", result);
            res.status(200).json({message: "Item was successfully updated"});            
        } else {
            res.status(404).json({ message: "Item was not found"});
        }
    } catch (err) {
        console.error("Error updating item:", err);
        res.status(500).json({ message: "Error updating item" });
    }
});

app.put("/return", async (req, res) => {
    try {
        const updateItemID = new mongoose.Types.ObjectId(req.body.id);
    
        console.log(`Attempting to find item with ID:${updateItemID} in database`);

        const result = await Item.findByIdAndUpdate(
            updateItemID, 
            {
                lentEmail: null,
                isLent: false
            });

        if(result) {
            console.log("Item was successfully returned", result);
            res.status(200).json({message: "Item was successfully returned"});            
        } else {
            res.status(404).json({ message: "Item was not found"});
        }
    } catch (err) {
        console.error("Error updating item:", err);
        res.status(500).json({ message: "Error updating item" });
    }
});

app.put("/comment", async (req, res) => {
    try {
        const commentItemID = new mongoose.Types.ObjectId(req.body.id);
        const itemComment = req.body.comment;
        console.log(`Attempting to add comment to Item with ID: ${commentItemID}`);

        const newComment = {
            text: itemComment,
            date: Date.now(),
        };

        console.log(newComment);

        const result = await Item.findByIdAndUpdate(
            commentItemID,
            {
                $push: {
                    comments: {
                        $each: [newComment], 
                        $slice: NUM_OF_COMMENTS 
                    }
                }
            },
            { new: true }
        );

        if (result) {
            console.log("Item successfully updated", result);
            res.status(200).json({ message: "Entry was successfully commented" });
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (error) {
        console.error("Error commenting Item: ", error);
        res.status(500).json({message: "Item not commented"});
    }
});

app.delete("/delete", async (req, res) => {
    try {
        let deleteItemID = new mongoose.Types.ObjectId(req.body.id);
        console.log(`Attempting to delete item with ID: ${deleteItemID}`);

        const result = await Item.findByIdAndDelete(deleteItemID);

        if (result) {
            console.log("Item successfully deleted:", result);
            res.status(200).json({ message: "Entry was successfully deleted" });
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).json({ message: "Error deleting item" });
    }
});

