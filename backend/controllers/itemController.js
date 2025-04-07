const Item = require("../models/Item");
const mongoose = require("mongoose");
const NUM_OF_COMMENTS = -3;
const CustomError = require("../utils/customError");

module.exports.getAllItems = (req, res, next) => {
    if (!req.user) {
        return next(CustomError.unauthorized("User not authenticated"));
    }

    console.log(req.user.id);
    
    const user = req.user.id;
    Item.find({ user: user })
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            next(CustomError.notFound("Could not fetch collection"));
        })
}

module.exports.getItemDetails = (req, res, next) => {
    const id = req.params.id;
    Item.findById(id)
    .then(result => {
        res.status(201).send(result);
    })
    .catch(err => {
        next(CustomError.notFound("Could not find item"));
    })
}

module.exports.saveItemToLibrary = (req, res, next) => {
    let newItem = new Item(req.body);
    newItem.save()
        .then(() => {
            res.status(201).send("Item added successfully");
        })
        .catch(err => {
            next(CustomError.internalServer("Failed to save item"));
        });
}

module.exports.lendItem = async (req, res, next) => {    
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
            res.status(200).json({message: "Item was successfully updated"});            
        } else {
            next(CustomError.notFound("Could not find item"));
        }
    } catch (err) {
        next(CustomError.internalServer("Failed to update"));
    }
}

module.exports.returnItem = async (req, res, next) => {
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
            next(CustomError.notFound("Could not find item"));
        }
    } catch (err) {
        next(CustomError.internalServer("Failed to save"));
    }
}

module.exports.deleteItem = async (req, res, next) => {
    try {
        let deleteItemID = new mongoose.Types.ObjectId(req.body.id);

        const result = await Item.findByIdAndDelete(deleteItemID);

        if (result) {
            res.status(200).json({ message: "Entry was successfully deleted" });
        } else {
            next(CustomError.notFound("Could not find item"));
        }
    } catch (err) {
        next(CustomError.internalServer("Failed to save"));
    }
}

module.exports.updateComments = async (req, res, next) => {
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
            next(CustomError.notFound("Could not find item"));
        }
    } catch (error) {
        next(CustomError.internalServer("Failed to save"));
    }
}

