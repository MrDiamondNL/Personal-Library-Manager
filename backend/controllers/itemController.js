const Item = require("../models/Item");
const mongoose = require("mongoose");
const NUM_OF_COMMENTS = -3;

module.exports.getAllItems = (req, res) => {
    Item.find()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            throw CustomError.notFound("Could not fetch collection");
        })
}

module.exports.getItemDetails = (req, res) => {
    const id = req.params.id;
    Item.findById(id)
    .then(result => {
        res.status(201).send(result);
    })
    .catch(err => {
        throw CustomError.notFound("Could not find item");
    })
}

module.exports.saveItemToLibrary = (req, res) => {
    let newItem = new Item(req.body);
    try {
        newItem.save()
        .then(() => {
            res.status(201).send("Item added successfully");
        })
        .catch(err => {
            throw CustomError.internalServer("Failed to save item");
        }); 
    } catch (err) {

    }
       
}

module.exports.lendItem = async (req, res) => {
    
    try {
        const updateItemID = new mongoose.Types.ObjectId(req.body.id);
        const email = req.body.email;
        throw new Error();
        console.log(`Attempting to find item with ID:${updateItemID} in database`);

        const result = await Item.findByIdAndUpdate(
            updateItemID, 
            {
                lentEmail: email,
                isLent: true
            });

        if(result) {
            res.status(200).json({message: "Item was successfully updated"});            
        } else {
            throw CustomError.notFound("Could not find item");
        }
    } catch (err) {
        throw CustomError.internalServer("Failed to update");
    }
}

module.exports.returnItem = async (req, res) => {
    try {
        const updateItemID = new mongoose.Types.ObjectId(req.body.id);

        const result = await Item.findByIdAndUpdate(
            updateItemID, 
            {
                lentEmail: null,
                isLent: false
            });

        if(result) {
            res.status(200).json({message: "Item was successfully returned"});            
        } else {
            throw CustomError.notFound("Could not find item");
        }
    } catch (err) {
        throw CustomError.internalServer("Failed to save");
    }
}

module.exports.deleteItem = async (req, res) => {
    try {
        let deleteItemID = new mongoose.Types.ObjectId(req.body.id);

        const result = await Item.findByIdAndDelete(deleteItemID);

        if (result) {
            console.log("Item successfully deleted:", result);
            res.status(200).json({ message: "Entry was successfully deleted" });
        } else {
            throw CustomError.notFound("Could not find item");
        }
    } catch (err) {
        throw CustomError.internalServer("Failed to save");
    }
}

module.exports.updateComments = async (req, res) => {
    try {
        const commentItemID = new mongoose.Types.ObjectId(req.body.id);
        const itemComment = req.body.comment;

        const newComment = {
            text: itemComment,
            date: Date.now(),
        };

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
            res.status(200).json({ message: "Entry was successfully commented" });
        } else {
            throw CustomError.notFound("Could not find item");
        }
    } catch (error) {
        throw CustomError.internalServer("Failed to save");
    }
}

