const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        default: "Book"
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
    },
    user: {
        type: String,
        required: true
    },
    isLent: {
        type: Boolean,
        default: false
    },
    lentEmail: {
        type: String,
    }
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;