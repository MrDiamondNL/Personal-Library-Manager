const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: String
    },
    isbn: {
        type: Number
    },
    coverImage: {
        type: String
    }
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;