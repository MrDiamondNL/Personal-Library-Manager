const Item = require("../models/Item");
const mongoose = require("mongoose");
const NUM_OF_COMMENTS = -3;

module.exports.getAllItems = (req, res) => {
    Item.find()
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Could not fetch collection");
        })
}

module.exports.getItemDetails = (req, res) => {
    const id = req.params.id;
    Item.findById(id)
    .then(result => {
        res.status(201).send(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send("Could not find item");
    })
}

module.exports.saveItemToLibrary = (req, res) => {
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
}

module.exports.lendItem = async (req, res) => {
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
}

module.exports.returnItem = async (req, res) => {
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
}

module.exports.deleteITem = async (req, res) => {
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
}

module.exports.updateComments = async (req, res) => {
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
}

