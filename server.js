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

// let db

// connectToDb((err) => {
    // if (!err) {
    //     app.listen(port, () => {
    //         console.log(`Server is running on localhost:${port}`);
    //     });
//         db = getDb();
//     }
// })

// mongoose.connect("mongodb://localhost:27017/personal-library-manager")
//     .then(() => {
//         console.log("connected to database");
//     })
//     .catch(err => {
//         console.log("error connecting to database", err);
//     });

//endpoints
// app.get("/", (req, res) => {
    
//     db.collection(activeDb)
//     .find()
//     .toArray()
//     .then((result) => {
//         res.json(result);
//     })
//     .catch(err => {
//         console.log(err);
//     });
    
    
// })

app.get("/", (req, res) => {
    Item.find()
        .then((result) => {
            res.status(201).send(result);
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
            res.status(201).send("Item added successfully");
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("error adding item");
        });    
})

// db.collection(activeDb).insertOne(newItem)
    //     .then(result => {
    //         res.status(201).json(result);
    //     })
    //     .catch(err => {
    //         res.status(500).json({err: "Could not create a new entry"});
    //     })