const Item = require("../models/Item");
const mongoose = require("mongoose");
const NUM_OF_COMMENTS = -3;
const CustomError = require("../utils/customError");
const CustomSuccess = require("../utils/customSuccess")

module.exports.getAllItems = (req, res, next) => {
    if (!req.user) {
        return next(CustomError.unauthorized("User not authenticated"));
    }

    console.log(req.user.id);
    
    const user = req.user.id;
    return Item.find({ user: user })
        .then((result) => {
            const response = new CustomSuccess("Library found", 200, result);
            res.status(response.statusCode).json(response);
        })
        .catch((err) => {
            next(CustomError.notFound("Could not fetch collection"));
        });
}

module.exports.getItemDetails = (req, res, next) => {
    const id = req.params.id;
    return Item.findById(id)
    .then(result => {
        const response = new CustomSuccess("Item Details found", 200, result);
        res.status(response.statusCode).json(response);
    })
    .catch(err => {
        next(CustomError.notFound("Could not find item"));
    })
}

module.exports.saveItemToLibrary = async (req, res, next) => {
    try {
        let newItem = new Item(req.body);
        await newItem.save()
        .then(() => {
            const response = new CustomSuccess("Item saved to Library", 201);
            res.status(response.statusCode).json(response);
        })
        .catch(err => {
            next(CustomError.internalServer("Failed to save item"));
        });
    }
    catch (err) {
        next(CustomError.internalServer("Congrats, you broke it all"));
    }
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
            const response = new CustomSuccess("Item Updated", 200);
            res.status(response.statusCode).json(response);         
        } else {
            console.log("Item not found, calling CustomError.notFound");
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
            const response = new CustomSuccess("Item Returned", 200);
            res.status(response.statusCode).json(response);           
        } else {
            next(CustomError.notFound("Could not find item"));
        }
    } catch (err) {
        next(CustomError.internalServer("Failed to update"));
    }
}

module.exports.deleteItem = async (req, res, next) => {
    try {
        let deleteItemID = new mongoose.Types.ObjectId(req.body.id);

        const result = await Item.findByIdAndDelete(deleteItemID);

        if (result) {
            const response = new CustomSuccess("Item Deleted", 200);
            res.status(response.statusCode).json(response);  
        } else {
            next(CustomError.notFound("Could not find item"));
        }
    } catch (err) {
        next(CustomError.internalServer("Failed to Delete"));
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
            const response = new CustomSuccess("Comments Updated", 200);
            res.status(response.statusCode).json(response);  
        } else {
            next(CustomError.notFound("Could not find item"));
        }
    } catch (error) {
        next(CustomError.internalServer("Failed to save"));
    }
}

