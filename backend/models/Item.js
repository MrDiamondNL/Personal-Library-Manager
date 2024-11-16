const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentsSchema = new Schema ({
    text: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

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
        default: ""
    },
    author: {
        type: String
    },
    isbn: {
        type: String
    },
    coverImage: {
        type: String,
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
        default: null
    },
    comments: [commentsSchema]
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;